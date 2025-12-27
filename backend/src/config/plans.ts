export type PlanId = 'free' | 'pro' | 'exclusive';

export type ToolAccess = 'basic' | 'all';

export interface PlanConfig {
  id: PlanId;
  label: string;
  priceMonthly: number;
  dailyLimit: number | null; // null = unlimited
  features: string[];
  toolAccess: ToolAccess;
}

const PLAN_ORDER: PlanId[] = ['free', 'pro', 'exclusive'];

const PLAN_ALIAS_MAP: Record<string, PlanId> = {
  free: 'free',
  pro: 'pro',
  exclusive: 'exclusive',
  premium: 'pro',
  enterprise: 'exclusive',
};

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
    dailyLimit: null, // unlimited
    features: ['Dedicated routing', 'All tools + early betas'],
    toolAccess: 'all',
  },
};

export const getPlan = (id: PlanId): PlanConfig => PLANS[id];

export const getAllPlans = (): PlanConfig[] => PLAN_ORDER.map((id) => PLANS[id]);

const coercePlanId = (value?: string | null): PlanId | null => {
  if (!value) {
    return null;
  }

  const key = String(value).toLowerCase().trim();
  return PLAN_ALIAS_MAP[key] || null;
};

export const normalizePlanId = (value?: string | null, fallback: PlanId = 'free'): PlanId => {
  return coercePlanId(value) || fallback;
};

export const getRemainingDownloads = (plan: PlanConfig, usedToday: number): number | null => {
  if (plan.dailyLimit === null) {
    return null; // unlimited
  }

  const used = Math.max(0, usedToday);
  return Math.max(plan.dailyLimit - used, 0);
};

/**
 * Check if a user has exceeded their daily download limit
 */
export const hasExceededLimit = (plan: PlanConfig, usedToday: number): boolean => {
  if (plan.dailyLimit === null) {
    return false; // unlimited plans never exceed
  }

  return usedToday >= plan.dailyLimit;
};
