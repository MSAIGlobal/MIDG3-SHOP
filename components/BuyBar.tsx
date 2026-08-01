'use client';

import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';
import { revolutPayLink } from '@/lib/payments';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';
import { FavouriteButton } from './FavouriteButton';
import { WhatsAppIcon, BagIcon, CardIcon } from './icons';

// Purchase actions. "Buy now" sends the shopper straight to Midge's Revolut with
// the amount pre-filled; "Message to buy" (WhatsApp/email) is the fallback and a
// way to ask questions first. A persistent, thumb-reachable CTA on mobile is one
// of the biggest conversion wins, so it never scrolls away.
export function BuyBar({ listing }: { listing: Listing }) {
  const sold = listing.status === 'sold';
  const payLink = revolutPayLink(listing.price, listing.currency);

  const msg = `Hi! I'd love to buy the "${listing.title}" (${formatPrice(listing.price)}) from MIDG3. Is it still available? 💕`;
  const waHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : null;
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `MIDG3 order: ${listing.title}`
  )}&body=${encodeURIComponent(msg)}`;
  const messageHref = waHref ?? mailHref;

  const BuyNow = ({ className = '' }: { className?: string }) => (
    <a
      href={payLink!}
      target="_blank"
      rel="noreferrer"
      className={`btn bg-[#0666eb] text-white shadow-soft hover:bg-[#0552c2] ${className}`}
    >
      <CardIcon width={20} height={20} /> Buy now
    </a>
  );

  const MessageBtn = ({ className = '' }: { className?: string }) => (
    <a
      href={messageHref}
      target={waHref ? '_blank' : undefined}
      rel="noreferrer"
      className={payLink ? `btn-secondary ${className}` : `btn-primary ${className}`}
    >
      {waHref ? <WhatsAppIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
      {payLink ? 'Ask a question' : 'Message to buy'}
    </a>
  );

  return (
    <>
      {/* Inline (desktop / in-flow) */}
      <div className="hidden gap-3 md:flex">
        {sold ? (
          <span className="btn flex-1 cursor-default bg-plum/10 text-plum/60">This item has sold</span>
        ) : (
          <>
            {payLink && <BuyNow className="flex-1" />}
            <MessageBtn className={payLink ? '' : 'flex-1'} />
          </>
        )}
        <FavouriteButton listingId={listing.id} withLabel />
      </div>
      {payLink && !sold && (
        <p className="hidden text-xs text-plum/45 md:block">
          Secure payment to Midge via Revolut. Pay by card or Revolut balance.
        </p>
      )}

      {/* Sticky mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-midg-100 bg-white/95 p-3 backdrop-blur md:hidden"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <div className="shrink-0">
            <p className="text-lg font-extrabold leading-none text-midg-600">{formatPrice(listing.price)}</p>
            {listing.original_price && listing.original_price > listing.price && (
              <p className="text-xs text-plum/40 line-through">{formatPrice(listing.original_price)}</p>
            )}
          </div>
          {sold ? (
            <span className="btn flex-1 cursor-default bg-plum/10 text-plum/60">Sold</span>
          ) : payLink ? (
            <>
              <BuyNow className="flex-1" />
              <a
                href={messageHref}
                target={waHref ? '_blank' : undefined}
                rel="noreferrer"
                aria-label="Ask a question"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-midg-600 ring-1 ring-midg-200"
              >
                {waHref ? <WhatsAppIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
              </a>
            </>
          ) : (
            <MessageBtn className="flex-1" />
          )}
          <FavouriteButton listingId={listing.id} />
        </div>
      </div>
    </>
  );
}
