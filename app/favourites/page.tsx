'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SAMPLE_LISTINGS } from '@/lib/sample-data';
import { ProductGrid } from '@/components/ProductGrid';
import type { Listing } from '@/lib/types';

export default function FavouritesPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      if (!supabase) {
        const ids: string[] = JSON.parse(localStorage.getItem('midg3:favs') || '[]');
        setListings(SAMPLE_LISTINGS.filter((l) => ids.includes(l.id)));
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setNeedsLogin(true);
        setListings([]);
        return;
      }

      const { data: favs } = await supabase
        .from('favourites')
        .select('listing_id')
        .eq('user_id', user.id);
      const ids = (favs ?? []).map((f) => f.listing_id);
      if (!ids.length) {
        setListings([]);
        return;
      }

      const { data } = await supabase
        .from('listings')
        .select(
          'id,title,description,price,original_price,currency,category,size,brand,color,condition,status,created_at,seller_id,listing_images(url,position)'
        )
        .in('id', ids);

      const mapped: Listing[] = (data ?? []).map((row: any) => ({
        ...row,
        price: Number(row.price),
        original_price: row.original_price != null ? Number(row.original_price) : null,
        images: (row.listing_images ?? [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((i: any) => i.url),
      }));
      setListings(mapped);
    })();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-plum">Your saved treasures 💕</h1>
        <p className="text-sm text-plum/55">The pieces you’ve got your eye on.</p>
      </div>

      {needsLogin && (
        <div className="card p-6 text-center">
          <p className="text-sm text-plum/70">
            <Link href="/login" className="font-semibold text-midg-600 hover:underline">
              Sign in
            </Link>{' '}
            to keep your saved items across all your devices.
          </p>
        </div>
      )}

      {listings === null ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-midg-100" />
          ))}
        </div>
      ) : listings.length === 0 && !needsLogin ? (
        <div className="card mx-auto max-w-md p-10 text-center">
          <p className="text-4xl">🤍</p>
          <p className="mt-3 font-semibold text-plum">No saved items yet</p>
          <p className="mt-1 text-sm text-plum/60">
            Tap the heart on anything you love and it’ll appear here.
          </p>
          <Link href="/shop" className="btn-primary mt-5">Start browsing</Link>
        </div>
      ) : (
        <ProductGrid listings={listings} />
      )}
    </div>
  );
}
