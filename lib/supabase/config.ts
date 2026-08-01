// Central place to read Supabase env + know whether the backend is wired up yet.
// Before the project is provisioned the site still renders (using sample stock),
// so every consumer must guard on `isSupabaseConfigured`.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
