import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SignOutButton } from '@/components/SignOutButton';
import { HeartIcon, PlusIcon, BagIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Your account' };

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect('/login');
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account');

  return (
    <div className="mx-auto max-w-md space-y-5 py-4">
      <div className="rounded-4xl bg-gradient-to-br from-midg-400 to-midg-500 p-6 text-white shadow-soft">
        <p className="text-sm text-white/80">Signed in as</p>
        <p className="text-lg font-bold">{user.email}</p>
        {user.isOwner && (
          <span className="mt-2 inline-flex rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
            ✨ Shop owner
          </span>
        )}
      </div>

      <div className="card divide-y divide-midg-50">
        <Link href="/favourites" className="flex items-center gap-3 p-4 hover:bg-midg-50">
          <HeartIcon className="text-midg-500" /> <span className="font-semibold text-plum">Saved treasures</span>
        </Link>
        {user.isOwner && (
          <>
            <Link href="/dashboard" className="flex items-center gap-3 p-4 hover:bg-midg-50">
              <BagIcon className="text-midg-500" /> <span className="font-semibold text-plum">Manage listings</span>
            </Link>
            <Link href="/sell" className="flex items-center gap-3 p-4 hover:bg-midg-50">
              <PlusIcon className="text-midg-500" /> <span className="font-semibold text-plum">Add a new item</span>
            </Link>
          </>
        )}
      </div>

      <SignOutButton />
    </div>
  );
}
