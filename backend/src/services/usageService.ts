import { supabaseAdmin } from '../config/supabase';

/**
 * Record a successful download for a given Supabase user.
 * Updates both the lightweight profile counter and the aggregated usage table.
 */
export const recordDownloadUsage = async (userId?: string | null): Promise<void> => {
  if (!userId) {
    return;
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
  } catch (error) {
    console.error(`[usageService] Failed to record download usage for ${userId}:`, error);
  }
};
