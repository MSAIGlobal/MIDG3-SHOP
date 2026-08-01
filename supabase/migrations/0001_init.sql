-- ════════════════════════════════════════════════════════════════════════════
-- MIDG3 — initial schema
-- Profiles, listings, images, favourites, followers (loyalty) and enquiries,
-- with Row Level Security so only the shop owner can manage stock.
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── App config ───────────────────────────────────────────────────────────────
-- Single-row table holding the owner's email. Whoever signs up with this email
-- automatically becomes the shop owner (is_admin = true).
create table if not exists public.app_config (
  id           int primary key default 1,
  owner_email  text,
  constraint app_config_singleton check (id = 1)
);
insert into public.app_config (id, owner_email)
  values (1, null)
  on conflict (id) do nothing;

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Listings ─────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id             uuid primary key default gen_random_uuid(),
  seller_id      uuid references public.profiles(id) on delete set null,
  title          text not null,
  description    text not null default '',
  price          numeric(10,2) not null default 0,
  original_price numeric(10,2),
  currency       text not null default 'GBP',
  category       text not null default 'skincare',
  subcategory    text, -- e.g. clothing audience: adults | kids | elders
  size           text,
  brand          text,
  color          text,
  condition      text not null default 'Good',
  status         text not null default 'active'
                   check (status in ('active','reserved','sold')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists listings_status_created_idx
  on public.listings (status, created_at desc);
create index if not exists listings_category_idx on public.listings (category);

-- ── Listing images ───────────────────────────────────────────────────────────
create table if not exists public.listing_images (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists listing_images_listing_idx
  on public.listing_images (listing_id, position);

-- ── Favourites (customer wishlist) ───────────────────────────────────────────
create table if not exists public.favourites (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- ── Followers (loyal customer base / newsletter) ─────────────────────────────
create table if not exists public.followers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  user_id     uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ── Enquiries ("Message to buy") ─────────────────────────────────────────────
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references public.listings(id) on delete set null,
  name        text,
  email       text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ── Orders (basket / Buy Now purchases) ──────────────────────────────────────
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  ref          text not null,
  buyer_name   text,
  buyer_email  text,
  item_total   numeric(10,2) not null default 0,
  postage      numeric(10,2) not null default 0,
  total        numeric(10,2) not null default 0,
  currency     text not null default 'GBP',
  status       text not null default 'placed'
                 check (status in ('placed','paid','cancelled','refunded')),
  created_at   timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  listing_id  uuid references public.listings(id) on delete set null,
  title       text not null,
  price       numeric(10,2) not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── Testimonials (buyer feedback quotes) ─────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  author      text,
  rating      int not null default 5 check (rating between 1 and 5),
  created_at  timestamptz not null default now()
);
create index if not exists testimonials_created_idx
  on public.testimonials (created_at desc);

-- ── Triggers ─────────────────────────────────────────────────────────────────
-- Auto-create a profile when a user signs up; promote to owner if their email
-- matches app_config.owner_email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  configured_owner text;
begin
  select owner_email into configured_owner from public.app_config where id = 1;
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    configured_owner is not null and lower(new.email) = lower(configured_owner)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep listings.updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_touch_updated on public.listings;
create trigger listings_touch_updated
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- Helper: is the current user the shop owner?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════════════
alter table public.profiles       enable row level security;
alter table public.listings       enable row level security;
alter table public.listing_images enable row level security;
alter table public.favourites     enable row level security;
alter table public.followers      enable row level security;
alter table public.inquiries      enable row level security;
alter table public.testimonials   enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- Profiles: a user sees & edits only their own row.
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

-- Listings: anyone can browse; only the owner can write.
create policy "listings public read" on public.listings for select using (true);
create policy "listings owner write" on public.listings for all
  using (public.is_admin()) with check (public.is_admin());

-- Listing images: public read; owner writes.
create policy "images public read" on public.listing_images for select using (true);
create policy "images owner write" on public.listing_images for all
  using (public.is_admin()) with check (public.is_admin());

-- Favourites: each customer manages their own wishlist.
create policy "favourites own read"   on public.favourites for select using (auth.uid() = user_id);
create policy "favourites own insert" on public.favourites for insert with check (auth.uid() = user_id);
create policy "favourites own delete" on public.favourites for delete using (auth.uid() = user_id);

-- Followers: anyone (even signed-out) can follow/subscribe; owner reads the list.
create policy "followers public insert" on public.followers for insert with check (true);
create policy "followers owner read"    on public.followers for select using (public.is_admin());

-- Enquiries: anyone can send; owner reads.
create policy "inquiries public insert" on public.inquiries for insert with check (true);
create policy "inquiries owner read"    on public.inquiries for select using (public.is_admin());

-- Testimonials: everyone can read the feedback wall; only the owner manages it.
create policy "testimonials public read" on public.testimonials for select using (true);
create policy "testimonials owner write" on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

-- Orders: anyone can place an order (checkout); only the owner reads them
-- (they hold personal + financial data for HMRC record-keeping).
create policy "orders public insert"     on public.orders for insert with check (true);
create policy "orders owner read"         on public.orders for select using (public.is_admin());
create policy "orders owner update"       on public.orders for update using (public.is_admin());
create policy "order_items public insert" on public.order_items for insert with check (true);
create policy "order_items owner read"    on public.order_items for select using (public.is_admin());

-- ════════════════════════════════════════════════════════════════════════════
-- Storage — product photos
-- ════════════════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public)
  values ('listing-images', 'listing-images', true)
  on conflict (id) do nothing;

create policy "listing images public read" on storage.objects for select
  using (bucket_id = 'listing-images');
create policy "listing images owner write" on storage.objects for all
  using (bucket_id = 'listing-images' and public.is_admin())
  with check (bucket_id = 'listing-images' and public.is_admin());
