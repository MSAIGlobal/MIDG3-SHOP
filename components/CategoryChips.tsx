import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

// Horizontally-scrolling category pills — fast filtering with the thumb.
export function CategoryChips({ active }: { active?: string }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      <Link
        href="/shop"
        className={`chip ${!active ? 'bg-midg-500 text-white shadow-soft' : 'bg-white text-plum/70 ring-1 ring-midg-100'}`}
      >
        ✨ All
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/shop?category=${c.slug}`}
          className={`chip ${
            active === c.slug
              ? 'bg-midg-500 text-white shadow-soft'
              : 'bg-white text-plum/70 ring-1 ring-midg-100'
          }`}
        >
          <span aria-hidden>{c.emoji}</span> {c.label}
        </Link>
      ))}
    </div>
  );
}
