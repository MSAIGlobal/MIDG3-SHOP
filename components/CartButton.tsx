'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { BagIcon } from './icons';

// Header basket icon with a live item-count badge.
export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/basket"
      className="relative inline-flex rounded-full p-2.5 text-plum/70 transition hover:bg-midg-50 hover:text-midg-600"
      aria-label={`Basket${count ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
    >
      <BagIcon />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-midg-500 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
