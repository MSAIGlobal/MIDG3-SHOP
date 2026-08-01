import 'server-only';
import { createClient } from './supabase/server';
import { OWNER_EMAIL } from './constants';

export interface SessionUser {
  id: string;
  email: string;
  isOwner: boolean;
}

// Reads the current signed-in user on the server. The shop owner is whoever
// signs in with NEXT_PUBLIC_OWNER_EMAIL (or anyone flagged is_admin in the DB).
export async function getSessionUser(): Promise<SessionUser | null> {
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
