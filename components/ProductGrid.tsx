import type { Listing } from '@/lib/types';
import { ProductCard } from './ProductCard';

// Two columns on mobile (Vinted/Depop-style dense grid keeps scrolling fun),
// widening on larger screens.
export function ProductGrid({ listings }: { listings: Listing[] }) {
  if (!listings.length) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <p className="text-4xl">🌸</p>
        <p className="mt-3 font-semibold text-plum">Nothing here just yet</p>
        <p className="mt-1 text-sm text-plum/60">
          New treasures are added all the time — check back soon or follow the shop to be first to know.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((l, i) => (
        <ProductCard key={l.id} listing={l} priority={i < 4} />
      ))}
    </div>
  );
}
