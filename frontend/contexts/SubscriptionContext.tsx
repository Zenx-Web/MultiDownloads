'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPlan, type PlanConfig, type PlanId } from '@/lib/plans';

interface SubscriptionSnapshot {
  planId: PlanId;
  plan: PlanConfig;
  downloadsUsedToday: number;
  downloadsRemainingToday: number | null;
}

interface SubscriptionContextValue extends SubscriptionSnapshot {
  isLoading: boolean;
  isError: boolean;
  refresh: () => Promise<void>;
}

const freePlan = getPlan('free');
const defaultSnapshot: SubscriptionSnapshot = {
  planId: 'free',
  plan: freePlan,
  downloadsUsedToday: 0,
  downloadsRemainingToday: freePlan.dailyLimit,
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  ...defaultSnapshot,
  isLoading: false,
  isError: false,
  refresh: async () => {
    /* no-op default */
  },
});

type SubscriptionApiPayload = {
  planId: PlanId;
  plan: PlanConfig;
  downloadsUsedToday: number;
  downloadsRemainingToday: number | null;
  error?: string;
};

const parsePayload = async (response: Response): Promise<SubscriptionApiPayload | null> => {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<SubscriptionSnapshot>(defaultSnapshot);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSnapshot(defaultSnapshot);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/me/subscription', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.status === 401) {
        setSnapshot(defaultSnapshot);
        setIsError(false);
        setIsLoading(false);
        return;
      }

      const payload = await parsePayload(response);

      if (!response.ok || !payload) {
        throw new Error(payload?.error || 'Failed to load subscription data');
      }

      const nextPlanId = (payload.planId || 'free') as PlanId;
      const planFromPayload = payload.plan ?? getPlan(nextPlanId);

      setSnapshot({
        planId: nextPlanId,
        plan: planFromPayload,
        downloadsUsedToday: Number(payload.downloadsUsedToday ?? 0),
        downloadsRemainingToday:
          typeof payload.downloadsRemainingToday === 'number' || payload.downloadsRemainingToday === null
            ? payload.downloadsRemainingToday
            : null,
      });
      setIsError(false);
    } catch (error) {
      console.error('[subscription] fetch failed', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    fetchSubscription();
  }, [authLoading, fetchSubscription]);

  const refresh = useCallback(async () => {
    if (authLoading) {
      return;
    }
    await fetchSubscription();
  }, [authLoading, fetchSubscription]);

  const value = useMemo(
    () => ({
      ...snapshot,
      isLoading,
      isError,
      refresh,
    }),
    [snapshot, isLoading, isError, refresh]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
