'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from './Logo';

// Shared sign-in / sign-up form. Degrades to a friendly notice when the
// Supabase backend isn't connected yet.
export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supabase = createClient();
  const configured = Boolean(supabase);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      // If email confirmation is on, there's no session yet.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setNotice('Almost there! Check your inbox to confirm your email, then sign in.');
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm py-6">
      <div className="mb-6 text-center">
        <Logo className="justify-center" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-plum">
          {mode === 'login' ? 'Welcome back 💕' : 'Join MIDG3'}
        </h1>
        <p className="mt-1 text-sm text-plum/55">
          {mode === 'login'
            ? 'Sign in to save favourites and follow the shop.'
            : 'Create an account to save treasures and never miss a drop.'}
        </p>
      </div>

      {!configured ? (
        <div className="card p-6 text-center text-sm text-plum/70">
          <p className="text-3xl">🔌</p>
          <p className="mt-3 font-semibold text-plum">Accounts are almost ready</p>
          <p className="mt-1">
            Customer sign-in switches on the moment the shop’s backend is connected. You can
            browse and save favourites on this device in the meantime.
          </p>
          <Link href="/shop" className="btn-primary mt-5">Keep browsing</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-4 p-6">
          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="name">Your name</label>
              <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          {notice && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <p className="text-center text-sm text-plum/55">
            {mode === 'login' ? (
              <>New here?{' '}
                <Link href="/signup" className="font-semibold text-midg-600 hover:underline">Create an account</Link>
              </>
            ) : (
              <>Already have an account?{' '}
                <Link href="/login" className="font-semibold text-midg-600 hover:underline">Sign in</Link>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
