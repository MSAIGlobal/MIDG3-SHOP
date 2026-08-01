import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { TestimonialsManager } from '@/components/TestimonialsManager';

export const metadata: Metadata = { title: 'Buyer feedback' };

export default async function FeedbackPage() {
  const user = await getSessionUser();
  if (!user) redirect('/midge?next=/dashboard/feedback');
  if (!user.isOwner) redirect('/');

  return (
    <div className="mx-auto max-w-2xl space-y-5 py-2">
      <div>
        <Link href="/dashboard" className="text-sm text-midg-600 hover:underline">← Back to your shop</Link>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-plum">Buyer feedback 💬</h1>
        <p className="text-sm text-plum/55">
          Add happy-customer quotes — they scroll across your home page to build trust and sell more.
        </p>
      </div>
      <TestimonialsManager />
    </div>
  );
}
