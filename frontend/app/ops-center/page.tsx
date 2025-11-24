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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <section className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-500">Ops Console</p>
        <h1 className="text-3xl font-semibold text-white">Secure Control Room</h1>
        <p className="text-base text-gray-300">
          Path&nbsp;
          <span className="font-mono text-blue-400">{ADMIN_CONFIG.path}</span>
          &nbsp;is hidden from navigation. Share it only with trusted staff.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Signed in as</p>
          <p className="mt-1 text-lg font-medium text-white">{user?.email}</p>
          <p className="text-sm text-gray-400">User ID</p>
          <p className="font-mono text-xs text-gray-300">{user?.id}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Metadata roles</p>
          <p className="mt-2 flex flex-wrap gap-2">
            {metadataRoles.length ? (
              metadataRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-200"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-300">No roles attached</span>
            )}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Quick links</p>
          <div className="mt-3 flex flex-col space-y-2 text-sm">
            <Link href="/pricing" className="text-blue-300 underline-offset-2 hover:underline">
              Subscription plans
            </Link>
            <Link href="/tools" className="text-blue-300 underline-offset-2 hover:underline">
              Tool catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Admin Actions</h2>
          <p className="mt-2 text-sm text-gray-300">
            Wire up custom dashboards (limits, bans, subscription changes) here. Use this space for
            secured components only.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-200">
            <li>Connect Supabase RPC/functions for user limits</li>
            <li>Expose job queue health widgets</li>
            <li>Trigger manual ban/unban & usage resets</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Operational Notes</h2>
          <p className="mt-2 text-sm text-gray-300">
            Keep an internal log of recent administrative actions so multiple operators stay in sync.
          </p>
          <div className="mt-4 space-y-3 text-sm text-gray-200">
            <p>- Add real metrics/components once backend endpoints are ready.</p>
            <p>- Consider wiring IP allowlists or hardware tokens before launch.</p>
            <p>- Rotate the secret path periodically for best hygiene.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
