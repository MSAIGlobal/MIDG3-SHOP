'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import type { Listing } from '@/lib/types';
import { BagIcon, CardIcon, CheckIcon } from './icons';

function toCartItem(listing: Listing) {
  return {
    listingId: listing.id,
    title: listing.title,
    price: listing.price,
    image: listing.images[0],
  };
}

// "Add to basket" — adds/removes the item and reflects state.
export function AddToCartButton({ listing, className = '' }: { listing: Listing; className?: string }) {
  const { has, add, remove } = useCart();
  const inCart = has(listing.id);
  return (
    <button
      type="button"
      onClick={() => (inCart ? remove(listing.id) : add(toCartItem(listing)))}
      className={inCart ? `btn bg-midg-100 text-midg-700 ${className}` : `btn-secondary ${className}`}
      aria-pressed={inCart}
    >
      {inCart ? <CheckIcon width={20} height={20} /> : <BagIcon width={20} height={20} />}
      {inCart ? 'In basket' : 'Add to basket'}
    </button>
  );
}

// Compact icon toggle for product cards (card is a link, so stop propagation).
export function QuickAddToCart({ listing }: { listing: Listing }) {
  const { has, add, remove } = useCart();
  const inCart = has(listing.id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inCart ? remove(listing.id) : add(toCartItem(listing));
      }}
      aria-label={inCart ? 'Remove from basket' : 'Add to basket'}
      aria-pressed={inCart}
      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-card backdrop-blur transition ${
        inCart ? 'bg-midg-500 text-white' : 'bg-white/90 text-midg-500 hover:bg-white'
      }`}
    >
      {inCart ? <CheckIcon width={18} height={18} /> : <BagIcon width={18} height={18} />}
    </button>
  );
}

// Buy Now — one tap adds the item and goes straight to checkout, where the
// buyer picks how they'd like to pay. Plain client navigation, so it's reliable
// on mobile (no popup blockers or async payment redirects).
export function BuyNowButton({ listing, className = '' }: { listing: Listing; className?: string }) {
  const router = useRouter();
  const { add } = useCart();

  function buyNow() {
    add(toCartItem(listing));
    router.push('/basket?buynow=1');
  }

  return (
    <button
      type="button"
      onClick={buyNow}
      className={`btn bg-[#0666eb] text-white shadow-soft hover:bg-[#0552c2] ${className}`}
    >
      <CardIcon width={20} height={20} />
      Buy now
    </button>
  );
}
