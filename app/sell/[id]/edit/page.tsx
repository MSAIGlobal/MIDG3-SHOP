import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getListing } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SellForm } from '@/components/SellForm';

export const metadata: Metadata = { title: 'Edit item' };

export default async function EditListingPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured) redirect('/login');
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/sell/${params.id}/edit`);
  if (!user.isOwner) redirect('/');

  const listing = await getListing(params.id);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-5 py-2">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-plum">Edit listing</h1>
        <p className="text-sm text-plum/55">Update photos, price or availability.</p>
      </div>
      <SellForm initial={listing} />
    </div>
  );
}
