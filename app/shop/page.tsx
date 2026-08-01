import type { Metadata } from 'next';
import Link from 'next/link';
import { getListings } from '@/lib/data';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryChips } from '@/components/CategoryChips';
import { CATEGORIES, findCategory } from '@/lib/constants';

export const metadata: Metadata = { title: 'Shop all' };

interface SearchParams {
  q?: string;
  category?: string;
  audience?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

const SORTS: { value: NonNullable<SearchParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category, audience, sort = 'newest' } = searchParams;
  const activeCat = findCategory(category);
  // Only apply the audience sub-filter when the category actually has one.
  const subcategory = activeCat?.subcategories?.some((s) => s.slug === audience)
    ? audience
    : undefined;
  const listings = await getListings({ search: q, category, subcategory, sort });

  const activeSub = activeCat?.subcategories?.find((s) => s.slug === subcategory);
  const heading = q
    ? `Results for “${q}”`
    : activeCat
    ? `${activeCat.label}${activeSub ? ` · ${activeSub.label}` : ''}`
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

      {/* Audience sub-filter (Adults / Kids / Elders) for Pre-Loved Clothing */}
      {activeCat?.subcategories && (
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <Link
            href={`/shop?category=${activeCat.slug}`}
            className={`chip ${!subcategory ? 'bg-midg-100 text-midg-700' : 'bg-white text-plum/60 ring-1 ring-midg-100'}`}
          >
            Everyone
          </Link>
          {activeCat.subcategories.map((s) => (
            <Link
              key={s.slug}
              href={`/shop?category=${activeCat.slug}&audience=${s.slug}`}
              className={`chip ${
                subcategory === s.slug ? 'bg-midg-100 text-midg-700' : 'bg-white text-plum/60 ring-1 ring-midg-100'
              }`}
            >
              <span aria-hidden>{s.emoji}</span> {s.label}
            </Link>
          ))}
        </div>
      )}

      {/* Sort row — build query strings preserving current filters */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-plum/50">Sort:</span>
        {SORTS.map((s) => {
          const params = new URLSearchParams();
          if (q) params.set('q', q);
          if (category) params.set('category', category);
          if (subcategory) params.set('audience', subcategory);
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
