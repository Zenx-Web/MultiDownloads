/// <reference types="node" />
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const args: string[] = process.argv.slice(2);
const emailArg = args.find((arg: string) => arg.startsWith('--email='));

if (!emailArg) {
  console.error('Usage: ts-node scripts/grant-admin.ts --email=user@example.com');
  process.exit(1);
}

const emailArgValue = emailArg;
const targetEmail = emailArgValue.split('=')[1]?.toLowerCase();

if (!targetEmail) {
  console.error('Invalid email provided.');
  process.exit(1);
}

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_PROJECT_URL;

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or service role key environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function grantAdmin() {
  const pageSize = 200;
  let page = 1;
  let user = null;

  while (!user) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: pageSize });

    if (error) {
      console.error('Failed to list users:', error.message);
      process.exit(1);
    }

    user = data.users.find((u) => u.email?.toLowerCase() === targetEmail) || null;

    if (user || data.users.length < pageSize) {
      break;
    }

    page += 1;
  }

  if (!user) {
    console.error(`No user found with email ${targetEmail}`);
    process.exit(1);
  }

  const targetUser = user!;

  const existingRoles = Array.isArray(targetUser.app_metadata?.roles)
    ? (targetUser.app_metadata?.roles as string[])
    : [];

  const dedupedRoles = Array.from(new Set([...existingRoles.map((r) => r.toLowerCase()), 'admin']));

  const updatePayload = {
    app_metadata: {
      ...(targetUser.app_metadata || {}),
      role: 'admin',
      is_admin: true,
      roles: dedupedRoles,
    },
    user_metadata: {
      ...(targetUser.user_metadata || {}),
      role: 'admin',
      is_admin: true,
    },
  } as const;

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, updatePayload);

  if (updateError) {
    console.error('Failed to update user metadata:', updateError.message);
    process.exit(1);
  }

  console.log(`Granted admin access to ${targetEmail} (user id: ${targetUser.id}).`);
}

grantAdmin();
