-- ════════════════════════════════════════════════════════════════════════════
-- Shop settings — payment handles + contact, stored in app_config so they can be
-- managed without redeploying. Exposed publicly (minus owner_email) via an RPC.
-- ════════════════════════════════════════════════════════════════════════════

alter table public.app_config
  add column if not exists revolut_username text,
  add column if not exists paypal_username text,
  add column if not exists contact_email text,
  add column if not exists whatsapp text;

-- Public read of ONLY the non-sensitive shop settings (never owner_email).
create or replace function public.get_shop_config()
returns table(revolut_username text, paypal_username text, contact_email text, whatsapp text)
language sql stable security definer set search_path = public as $$
  select revolut_username, paypal_username, contact_email, whatsapp
  from public.app_config where id = 1;
$$;

grant execute on function public.get_shop_config() to anon, authenticated;
