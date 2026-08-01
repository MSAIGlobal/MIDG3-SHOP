import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { SellForm } from '@/components/SellForm';

export const metadata: Metadata = { title: 'Add an item' };

export default async function SellPage() {
  const user = await getSessionUser();
  if (!user) redirect('/midge?next=/sell');
  if (!user.isOwner) redirect('/');

  return (
    <div className="mx-auto max-w-2xl space-y-5 py-2">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-plum">List a new treasure ✨</h1>
        <p className="text-sm text-plum/55">Great photos and an honest description sell items fastest.</p>
      </div>
      <SellForm />
    </div>
  );
}
