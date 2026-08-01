import type { Metadata } from 'next';
import Link from 'next/link';
import { getListings } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryChips } from '@/components/CategoryChips';
import { CATEGORIES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Shop all' };

interface SearchParams {
  q?: string;
  category?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

const SORTS: { value: NonNullable<SearchParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category, sort = 'newest' } = searchParams;
  const listings = await getListings({ search: q, category, sort });
  const activeCat = CATEGORIES.find((c) => c.slug === category);

  const heading = q
    ? `Results for “${q}”`
    : activeCat
    ? activeCat.label
    : 'Shop all';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-plum">{heading}</h1>
        <p className="text-sm text-plum/55">
          {listings.length} {listings.length === 1 ? 'item' : 'items'} available
        </p>
      </div>

      <CategoryChips active={category} />

      {/* Sort row — build query strings preserving current filters */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-plum/50">Sort:</span>
        {SORTS.map((s) => {
          const params = new URLSearchParams();
          if (q) params.set('q', q);
          if (category) params.set('category', category);
          if (s.value !== 'newest') params.set('sort', s.value);
          const href = `/shop${params.toString() ? `?${params}` : ''}`;
          const active = sort === s.value;
          return (
            <Link
              key={s.value}
              href={href}
              className={`chip ${active ? 'bg-midg-100 text-midg-700' : 'bg-white text-plum/60 ring-1 ring-midg-100'}`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      <ProductGrid listings={listings} />
    </div>
  );
}
