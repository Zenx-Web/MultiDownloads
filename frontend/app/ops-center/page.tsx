import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ADMIN_CONFIG, isAdminUser } from '@/lib/admin/access';

export const dynamic = 'force-dynamic';

async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export default async function OpsCenterPage() {
  const user = await getCurrentUser();
  const metadataRoles: string[] = Array.isArray(user?.app_metadata?.roles)
    ? (user?.app_metadata?.roles as string[])
    : [];

  if (!isAdminUser(user)) {
    redirect('/');
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-12">
      <section className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-6">
        <p className="text-xs uppercase tracking-wider text-gray-400">OPS CONSOLE</p>
        <h1 className="text-3xl font-bold text-white">Secure Control Room</h1>
        <p className="text-sm text-gray-300">
          Path&nbsp;
          <code className="font-mono text-sm text-cyan-400 bg-gray-900/50 px-2 py-0.5 rounded">{ADMIN_CONFIG.path}</code>
          &nbsp;is hidden from navigation. Share it only with trusted staff.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Signed in as</p>
          <p className="text-lg font-semibold text-white mb-4">{user?.email}</p>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">User ID</p>
          <p className="font-mono text-xs text-gray-400 bg-gray-900/50 p-2 rounded break-all">{user?.id}</p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Metadata roles</p>
          <div className="flex flex-wrap gap-2">
            {metadataRoles.length ? (
              metadataRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No roles attached</span>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Quick links</p>
          <div className="flex flex-col space-y-2">
            <Link href="/pricing" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              → Subscription plans
            </Link>
            <Link href="/tools" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              → Tool catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-6">
          <h2 className="text-xl font-bold text-white mb-3">Admin Actions</h2>
          <p className="text-sm text-gray-300 mb-4">
            Wire up custom dashboards (limits, bans, subscription changes) here. Use this space for secured components only.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Connect Supabase RPC/functions for user limits</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Expose job queue health widgets</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Trigger manual ban/unban & usage resets</span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur p-6">
          <h2 className="text-xl font-bold text-white mb-3">Operational Notes</h2>
          <p className="text-sm text-gray-300 mb-4">
            Keep an internal log of recent administrative actions so multiple operators stay in sync.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Add real metrics/components once backend endpoints are ready</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Consider wiring IP allowlists or hardware tokens before launch</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              <span>Rotate the secret path periodically for best hygiene</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
