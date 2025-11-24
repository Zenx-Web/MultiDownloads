import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getAdminContext } from '../admin-utils';
import { createAdminServerClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const USERS_PATH = '/ops-center/users';

const encodeParam = (value: string) => encodeURIComponent(value);
const decodeParam = (value?: string) => (value ? decodeURIComponent(value) : undefined);

function buildRedirect(type: 'success' | 'error', message: string) {
  return `${USERS_PATH}?${type}=${encodeParam(message)}`;
}

async function setUserLimitsAction(formData: FormData) {
  'use server';
  const { user } = await getAdminContext();
  const targetUserId = String(formData.get('userId') || '').trim();
  const tier = String(formData.get('tier') || 'free');
  const limitValue = Number(formData.get('dailyLimit') || 0);
  const usageBucket = String(formData.get('usageBucket') || '').trim() || null;

  if (!targetUserId) {
    redirect(buildRedirect('error', 'User ID is required'));
  }

  if (!limitValue || Number.isNaN(limitValue) || limitValue < 1) {
    redirect(buildRedirect('error', 'Provide a valid daily limit'));
  }

  const adminClient = createAdminServerClient();
  if (!adminClient) {
    redirect(buildRedirect('error', 'Admin Supabase credentials missing'));
  }

  const { error } = await adminClient.rpc('set_user_limits', {
    target: targetUserId,
    new_daily_limit: limitValue,
    new_tier: tier,
    bucket: usageBucket,
    actor: user.id,
  });

  if (error) {
    redirect(buildRedirect('error', error.message));
  }

  revalidatePath(USERS_PATH);
  redirect(buildRedirect('success', 'Limits updated successfully'));
}

async function toggleBanAction(formData: FormData) {
  'use server';
  const { user } = await getAdminContext();
  const targetUserId = String(formData.get('userId') || '').trim();
  const action = String(formData.get('banAction') || 'ban');
  const reason = String(formData.get('reason') || '').trim() || null;

  if (!targetUserId) {
    redirect(buildRedirect('error', 'User ID is required to ban/unban'));
  }

  const adminClient = createAdminServerClient();
  if (!adminClient) {
    redirect(buildRedirect('error', 'Admin Supabase credentials missing'));
  }

  const shouldBan = action === 'ban';

  const { error } = await adminClient.rpc('toggle_user_ban', {
    target: targetUserId,
    should_ban: shouldBan,
    reason,
    actor: user.id,
  });

  if (error) {
    redirect(buildRedirect('error', error.message));
  }

  revalidatePath(USERS_PATH);
  redirect(buildRedirect('success', shouldBan ? 'User banned' : 'User unbanned'));
}

async function resetUsageAction(formData: FormData) {
  'use server';
  const { user } = await getAdminContext();
  const targetUserId = String(formData.get('userId') || '').trim();

  if (!targetUserId) {
    redirect(buildRedirect('error', 'User ID is required to reset usage'));
  }

  const adminClient = createAdminServerClient();
  if (!adminClient) {
    redirect(buildRedirect('error', 'Admin Supabase credentials missing'));
  }

  const { error } = await adminClient.rpc('reset_usage', {
    target: targetUserId,
    actor: user.id,
  });

  if (error) {
    redirect(buildRedirect('error', error.message));
  }

  revalidatePath(USERS_PATH);
  redirect(buildRedirect('success', 'Usage counters reset'));
}

async function addAdminNoteAction(formData: FormData) {
  'use server';
  const { user } = await getAdminContext();
  const targetUserId = String(formData.get('userId') || '').trim();
  const note = String(formData.get('note') || '').trim();

  if (!targetUserId || !note) {
    redirect(buildRedirect('error', 'User ID and note are required'));
  }

  const adminClient = createAdminServerClient();
  if (!adminClient) {
    redirect(buildRedirect('error', 'Admin Supabase credentials missing'));
  }

  const { error } = await adminClient.rpc('add_admin_note', {
    target: targetUserId,
    note,
    actor: user.id,
  });

  if (error) {
    redirect(buildRedirect('error', error.message));
  }

  revalidatePath(USERS_PATH);
  redirect(buildRedirect('success', 'Note added to audit log'));
}

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function UsersPanelPage({ searchParams }: PageProps) {
  const { user } = await getAdminContext();

  const successMessage =
    typeof searchParams?.success === 'string' ? decodeParam(searchParams.success) : undefined;
  const errorMessage = typeof searchParams?.error === 'string' ? decodeParam(searchParams.error) : undefined;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
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

        {(successMessage || errorMessage) && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              successMessage ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Subscription Controls</h2>
            <p className="text-sm text-gray-500">
              Update per-user limits, tiers, and usage buckets via the Supabase RPCs configured for this project.
            </p>
          </div>

          <form action={setUserLimitsAction} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              User ID
              <input
                name="userId"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="c99c7ade-..."
                required
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Daily download limit
              <input
                name="dailyLimit"
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="5"
                required
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Tier
              <select
                name="tier"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="free"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Usage bucket (optional)
              <input
                name="usageBucket"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="vip-alpha"
              />
            </label>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Save limits
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Account Safety</h2>
            <p className="text-sm text-gray-500">
              Ban/unban accounts, reset usage counts, and leave audit notes. All actions write to Supabase via RPCs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <form action={toggleBanAction} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Ban / Unban Account</h3>
              <label className="text-sm font-medium text-gray-700">
                User ID
                <input
                  name="userId"
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="c99c7ade-..."
                  required
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Action
                <select
                  name="banAction"
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ban">Ban</option>
                  <option value="unban">Unban</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Reason (optional)
                <input
                  name="reason"
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Fraudulent usage"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
              >
                Apply action
              </button>
            </form>

            <form action={resetUsageAction} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Reset Usage Counters</h3>
              <label className="text-sm font-medium text-gray-700">
                User ID
                <input
                  name="userId"
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="c99c7ade-..."
                  required
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700"
              >
                Reset usage
              </button>
            </form>
          </div>

          <form action={addAdminNoteAction} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Add Internal Audit Note</h3>
            <label className="text-sm font-medium text-gray-700">
              User ID
              <input
                name="userId"
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="c99c7ade-..."
                required
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Note
              <textarea
                name="note"
                rows={3}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Document investigation notes or manual overrides"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
            >
              Save note
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
