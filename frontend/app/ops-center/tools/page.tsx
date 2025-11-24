import Link from 'next/link';
import { getAdminContext } from '../admin-utils';

export const dynamic = 'force-dynamic';

const toolChecks = [
  {
    title: 'Feature Toggles',
    items: ['Enable/disable downloaders', 'Gate new AI tools', 'Stage rollouts safely'],
  },
  {
    title: 'Maintenance Windows',
    items: ['Set read-only mode', 'Broadcast status message', 'Schedule downtime'],
  },
  {
    title: 'Cache Management',
    items: ['Invalidate stale assets', 'Rotate cookie jars', 'Reset CDN rules'],
  },
];

export default async function ToolManagementPage() {
  await getAdminContext();

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Admin Workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">Tool Management</h1>
            <p className="text-sm text-gray-500">Plan how you want to expose feature configuration through Supabase.</p>
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
            {toolChecks.map((group) => (
              <div key={group.title} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{group.title}</h3>
                <ul className="mt-3 text-sm text-gray-600 space-y-2">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            When the backend exposes configuration endpoints, hook them up here via React Server Actions
            or edge functions. Until then, this page documents the intended workflows for your ops team.
          </div>
        </section>
      </div>
    </main>
  );
}
