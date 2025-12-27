import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPlan, getRemainingDownloads, normalizePlanId, type PlanId } from '@/lib/plans';

const PROFILE_TABLE = 'profiles';
const USAGE_TABLE = 'usage_stats';

const ensureNonNegativeNumber = (value?: number | null): number => {
  const parsed = Number(value ?? 0);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed < 0 ? 0 : parsed;
};

const todayDate = () => new Date().toISOString().slice(0, 10);

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // profiles: stores per-user plan flags + `downloads_today`
  const profilePromise = supabase
    .from(PROFILE_TABLE)
    .select('subscription_tier, downloads_today, plan_id')
    .eq('id', user.id)
    .maybeSingle();

  // usage_stats: aggregation table keyed by (user_id, date)
  const usagePromise = supabase
    .from(USAGE_TABLE)
    .select('downloads_count')
    .eq('user_id', user.id)
    .eq('date', todayDate())
    .maybeSingle();

  const [profileResult, usageResult] = await Promise.all([profilePromise, usagePromise]);

  if (profileResult.error && profileResult.error.code !== 'PGRST116') {
    console.error('[subscription] profile query failed', profileResult.error);
    return NextResponse.json({ error: 'Unable to load subscription profile' }, { status: 500 });
  }

  if (usageResult.error && usageResult.error.code !== 'PGRST116') {
    console.warn('[subscription] usage query failed, falling back to profile counter', usageResult.error);
  }

  const profile = profileResult.data ?? null;
  const usage = usageResult.data ?? null;

  const planSource =
    profile?.plan_id ||
    profile?.subscription_tier ||
    (user.app_metadata?.planId as string | undefined) ||
    (user.app_metadata?.subscriptionPlan as string | undefined) ||
    (user.app_metadata?.subscription_tier as string | undefined) ||
    (user.user_metadata?.planId as string | undefined) ||
    (user.user_metadata?.subscriptionPlan as string | undefined) ||
    (user.user_metadata?.subscription_tier as string | undefined);

  const planId: PlanId = normalizePlanId(planSource);
  const plan = getPlan(planId);

  const downloadsUsedToday = Math.max(
    0,
    ensureNonNegativeNumber(usage?.downloads_count ?? profile?.downloads_today ?? 0)
  );

  const downloadsRemainingToday = getRemainingDownloads(plan, downloadsUsedToday);

  return NextResponse.json(
    {
      planId,
      plan,
      downloadsUsedToday,
      downloadsRemainingToday,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
