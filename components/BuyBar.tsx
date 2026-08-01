'use client';

import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';
import { FavouriteButton } from './FavouriteButton';
import { WhatsAppIcon, BagIcon } from './icons';

// Sticky mobile purchase bar. A persistent, thumb-reachable CTA is one of the
// biggest mobile-conversion wins, so the buy action never scrolls away.
export function BuyBar({ listing }: { listing: Listing }) {
  const sold = listing.status === 'sold';
  const msg = `Hi! I'd love to buy the "${listing.title}" (${formatPrice(listing.price)}) from MIDG3. Is it still available? 💕`;

  const waHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : null;
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `MIDG3 order: ${listing.title}`
  )}&body=${encodeURIComponent(msg)}`;

  const primaryHref = waHref ?? mailHref;

  return (
    <>
      {/* Inline (desktop / in-flow) */}
      <div className="hidden gap-3 md:flex">
        {sold ? (
          <span className="btn flex-1 cursor-default bg-plum/10 text-plum/60">This item has sold</span>
        ) : (
          <a href={primaryHref} target={waHref ? '_blank' : undefined} rel="noreferrer" className="btn-primary flex-1">
            {waHref ? <WhatsAppIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
            Message to buy
          </a>
        )}
        <FavouriteButton listingId={listing.id} withLabel />
      </div>

      {/* Sticky mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-midg-100 bg-white/95 p-3 backdrop-blur md:hidden"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="shrink-0">
            <p className="text-lg font-extrabold leading-none text-midg-600">{formatPrice(listing.price)}</p>
            {listing.original_price && listing.original_price > listing.price && (
              <p className="text-xs text-plum/40 line-through">{formatPrice(listing.original_price)}</p>
            )}
          </div>
          {sold ? (
            <span className="btn flex-1 cursor-default bg-plum/10 text-plum/60">Sold</span>
          ) : (
            <a
              href={primaryHref}
              target={waHref ? '_blank' : undefined}
              rel="noreferrer"
              className="btn-primary flex-1"
            >
              {waHref ? <WhatsAppIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
              Message to buy
            </a>
          )}
          <FavouriteButton listingId={listing.id} />
        </div>
      </div>
    </>
  );
}
