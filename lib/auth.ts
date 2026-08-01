import 'server-only';
import { createClient } from './supabase/server';
import { OWNER_EMAIL } from './constants';
import { isAdminSession, adminEmail } from './admin';

export interface SessionUser {
  id: string;
  email: string;
  isOwner: boolean;
}

// Reads the current signed-in user on the server. The shop owner is whoever
// holds a valid fixed-credential admin session, signs in with OWNER_EMAIL, or
// is flagged is_admin in the DB. The admin session works without Supabase.
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isAdminSession()) {
    return { id: 'owner-admin', email: adminEmail(), isOwner: true };
  }

  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let isOwner =
    !!OWNER_EMAIL && user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

  if (!isOwner) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
    isOwner = Boolean(profile?.is_admin);
  }

  return { id: user.id, email: user.email ?? '', isOwner };
}
