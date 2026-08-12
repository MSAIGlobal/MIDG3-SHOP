'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckIcon } from './icons';

// Shown after payment. Lets the buyer leave a review, which is saved as PENDING
// (published = false) for Midge to moderate and one-click add to the shop.
export function LeaveFeedback({ orderRef, defaultName = '' }: { orderRef: string; defaultName?: string }) {
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState(defaultName);
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim() || state === 'saving') return;
    setState('saving');
    const supabase = createClient();
    if (!supabase) {
      setState('done');
      return;
    }
    const { error } = await supabase.from('testimonials').insert({
      quote: quote.trim(),
      author: author.trim() || null,
      rating,
      order_ref: orderRef,
      published: false,
    });
    setState(error ? 'error' : 'done');
  }

  if (state === 'done') {
    return (
      <div className="card p-5 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckIcon width={22} height={22} />
        </div>
        <p className="mt-2 text-sm font-semibold text-plum">Thank you for your feedback! 💕</p>
        <p className="text-xs text-plum/55">Midge will review it and may add it to the shop.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-5 text-left">
      <h3 className="text-sm font-bold text-plum">Leave a review ⭐</h3>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={`text-2xl leading-none ${n <= rating ? 'text-midg-500' : 'text-midg-200'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        className="input min-h-[80px] resize-y"
        placeholder="How was your experience? What did you buy?"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        required
      />
      <input
        className="input"
        placeholder="Your name (shown with your review)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      {state === 'error' && <p className="text-xs text-red-600">Sorry, that didn’t send. Please try again.</p>}
      <button type="submit" disabled={state === 'saving'} className="btn-primary w-full">
        {state === 'saving' ? 'Sending…' : 'Submit review'}
      </button>
    </form>
  );
}
