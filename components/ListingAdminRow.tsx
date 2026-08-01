'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';

// A row in the owner's dashboard with quick status change and delete.
export function ListingAdminRow({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [status, setStatus] = useState(listing.status);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function changeStatus(next: string) {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setStatus(next as Listing['status']);
    await supabase.from('listings').update({ status: next }).eq('id', listing.id);
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    await supabase.from('listings').delete().eq('id', listing.id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 p-3">
      <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-midg-50">
        <Image src={listing.images[0]} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-plum">{listing.title}</p>
        <p className="text-sm font-bold text-midg-600">{formatPrice(listing.price)}</p>
        <select
          value={status}
          disabled={busy}
          onChange={(e) => changeStatus(e.target.value)}
          className="mt-1 rounded-lg border border-midg-100 bg-white px-2 py-1 text-xs font-medium text-plum"
        >
          <option value="active">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Link href={`/sell/${listing.id}/edit`} className="text-xs font-semibold text-midg-600 hover:underline">
          Edit
        </Link>
        {confirming ? (
          <span className="flex items-center gap-1.5 text-xs">
            <button onClick={remove} disabled={busy} className="font-semibold text-red-600">Delete</button>
            <button onClick={() => setConfirming(false)} className="text-plum/50">Cancel</button>
          </span>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-xs text-plum/40 hover:text-red-500">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
