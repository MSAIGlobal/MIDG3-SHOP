import type { Metadata } from 'next';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SignOutButton } from '@/components/SignOutButton';
import { CameraIcon, BagIcon, HeartIcon, UserIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Midge’s shop area',
  robots: { index: false }, // owner area — keep it out of search results
};

export default async function MidgePage() {
  const user = isSupabaseConfigured ? await getSessionUser() : null;

  return (
    <div className="mx-auto max-w-md space-y-6 py-4">
      <div className="rounded-4xl bg-gradient-to-br from-midg-500 via-midg-400 to-midg-300 px-6 py-9 text-center text-white shadow-soft">
        <p className="font-script text-3xl">Hi Midge 👋</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Your shop area</h1>
        <p className="mt-1 text-sm text-white/85">
          Sign in to add items with your camera and manage your treasures.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <div className="card p-6 text-center text-sm text-plum/70">
          <p className="text-3xl">🔌</p>
          <p className="mt-3 font-semibold text-plum">Almost ready</p>
          <p className="mt-1">
            Your private login switches on the moment the shop’s backend is connected. Everything
            below is built and waiting — you’ll be able to sign in, snap photos and list items in
            seconds.
          </p>
        </div>
      ) : !user ? (
        <div className="card space-y-3 p-6 text-center">
          <p className="text-sm text-plum/70">Welcome back — ready to add some treasures?</p>
          <Link href="/login?next=/sell" className="btn-primary w-full">
            <UserIcon width={18} height={18} /> Sign in
          </Link>
          <Link href="/signup?next=/sell" className="btn-secondary w-full">
            First time here? Create your owner account
          </Link>
          <p className="pt-1 text-xs text-plum/45">
            Use the shop’s owner email so you’re set up as the shopkeeper automatically.
          </p>
        </div>
      ) : !user.isOwner ? (
        <div className="card p-6 text-center text-sm text-plum/70">
          <p className="text-3xl">💗</p>
          <p className="mt-3 font-semibold text-plum">This area is for the shop owner</p>
          <p className="mt-1">
            You’re signed in as a customer. Head to your account to see your saved items.
          </p>
          <Link href="/account" className="btn-primary mt-4">Go to my account</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/sell"
              className="card flex flex-col items-center gap-2 p-5 text-center transition active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-midg-500 text-white shadow-soft">
                <CameraIcon />
              </span>
              <span className="text-sm font-bold text-plum">Add an item</span>
              <span className="text-xs text-plum/50">Snap a photo &amp; list it</span>
            </Link>
            <Link
              href="/dashboard"
              className="card flex flex-col items-center gap-2 p-5 text-center transition active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-midg-100 text-midg-600">
                <BagIcon />
              </span>
              <span className="text-sm font-bold text-plum">My listings</span>
              <span className="text-xs text-plum/50">Edit, reserve &amp; sold</span>
            </Link>
          </div>

          <Link href="/favourites" className="card flex items-center gap-3 p-4 hover:bg-midg-50">
            <HeartIcon className="text-midg-500" />
            <span className="text-sm font-semibold text-plum">Saved items</span>
          </Link>

          <div className="card p-4 text-center text-sm text-plum/60">
            Signed in as <span className="font-semibold text-plum">{user.email}</span>
          </div>
          <SignOutButton />
        </>
      )}
    </div>
  );
}
