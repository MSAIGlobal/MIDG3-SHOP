import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getOrders } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { HmrcStatements } from '@/components/HmrcStatements';

export const metadata: Metadata = { title: 'HMRC statements', robots: { index: false } };

export default async function StatementsPage() {
  // When the backend is live this is owner-only; before then we allow a preview
  // with sample orders so the HMRC format can be seen (sample data is harmless).
  if (isSupabaseConfigured) {
    const user = await getSessionUser();
    if (!user) redirect('/login?next=/dashboard/statements');
    if (!user.isOwner) redirect('/');
  }

  const orders = await getOrders();

  return (
    <div className="mx-auto max-w-3xl space-y-5 py-2">
      <div className="print:hidden">
        <Link href="/dashboard" className="text-sm text-midg-600 hover:underline">← Back to your shop</Link>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-plum">HMRC statements 🧾</h1>
        <p className="text-sm text-plum/55">
          Every sale, grouped into monthly income statements for your UK Self Assessment. Download a
          CSV or print a PDF for your records or accountant.
        </p>
      </div>
      <HmrcStatements orders={orders} preview={!isSupabaseConfigured} />
    </div>
  );
}
