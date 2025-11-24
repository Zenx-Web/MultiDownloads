import type { User } from '@supabase/supabase-js';

export type PlanId = 'free' | 'pro' | 'exclusive';

export type ToolAccess = 'basic' | 'all';

export interface PlanConfig {
  id: PlanId;
  label: string;
  priceMonthly: number;
  dailyLimit: number | null;
  features: string[];
  toolAccess: ToolAccess;
}

const PLAN_ORDER: PlanId[] = ['free', 'pro', 'exclusive'];

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    label: 'Free',
    priceMonthly: 0,
    dailyLimit: 5,
    features: ['Essential downloaders', 'Basic toolset access'],
    toolAccess: 'basic',
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    priceMonthly: 50,
    dailyLimit: 100,
    features: ['Priority queueing', 'All tools unlocked'],
    toolAccess: 'all',
  },
  exclusive: {
    id: 'exclusive',
    label: 'Exclusive',
    priceMonthly: 250,
    dailyLimit: null,
    features: ['Dedicated routing', 'All tools + early betas'],
    toolAccess: 'all',
  },
};

export const getPlan = (id: PlanId): PlanConfig => PLANS[id];

export const getAllPlans = (): PlanConfig[] => PLAN_ORDER.map((id) => PLANS[id]);

type PlanAwareUser = Pick<User, 'user_metadata' | 'app_metadata'> & {
  planId?: PlanId;
  subscriptionPlan?: PlanId;
};

const readPlanIdFromUser = (user?: PlanAwareUser | null): PlanId => {
  if (!user) return 'free';

  const fromRoot = (user.planId || user.subscriptionPlan) as PlanId | undefined;
  if (fromRoot && PLANS[fromRoot]) {
    return fromRoot;
  }

  const fromMetadata = (user.user_metadata?.planId ||
    user.user_metadata?.subscriptionPlan ||
    user.user_metadata?.subscription_tier ||
    user.app_metadata?.planId ||
    user.app_metadata?.subscriptionPlan ||
    user.app_metadata?.subscription_tier) as PlanId | undefined;

  return fromMetadata && PLANS[fromMetadata] ? fromMetadata : 'free';
};

export const getUserPlan = (user?: PlanAwareUser | null): PlanConfig => {
  return getPlan(readPlanIdFromUser(user));
};

export const getRemainingDownloads = (plan: PlanConfig, usedToday: number): number | null => {
  if (plan.dailyLimit === null) {
    return null;
  }

  const used = Math.max(0, usedToday);
  return Math.max(plan.dailyLimit - used, 0);
};