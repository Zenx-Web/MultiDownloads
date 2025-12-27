import { supabaseAdmin } from '../config/supabase';
import { getPlan, normalizePlanId, hasExceededLimit, type PlanId } from '../config/plans';

/**
 * Get the current usage for a user today
 * Reads from both profiles.downloads_today and usage_stats table
 */
export const getCurrentUsage = async (userId: string): Promise<number> => {
  const todayDate = new Date().toISOString().slice(0, 10);

  // Query both tables in parallel
  const [profileResult, usageResult] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('downloads_today')
      .eq('id', userId)
      .maybeSingle(),
    supabaseAdmin
      .from('usage_stats')
      .select('downloads_count')
      .eq('user_id', userId)
      .eq('date', todayDate)
      .maybeSingle(),
  ]);

  // Prefer usage_stats (more authoritative) over profile counter
  const usageCount = usageResult.data?.downloads_count ?? 0;
  const profileCount = profileResult.data?.downloads_today ?? 0;

  return Math.max(usageCount, profileCount);
};

/**
 * Get user's plan information from database
 */
export const getUserPlanFromDB = async (userId: string): Promise<{ planId: PlanId; downloadsUsedToday: number }> => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('subscription_tier, plan_id, downloads_today')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[usageService] Failed to fetch user plan:', error);
    return { planId: 'free', downloadsUsedToday: 0 };
  }

  const planSource = profile?.plan_id || profile?.subscription_tier || 'free';
  const planId = normalizePlanId(planSource);
  const downloadsUsedToday = await getCurrentUsage(userId);

  return { planId, downloadsUsedToday };
};

/**
 * Check if user can download (hasn't exceeded daily limit)
 */
export const canUserDownload = async (userId: string): Promise<{ allowed: boolean; reason?: string; downloadsUsedToday: number }> => {
  const { planId, downloadsUsedToday } = await getUserPlanFromDB(userId);
  const plan = getPlan(planId);

  if (hasExceededLimit(plan, downloadsUsedToday)) {
    return {
      allowed: false,
      reason: `Daily download limit (${plan.dailyLimit}) exceeded. Upgrade your plan or try again tomorrow.`,
      downloadsUsedToday,
    };
  }

  return {
    allowed: true,
    downloadsUsedToday,
  };
};

/**
 * Record a successful download for a given Supabase user.
 * Updates both the lightweight profile counter and the aggregated usage table.
 * Returns the updated download count.
 */
export const recordDownloadUsage = async (userId?: string | null): Promise<number> => {
  if (!userId) {
    return 0;
  }

  try {
    const { error: profileError } = await supabaseAdmin.rpc('increment_download_count', {
      user_uuid: userId,
    });

    if (profileError) {
      throw profileError;
    }

    const { error: statsError } = await supabaseAdmin.rpc('update_usage_stats', {
      user_uuid: userId,
      download_count: 1,
      conversion_count: 0,
      bandwidth: 0,
    });

    if (statsError) {
      throw statsError;
    }

    // Return updated count
    return await getCurrentUsage(userId);
  } catch (error) {
    console.error(`[usageService] Failed to record download usage for ${userId}:`, error);
    return 0;
  }
};
