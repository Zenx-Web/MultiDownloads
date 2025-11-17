import { createClient } from '@supabase/supabase-js';
import { config } from './index';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Backend client with service role key (admin access)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Regular client with anon key (for user operations)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
