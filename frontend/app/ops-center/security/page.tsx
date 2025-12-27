import Link from 'next/link';
import { getAdminContext } from '../admin-utils';

export const dynamic = 'force-dynamic';

const securityPlaybooks = [
  {
    title: 'Audit Trails',
    description: 'Mirror key admin actions into Supabase tables for compliance.',
    steps: ['Capture who performed the action', 'Store before/after metadata', 'Send webhook to Slack'],
  },
  {
    title: 'Alerting',
    description: 'Pipe error logs or suspicious spikes to PagerDuty/Telegram.',
    steps: ['Stream Fly logs to Logflare', 'Layer detection rules', 'Escalate critical alerts'],
  },
  {
    title: 'Access Controls',
    description: 'Document how IP allowlists or hardware tokens are enforced.',
    steps: ['Supabase row-level policies', 'Rate limiter overrides', 'Manual overrides history'],
  },
];

export default async function SecurityCenterPage() {
  await getAdminContext();

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Admin Workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">Security & Logs</h1>
            <p className="text-sm text-gray-500">Keep operators aligned on escalation procedures.</p>
          </div>
          <Link
            href="/ops-center"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Ops Center
          </Link>
        </div>

        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          {securityPlaybooks.map((play) => (
            <div key={play.title} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{play.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{play.description}</p>
              <ul className="mt-3 text-sm text-gray-600 space-y-2">
                {play.steps.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            When you wire Fly.io metrics or Supabase audit logs, surface them here so operations can act quickly.
          </div>
        </section>
      </div>
    </main>
  );
}
