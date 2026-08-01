import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListing, getRelatedListings } from '@/lib/data';
import { ImageGallery } from '@/components/ImageGallery';
import { BuyBar } from '@/components/BuyBar';
import { ConditionBadge } from '@/components/Badges';
import { ProductCard } from '@/components/ProductCard';
import { TrustBar } from '@/components/TrustBar';
import { formatPrice, timeAgo, discountPercent } from '@/lib/format';
import { CATEGORIES } from '@/lib/constants';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await getListing(params.id);
  if (!listing) return { title: 'Item not found' };
  return {
    title: listing.title,
    description: listing.description.slice(0, 155),
    openGraph: { images: listing.images.slice(0, 1) },
  };
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);
  if (!listing) notFound();

  const related = await getRelatedListings(listing);
  const off = discountPercent(listing.price, listing.original_price);
  const category = CATEGORIES.find((c) => c.slug === listing.category);

  const details: [string, string | null][] = [
    ['Brand', listing.brand],
    ['Size', listing.size],
    ['Colour', listing.color],
    ['Condition', listing.condition],
    ['Category', category?.label ?? listing.category],
  ];

  return (
    <div className="space-y-10">
      <nav className="text-sm text-plum/50">
        <Link href="/shop" className="hover:text-midg-600">Shop</Link>
        {category && (
          <>
            {' / '}
            <Link href={`/shop?category=${category.slug}`} className="hover:text-midg-600">
              {category.label}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:sticky md:top-24 md:self-start">
          <ImageGallery images={listing.images} title={listing.title} />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-plum sm:text-3xl">{listing.title}</h1>
            <p className="mt-1 text-sm text-plum/50">Listed {timeAgo(listing.created_at)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-extrabold text-midg-600">{formatPrice(listing.price)}</span>
            {listing.original_price && listing.original_price > listing.price && (
              <span className="text-lg text-plum/40 line-through">{formatPrice(listing.original_price)}</span>
            )}
            {off && (
              <span className="rounded-full bg-midg-500 px-2.5 py-1 text-xs font-bold text-white">
                Save {off}%
              </span>
            )}
          </div>

          {/* Scarcity — resale items are unique, and that urgency sells. */}
          {listing.status === 'active' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-midg-50 px-4 py-2 text-sm font-semibold text-midg-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-midg-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-midg-500" />
              </span>
              One of a kind — only 1 available
            </div>
          )}

          <BuyBar listing={listing} />

          {/* Description */}
          <div className="card p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-plum/50">Description</h2>
            <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-plum/80">
              {listing.description}
            </p>
          </div>

          {/* Details */}
          <dl className="card divide-y divide-midg-50 p-2">
            {details
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-3 py-2.5 text-sm">
                  <dt className="text-plum/50">{k}</dt>
                  <dd className="font-semibold text-plum">
                    {k === 'Condition' ? <ConditionBadge condition={listing.condition} /> : v}
                  </dd>
                </div>
              ))}
          </dl>

          <TrustBar />
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-extrabold text-plum">You might also love</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((l) => (
              <ProductCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
