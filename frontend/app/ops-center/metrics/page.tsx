import Link from 'next/link';
import { getAdminContext } from '../admin-utils';
import { fetchSystemStats } from '../system-stats';

export const dynamic = 'force-dynamic';

export default async function MetricsPage() {
  await getAdminContext();
  const stats = await fetchSystemStats();

  const formatNumber = (value: number) => value.toLocaleString('en-US');

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Admin Workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
            <p className="text-sm text-gray-500">Live stats sourced from the backend /admin/stats endpoint.</p>
          </div>
          <Link
            href="/ops-center"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Ops Center
          </Link>
        </div>

        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Jobs Completed" value={formatNumber(stats.jobsCompleted)} trend="Across current uptime" />
            <MetricCard label="Jobs Processing" value={formatNumber(stats.jobsProcessing)} trend="In-flight tasks" />
            <MetricCard label="Jobs Failed" value={formatNumber(stats.jobsFailed)} trend="Needs review" variant="warning" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard label="Total Jobs (Tracked)" value={formatNumber(stats.totalJobsTracked)} trend="Stored in memory" />
            <MetricCard label="Total Jobs (Created)" value={formatNumber(stats.totalJobsCreated)} trend="Since boot" />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            Connect this page to Prometheus, Logflare, or Fly logs when ready. The layout is ready for charts or streaming metrics.
          </div>
        </section>
      </div>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
  variant?: 'default' | 'warning';
};

function MetricCard({ label, value, trend, variant = 'default' }: MetricCardProps) {
  const border = variant === 'warning' ? 'border-amber-200' : 'border-gray-200';
  const accent = variant === 'warning' ? 'text-amber-600' : 'text-gray-500';

  return (
    <div className={`border ${border} rounded-lg p-4`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-sm ${accent} mt-1`}>{trend}</p>
    </div>
  );
}
