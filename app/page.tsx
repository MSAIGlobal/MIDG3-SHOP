import Link from 'next/link';
import { getListings, getTestimonials } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryChips } from '@/components/CategoryChips';
import { TrustBar } from '@/components/TrustBar';
import { TestimonialScroller } from '@/components/TestimonialScroller';
import { FollowForm } from '@/components/FollowForm';
import { SHOP_TAGLINE } from '@/lib/constants';
import { SparkleIcon } from '@/components/icons';

export default async function HomePage() {
  const [newest, sold, testimonials] = await Promise.all([
    getListings({ sort: 'newest' }),
    getListings({ includeSold: true }),
    getTestimonials(),
  ]);
  const soldCount = sold.filter((l) => l.status === 'sold').length;

  return (
    <div className="space-y-10">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-midg-500 via-midg-400 to-midg-300 px-6 py-10 text-white shadow-soft sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            <SparkleIcon width={14} height={14} /> New arrivals every week
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Pre-loved treasures,
            <br />
            <span className="font-script font-normal">hand-picked with love</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">
            {SHOP_TAGLINE}. Unique fashion, bags &amp; homeware — described honestly and
            posted with care. Find your next favourite thing. 💕
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="btn bg-white text-midg-600 hover:bg-midg-50">
              Shop new in
            </Link>
            <Link href="/about" className="btn bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25">
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section>
        <CategoryChips />
      </section>

      {/* ── New in ───────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold text-plum sm:text-2xl">New in ✨</h2>
            <p className="text-sm text-plum/55">Freshly added — grab them before they’re gone</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-midg-600 hover:underline">
            See all →
          </Link>
        </div>
        <ProductGrid listings={newest.slice(0, 8)} />
      </section>

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <section>
        <TrustBar />
      </section>

      {/* ── Buyer feedback scroller ──────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="font-display text-xl font-extrabold text-plum sm:text-2xl">
              Loved by our customers 💬
            </h2>
            <p className="text-sm text-plum/55">Real words from happy shoppers</p>
          </div>
          <TestimonialScroller testimonials={testimonials} />
        </section>
      )}

      {/* ── Follow / loyalty ─────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-4xl bg-gradient-to-br from-plum to-midg-700 px-6 py-9 text-white sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-extrabold">Join the MIDG3 family</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Follow the shop and be the first to see new arrivals, secret sales and one-of-a-kind
            finds — before anyone else.
            {soldCount > 0 && (
              <> Over <strong className="text-white">{soldCount}</strong> happy pieces re-loved so far.</>
            )}
          </p>
          <div className="mx-auto mt-5 max-w-md">
            <FollowForm />
          </div>
        </div>
      </section>
    </div>
  );
}
