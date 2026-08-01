import Image from 'next/image';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { formatPrice, discountPercent } from '@/lib/format';
import { ConditionBadge, StatusBadge } from './Badges';
import { FavouriteButton } from './FavouriteButton';

// Product card: big photo, clear price, condition trust-badge, one-tap save,
// and a reduction flag — the elements that convert browsers into buyers.
export function ProductCard({ listing, priority = false }: { listing: Listing; priority?: boolean }) {
  const off = discountPercent(listing.price, listing.original_price);
  const isSold = listing.status === 'sold';

  return (
    <Link
      href={`/item/${listing.id}`}
      className="group block animate-fade-up"
    >
      <div className="relative overflow-hidden rounded-3xl bg-midg-50 shadow-card">
        <div className="relative aspect-[3/4]">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              isSold ? 'opacity-70 grayscale-[35%]' : ''
            }`}
            priority={priority}
          />

          {/* Top-left flags */}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {off && (
              <span className="rounded-full bg-midg-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
                -{off}%
              </span>
            )}
            <StatusBadge status={listing.status} />
          </div>

          {/* Save button */}
          <div className="absolute right-2.5 top-2.5">
            <FavouriteButton listingId={listing.id} />
          </div>
        </div>
      </div>

      <div className="px-1 pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-plum">{listing.title}</p>
        </div>
        {listing.brand && (
          <p className="truncate text-xs text-plum/50">{listing.brand}{listing.size ? ` · ${listing.size}` : ''}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-extrabold text-midg-600">{formatPrice(listing.price)}</span>
          {listing.original_price && listing.original_price > listing.price && (
            <span className="text-xs text-plum/40 line-through">{formatPrice(listing.original_price)}</span>
          )}
          <span className="ml-auto">
            <ConditionBadge condition={listing.condition} />
          </span>
        </div>
      </div>
    </Link>
  );
}
