import 'server-only';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import type { PublicShopConfig } from './types';

const clean = (v?: string | null) => (v || '').trim();

// Public shop settings — payment handles + contact — read from the database
// (app_config, via the get_shop_config RPC) so they can be managed without
// redeploying or touching Netlify env. Falls back to env vars, then defaults.
export async function getShopConfig(): Promise<PublicShopConfig> {
  const env: PublicShopConfig = {
    revolutUsername: clean(process.env.NEXT_PUBLIC_REVOLUT_USERNAME),
    paypalUsername: clean(process.env.NEXT_PUBLIC_PAYPAL_USERNAME),
    contactEmail: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || 'hello@midg3.shop',
    whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP),
    facebookUrl: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    instagramUrl: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  };

  if (!isSupabaseConfigured) return env;
  const supabase = createClient();
  if (!supabase) return env;

  try {
    const { data } = await supabase.rpc('get_shop_config');
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return env;
    return {
      revolutUsername: clean(row.revolut_username) || env.revolutUsername,
      paypalUsername: clean(row.paypal_username) || env.paypalUsername,
      contactEmail: clean(row.contact_email) || env.contactEmail,
      whatsapp: clean(row.whatsapp) || env.whatsapp,
      facebookUrl: clean(row.facebook_url) || env.facebookUrl,
      instagramUrl: clean(row.instagram_url) || env.instagramUrl,
    };
  } catch {
    return env;
  }
}
