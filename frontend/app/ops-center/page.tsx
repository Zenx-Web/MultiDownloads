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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <section className="flex flex-col gap-3 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] font-bold text-blue-400">OPS CONSOLE</p>
        <h1 className="text-4xl font-bold text-white">Secure Control Room</h1>
        <p className="text-base text-gray-200">
          Path&nbsp;
          <span className="font-mono font-bold text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{ADMIN_CONFIG.path}</span>
          &nbsp;is hidden from navigation. Share it only with trusted staff.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-green-300">Signed in as</p>
          <p className="mt-2 text-xl font-bold text-white">{user?.email}</p>
          <p className="mt-3 text-sm font-semibold text-green-300">User ID</p>
          <p className="font-mono text-sm text-gray-200 bg-gray-800/50 p-2 rounded mt-1 break-all">{user?.id}</p>
        </div>
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-purple-300">Metadata roles</p>
          <p className="mt-3 flex flex-wrap gap-2">
            {metadataRoles.length ? (
              metadataRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-purple-600/40 border border-purple-400/50 px-4 py-1.5 text-sm font-bold text-purple-100 shadow-md"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400">No roles attached</span>
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-blue-300">Quick links</p>
          <div className="mt-3 flex flex-col space-y-2.5 text-sm">
            <Link href="/pricing" className="text-blue-200 font-semibold hover:text-blue-100 underline-offset-2 hover:underline transition-colors">
              Subscription plans
            </Link>
            <Link href="/tools" className="text-blue-200 font-semibold hover:text-blue-100 underline-offset-2 hover:underline transition-colors">
              Tool catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-orange-200">Admin Actions</h2>
          <p className="mt-3 text-base text-gray-200 font-medium">
            Wire up custom dashboards (limits, bans, subscription changes) here. Use this space for
            secured components only.
          </p>
          <ul className="mt-5 list-disc space-y-2.5 pl-6 text-base text-gray-100">
            <li className="font-medium">Connect Supabase RPC/functions for user limits</li>
            <li className="font-medium">Expose job queue health widgets</li>
            <li className="font-medium">Trigger manual ban/unban & usage resets</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-900/20 to-cyan-900/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-teal-200">Operational Notes</h2>
          <p className="mt-3 text-base text-gray-200 font-medium">
            Keep an internal log of recent administrative actions so multiple operators stay in sync.
          </p>
          <div className="mt-5 space-y-3 text-base text-gray-100">
            <p className="font-medium">• Add real metrics/components once backend endpoints are ready.</p>
            <p className="font-medium">• Consider wiring IP allowlists or hardware tokens before launch.</p>
            <p className="font-medium">• Rotate the secret path periodically for best hygiene.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
