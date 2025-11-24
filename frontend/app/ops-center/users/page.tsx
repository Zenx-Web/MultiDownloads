import Link from 'next/link';
import { getAdminContext } from '../admin-utils';

export const dynamic = 'force-dynamic';

export default async function UsersPanelPage() {
  const { user } = await getAdminContext();

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Admin Workspace</p>
            <h1 className="text-3xl font-bold text-gray-900">User Management Console</h1>
            <p className="text-sm text-gray-500">Signed in as {user.email}</p>
          </div>
          <Link
            href="/ops-center"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Ops Center
          </Link>
        </div>

        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Workflows</h2>
            <p className="text-sm text-gray-500">Plug these cards into Supabase RPCs when ready.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">Subscription Controls</h3>
              <ul className="mt-3 text-sm text-gray-600 space-y-2">
                <li>• Adjust per-user download limits</li>
                <li>• Promote/downgrade tier access</li>
                <li>• Assign custom usage buckets</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">Account Safety</h3>
              <ul className="mt-3 text-sm text-gray-600 space-y-2">
                <li>• Ban/unban accounts instantly</li>
                <li>• Reset usage counters</li>
                <li>• Add internal audit notes</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              Connect this view to Supabase by wiring RPC endpoints for listing users, searching, and
              mutating roles. The layout is ready for tables or command palettes when the backend is prepared.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
