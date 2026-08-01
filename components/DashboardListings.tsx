'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';
import { ShareListing } from './ShareListing';
import { TrashIcon, ShareIcon } from './icons';

export function DashboardListings({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shareOpen, setShareOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const allSelected = listings.length > 0 && selected.size === listings.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(listings.map((l) => l.id)));
  }

  async function deleteIds(ids: string[]) {
    if (!ids.length) return;
    const supabase = createClient();
    if (!supabase) {
      alert('Deleting goes live once the shop’s backend is connected.');
      return;
    }
    setBusy(true);
    await supabase.from('listings').delete().in('id', ids);
    setBusy(false);
    setSelected(new Set());
    setConfirmBulk(false);
    router.refresh();
  }

  async function changeStatus(id: string, status: string) {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('listings').update({ status }).eq('id', id);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {/* Bulk action bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-midg-100">
        <label className="flex items-center gap-2 text-sm font-medium text-plum">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-midg-500"
          />
          Select all
        </label>
        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-plum/60">{selected.size} selected</span>
            {confirmBulk ? (
              <>
                <button
                  onClick={() => deleteIds([...selected])}
                  disabled={busy}
                  className="btn bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  <TrashIcon width={16} height={16} /> {busy ? 'Deleting…' : `Delete ${selected.size}`}
                </button>
                <button onClick={() => setConfirmBulk(false)} className="text-sm text-plum/50">Cancel</button>
              </>
            ) : (
              <button
                onClick={() => setConfirmBulk(true)}
                className="btn bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
              >
                <TrashIcon width={16} height={16} /> Delete selected
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="card divide-y divide-midg-50">
        {listings.map((l) => {
          const isSel = selected.has(l.id);
          return (
            <div key={l.id} className={isSel ? 'bg-midg-50/60' : ''}>
              <div className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(l.id)}
                  className="h-4 w-4 shrink-0 accent-midg-500"
                  aria-label={`Select ${l.title}`}
                />
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-midg-50">
                  <Image src={l.images[0]} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-plum">{l.title}</p>
                  <p className="text-sm font-bold text-midg-600">{formatPrice(l.price)}</p>
                  <select
                    value={l.status}
                    onChange={(e) => changeStatus(l.id, e.target.value)}
                    className="mt-1 rounded-lg border border-midg-100 bg-white px-2 py-1 text-xs font-medium text-plum"
                  >
                    <option value="active">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShareOpen(shareOpen === l.id ? null : l.id)}
                      aria-label="Share"
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-1 transition ${
                        shareOpen === l.id ? 'bg-midg-100 text-midg-700 ring-midg-200' : 'bg-white text-midg-500 ring-midg-100 hover:bg-midg-50'
                      }`}
                    >
                      <ShareIcon width={16} height={16} />
                    </button>
                    <Link href={`/sell/${l.id}/edit`} className="text-xs font-semibold text-midg-600 hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteIds([l.id])}
                      disabled={busy}
                      aria-label={`Delete ${l.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-plum/40 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>

              {shareOpen === l.id && (
                <div className="border-t border-midg-50 bg-midg-50/40 p-4">
                  <p className="mb-2 text-xs font-semibold text-plum/60">Share this item to sell it faster:</p>
                  <ShareListing id={l.id} title={l.title} price={l.price} image={l.images[0]} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
