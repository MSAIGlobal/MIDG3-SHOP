import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getListings } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ListingAdminRow } from '@/components/ListingAdminRow';
import { PlusIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Your shop' };

export default async function DashboardPage() {
  if (!isSupabaseConfigured) redirect('/login');
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/dashboard');
  if (!user.isOwner) redirect('/');

  const listings = await getListings({ includeSold: true, sort: 'newest' });

  // Follower count (owner-only via RLS).
  let followers = 0;
  const supabase = createClient();
  if (supabase) {
    const { count } = await supabase.from('followers').select('*', { count: 'exact', head: true });
    followers = count ?? 0;
  }

  const active = listings.filter((l) => l.status === 'active').length;
  const sold = listings.filter((l) => l.status === 'sold').length;

  const stats = [
    { label: 'Live', value: active },
    { label: 'Sold', value: sold },
    { label: 'Followers', value: followers },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-plum">Your shop 💗</h1>
          <p className="text-sm text-plum/55">Manage your treasures and track your fans.</p>
        </div>
        <Link href="/sell" className="btn-primary">
          <PlusIcon width={18} height={18} /> Add
        </Link>
      </div>

      <Link
        href="/dashboard/feedback"
        className="card flex items-center justify-between p-4 hover:bg-midg-50"
      >
        <span className="text-sm font-semibold text-plum">💬 Buyer feedback</span>
        <span className="text-sm text-midg-600">Manage quotes →</span>
      </Link>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-midg-600">{s.value}</p>
            <p className="text-xs font-semibold text-plum/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card divide-y divide-midg-50">
        {listings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl">🛍️</p>
            <p className="mt-3 font-semibold text-plum">No listings yet</p>
            <p className="mt-1 text-sm text-plum/60">Add your first item to open the shop.</p>
            <Link href="/sell" className="btn-primary mt-5">List an item</Link>
          </div>
        ) : (
          listings.map((l) => <ListingAdminRow key={l.id} listing={l} />)
        )}
      </div>
    </div>
  );
}
