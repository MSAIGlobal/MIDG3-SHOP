'use client';

import { CONTACT_EMAIL, POSTAGE, WHATSAPP_NUMBER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/lib/cart';
import type { Listing } from '@/lib/types';
import { FavouriteButton } from './FavouriteButton';
import { AddToCartButton, BuyNowButton } from './CartButtons';
import { BagIcon, CheckIcon } from './icons';

// Purchase actions. Lead with one-click "Buy now" (records the order + opens
// Revolut) and "Add to basket". "Ask a question" (WhatsApp/email) stays as a
// quiet fallback. A persistent, thumb-reachable CTA on mobile is one of the
// biggest conversion wins, so it never scrolls away.
export function BuyBar({ listing }: { listing: Listing }) {
  const { has, add, remove } = useCart();
  const sold = listing.status === 'sold';
  const total = listing.price + POSTAGE;
  const inCart = has(listing.id);
  const cartItem = { listingId: listing.id, title: listing.title, price: listing.price, image: listing.images[0] };

  const msg = `Hi! I'd love to buy the "${listing.title}" (${formatPrice(listing.price)} + ${formatPrice(POSTAGE)} postage = ${formatPrice(total)}) from MIDG3. Is it still available? 💕`;
  const waHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : null;
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `MIDG3 enquiry: ${listing.title}`
  )}&body=${encodeURIComponent(msg)}`;
  const messageHref = waHref ?? mailHref;

  return (
    <>
      {/* Inline (desktop / in-flow) */}
      <div className="hidden flex-col gap-3 md:flex">
        {sold ? (
          <span className="btn cursor-default bg-plum/10 text-plum/60">This item has sold</span>
        ) : (
          <>
            <div className="flex gap-3">
              <BuyNowButton listing={listing} className="flex-1" />
              <FavouriteButton listingId={listing.id} withLabel />
            </div>
            <AddToCartButton listing={listing} className="w-full" />
            <p className="text-xs text-plum/45">
              {formatPrice(listing.price)} + {formatPrice(POSTAGE)} postage ={' '}
              <span className="font-semibold text-plum/70">{formatPrice(total)}</span> ·{' '}
              <a href={messageHref} target={waHref ? '_blank' : undefined} rel="noreferrer" className="underline hover:text-midg-600">
                Ask a question first
              </a>
            </p>
          </>
        )}
      </div>

      {/* Sticky mobile bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-midg-100 bg-white/95 p-3 backdrop-blur md:hidden"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <div className="shrink-0 leading-none">
            <p className="text-lg font-extrabold text-midg-600">{formatPrice(listing.price)}</p>
            <p className="mt-0.5 text-[11px] text-plum/45">+ {formatPrice(POSTAGE)} post</p>
          </div>
          {sold ? (
            <span className="btn flex-1 cursor-default bg-plum/10 text-plum/60">Sold</span>
          ) : (
            <>
              <BuyNowButton listing={listing} className="flex-1" />
              <button
                type="button"
                onClick={() => (inCart ? remove(listing.id) : add(cartItem))}
                aria-label={inCart ? 'In basket' : 'Add to basket'}
                aria-pressed={inCart}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${
                  inCart ? 'bg-midg-100 text-midg-700 ring-midg-200' : 'bg-white text-midg-600 ring-midg-200'
                }`}
              >
                {inCart ? <CheckIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
              </button>
            </>
          )}
          <FavouriteButton listingId={listing.id} />
        </div>
      </div>
    </>
  );
}
