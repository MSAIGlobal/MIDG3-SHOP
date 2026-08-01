import 'server-only';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { OWNER_EMAIL } from './constants';
import { isAdminSession, adminEmail } from './admin';

export interface SessionUser {
  id: string;
  email: string;
  isOwner: boolean;
}

// Reads the current signed-in owner/user on the server.
//
// When Supabase is connected we rely on the real Supabase auth session — this
// is required so that the owner's browser has a session that satisfies RLS for
// uploads/writes. The owner is whoever matches OWNER_EMAIL or is flagged
// is_admin in the DB.
//
// Before Supabase is connected we fall back to the fixed-credential admin
// cookie so the owner can still reach the admin area.
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured) {
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

  // No backend yet — fixed-credential admin cookie.
  if (isAdminSession()) {
    return { id: 'owner-admin', email: adminEmail(), isOwner: true };
  }
  return null;
}
