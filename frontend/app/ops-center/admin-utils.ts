import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/admin/access';
import type { User } from '@supabase/supabase-js';

export type AdminContext = {
  user: User;
  metadataRoles: string[];
};

export async function getAdminContext(): Promise<AdminContext> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    redirect('/');
  }

  const metadataRoles: string[] = Array.isArray(user.app_metadata?.roles)
    ? (user.app_metadata.roles as string[])
    : [];

  return {
    user,
    metadataRoles,
  };
}
