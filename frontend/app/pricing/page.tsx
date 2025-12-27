'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { getAllPlans, type PlanConfig } from '@/lib/plans';

const formatPrice = (plan: PlanConfig) => `₹${plan.priceMonthly}/month`;

const formatLimit = (plan: PlanConfig) =>
  plan.dailyLimit === null ? 'Unlimited downloads' : `${plan.dailyLimit} downloads/day`;

export default function PricingPage() {
  const { plan: currentPlan, isLoading: subscriptionLoading } = useSubscription();
  const plans = getAllPlans();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Choose the plan that works best for you
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            const highlight = plan.id === 'pro';
            const buttonLabel = subscriptionLoading ? 'Syncing plan...' : isCurrent ? 'Current plan' : 'Choose plan';

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 p-8 shadow-lg transition hover:-translate-y-1 ${
                  highlight
                    ? 'border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                    : 'border-gray-100 bg-white'
                }`}
              >
                {highlight && (
                  <div className="mb-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Most popular
                  </div>
                )}
                <h2 className="text-2xl font-bold">{plan.label}</h2>
                <p className={`mt-2 text-sm ${highlight ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.toolAccess === 'all' ? 'Full suite of tools' : 'Essential toolset'}
                </p>
                <div className="mt-6 text-4xl font-bold">
                  {formatPrice(plan)}
                  <span className={`text-base font-medium ${highlight ? 'text-white/70' : 'text-gray-500'}`}>
                    {' '}
                    ({plan.toolAccess === 'all' ? 'All tools' : 'Basic tools'})
                  </span>
                </div>
                <div className={`mt-3 text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>
                  {formatLimit(plan)}
                </div>

                <ul className="mt-8 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span>
                        {highlight ? '✨' : '✓'}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                    isCurrent
                      ? highlight
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                      : highlight
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-600 text-white'
                  }`}
                  disabled={subscriptionLoading && isCurrent}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
