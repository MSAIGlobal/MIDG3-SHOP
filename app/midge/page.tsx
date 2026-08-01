import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { adminConfigured } from '@/lib/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { adminLogin, adminLogout } from '@/app/login/actions';
import { CameraIcon, BagIcon, HeartIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Midge’s shop area',
  robots: { index: false }, // owner area — keep it out of search results
};

export default async function MidgePage({
  searchParams,
}: {
  searchParams: { e?: string; next?: string };
}) {
  const user = await getSessionUser();
  const next = searchParams.next || '/dashboard';
  const error = searchParams.e === '1';

  // Once the backend is live, the owner signs in through the real Supabase
  // login (so the browser session satisfies RLS for uploads). Send non-owners
  // there instead of showing the cookie form.
  if (isSupabaseConfigured && !user?.isOwner) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-4">
      <div className="rounded-4xl bg-gradient-to-br from-midg-500 via-midg-400 to-midg-300 px-6 py-9 text-center text-white shadow-soft">
        <p className="font-script text-3xl">Hi Midge 👋</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold">Your shop area</h1>
        <p className="mt-1 text-sm text-white/85">
          Sign in to add items with your camera and manage your treasures.
        </p>
      </div>

      {user?.isOwner ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/sell" className="card flex flex-col items-center gap-2 p-5 text-center transition active:scale-[0.98]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-midg-500 text-white shadow-soft">
                <CameraIcon />
              </span>
              <span className="text-sm font-bold text-plum">Add an item</span>
              <span className="text-xs text-plum/50">Snap a photo &amp; list it</span>
            </Link>
            <Link href="/dashboard" className="card flex flex-col items-center gap-2 p-5 text-center transition active:scale-[0.98]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-midg-100 text-midg-600">
                <BagIcon />
              </span>
              <span className="text-sm font-bold text-plum">My listings</span>
              <span className="text-xs text-plum/50">Edit, reserve &amp; sold</span>
            </Link>
          </div>

          <Link href="/dashboard/feedback" className="card flex items-center gap-3 p-4 hover:bg-midg-50">
            <span aria-hidden>💬</span>
            <span className="text-sm font-semibold text-plum">Buyer feedback</span>
          </Link>
          <Link href="/dashboard/statements" className="card flex items-center gap-3 p-4 hover:bg-midg-50">
            <span aria-hidden>🧾</span>
            <span className="text-sm font-semibold text-plum">HMRC statements</span>
          </Link>
          <Link href="/favourites" className="card flex items-center gap-3 p-4 hover:bg-midg-50">
            <HeartIcon className="text-midg-500" />
            <span className="text-sm font-semibold text-plum">Saved items</span>
          </Link>

          <div className="card p-4 text-center text-sm text-plum/60">
            Signed in as <span className="font-semibold text-plum">{user.email}</span>
          </div>
          <form action={adminLogout}>
            <button type="submit" className="btn-secondary w-full">Sign out</button>
          </form>
        </>
      ) : adminConfigured() ? (
        <form action={adminLogin} className="card space-y-4 p-6">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" className="input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="input" placeholder="••••••••" />
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              Those details don’t match. Please try again.
            </p>
          )}
          <button type="submit" className="btn-primary w-full">Sign in</button>
          {isSupabaseConfigured && (
            <p className="text-center text-sm text-plum/55">
              Not the owner?{' '}
              <Link href="/login" className="font-semibold text-midg-600 hover:underline">Customer sign in</Link>
            </p>
          )}
        </form>
      ) : (
        <div className="card p-6 text-center text-sm text-plum/70">
          <p className="text-3xl">🔌</p>
          <p className="mt-3 font-semibold text-plum">Almost ready</p>
          <p className="mt-1">Your owner login switches on as soon as the credentials are configured.</p>
        </div>
      )}
    </div>
  );
}
