import { createClient } from '@supabase/supabase-js';
import { config } from './index';

if (!config.supabase.url) {
  throw new Error('Missing Supabase URL environment variable');
}

if (!config.supabase.anonKey) {
  throw new Error('Missing Supabase anon key environment variable');
}

// Regular client with anon key (for user operations)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Backend client with service role key (admin access) - optional in case
// the service role key is not provided in some environments.
export const supabaseAdmin = config.supabase.serviceRoleKey
  ? createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : supabase;
