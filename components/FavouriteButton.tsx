'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { HeartIcon } from './icons';

interface Props {
  listingId: string;
  className?: string;
  size?: number;
  withLabel?: boolean;
}

// One-tap wishlist. Saving a favourite is the single strongest "come back and
// buy" signal in resale, so we make it frictionless and delightful.
export function FavouriteButton({ listingId, className = '', size = 20, withLabel = false }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    if (!supabase) {
      // No backend yet — fall back to local storage so the UX still works.
      const local = JSON.parse(localStorage.getItem('midg3:favs') || '[]');
      if (active) setSaved(local.includes(listingId));
      return;
    }
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('favourites')
        .select('listing_id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .maybeSingle();
      if (active) setSaved(Boolean(data));
    })();
    return () => {
      active = false;
    };
  }, [listingId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    setPop(true);
    setTimeout(() => setPop(false), 350);

    const supabase = createClient();

    if (!supabase) {
      const local: string[] = JSON.parse(localStorage.getItem('midg3:favs') || '[]');
      const next = saved ? local.filter((id) => id !== listingId) : [...local, listingId];
      localStorage.setItem('midg3:favs', JSON.stringify(next));
      setSaved(!saved);
      setBusy(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=/item/${listingId}`);
      setBusy(false);
      return;
    }

    if (saved) {
      await supabase.from('favourites').delete().eq('user_id', user.id).eq('listing_id', listingId);
      setSaved(false);
    } else {
      await supabase.from('favourites').insert({ user_id: user.id, listing_id: listingId });
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save to wishlist'}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition ${
        withLabel
          ? saved
            ? 'btn bg-midg-100 text-midg-700'
            : 'btn-secondary'
          : 'h-9 w-9 bg-white/90 text-midg-500 shadow-card backdrop-blur hover:bg-white'
      } ${className}`}
    >
      <HeartIcon width={size} height={size} filled={saved} className={pop ? 'animate-heart' : ''} />
      {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
