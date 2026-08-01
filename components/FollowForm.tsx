'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SparkleIcon, CheckIcon } from './icons';

// "Follow the shop" — collects emails so the owner can build a loyal customer
// base and tell followers first when new items land. Works even before the
// backend is connected (stores locally) so the CTA is never dead.
export function FollowForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'saving') return;
    setState('saving');

    const supabase = createClient();
    if (!supabase) {
      // No backend yet — remember locally so nothing is lost.
      const list: string[] = JSON.parse(localStorage.getItem('midg3:followers') || '[]');
      if (!list.includes(email)) list.push(email);
      localStorage.setItem('midg3:followers', JSON.stringify(list));
      setState('done');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('followers')
      .upsert({ email, user_id: user?.id ?? null }, { onConflict: 'email' });
    setState(error ? 'error' : 'done');
  }

  if (state === 'done') {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white">
        <CheckIcon width={18} height={18} /> You’re on the list — welcome to the MIDG3 family! 💕
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'flex flex-col gap-2 sm:flex-row'}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="w-full rounded-full border-0 px-5 py-3 text-sm text-plum outline-none ring-2 ring-transparent placeholder:text-plum/40 focus:ring-white"
      />
      <button
        type="submit"
        disabled={state === 'saving'}
        className="btn shrink-0 bg-white text-midg-600 hover:bg-midg-50"
      >
        <SparkleIcon width={18} height={18} />
        {state === 'saving' ? 'Joining…' : 'Follow the shop'}
      </button>
    </form>
  );
}
