# MIDG3 🛍️💕

A pink, mobile-first resale storefront — like Vinted, but **her own**. The owner
uploads photos and descriptions, customers browse, save favourites and follow the
shop to build a loyal customer base.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Supabase**
(database · auth · image storage) and deployed on **Netlify**.

## ✨ Features

- **Beautiful pink, mobile-first design** with a bottom tab bar, big edge-to-edge
  photos and a sticky "Message to buy" bar — built around what actually converts
  shoppers on phones.
- **Owner uploads listings** (Vinted-style): drag in up to 8 photos, write a
  description, set price / brand / size / condition — and it's live.
- **Customer accounts**: sign up, save favourites (wishlist), and follow the shop.
- **Loyalty loop**: "Follow the shop" email capture so the owner can tell fans
  first about new arrivals — the foundation of a repeat customer base.
- **Conversion tactics baked in**: condition trust-badges, "was" price
  reductions, one-of-a-kind scarcity cues, social proof, trust signals, fast
  category filters and search.
- **Works before the backend is connected** — the shop renders with sample stock
  so you can see the design immediately, then switches to live data automatically
  once Supabase keys are added.

## 🚀 Getting it live

### 1. Supabase (database + photos + logins)

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase/migrations/0001_init.sql`.
3. Set the shop owner's email so she becomes admin automatically:
   ```sql
   update app_config set owner_email = 'her@email.com';
   ```
4. Grab **Project URL** and **anon public key** from *Project Settings → API*.

### 2. Environment variables

Copy `.env.example` → `.env.local` (local) and add the same in Netlify
(*Site settings → Environment variables*):

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_OWNER_EMAIL` | Owner's email (auto-admin) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Where "Message to buy" emails go |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number for quick-buy (digits only, e.g. `447…`) |

### 3. Netlify

- Connect this repo. Build settings come from `netlify.toml`
  (`npm run build`, Next.js runtime plugin).
- Add the environment variables above, then deploy.

### 4. First run

- The owner signs up at `/signup` using `NEXT_PUBLIC_OWNER_EMAIL`.
- She's automatically the shop owner and can add items at `/sell` and manage
  them at `/dashboard`.

## 🧑‍💻 Local development

```bash
npm install
cp .env.example .env.local   # optional — omit to preview with sample stock
npm run dev
```

Open http://localhost:3000.

```bash
npm run build      # production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```

## 🗂️ Structure

```
app/            Routes (home, shop, item, favourites, account, sell, dashboard, auth)
components/     UI (header, bottom nav, product card, gallery, buy bar, forms…)
lib/            Data access, Supabase clients, types, sample stock
supabase/       SQL schema + RLS + storage policies
```

Made with 💕. Pre-loved, re-loved.
