'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/lib/types';

// Owner tool to upload and manage buyer-feedback quotes shown in the home-page
// scroller.
export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const supabase = createClient();
    if (!supabase) {
      setItems([]);
      return;
    }
    const { data } = await supabase
      .from('testimonials')
      .select('id,quote,author,rating,created_at')
      .order('created_at', { ascending: false });
    setItems((data as Testimonial[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim()) return;
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from('testimonials')
      .insert({ quote: quote.trim(), author: author.trim() || null, rating });
    if (error) {
      setError(error.message);
    } else {
      setQuote('');
      setAuthor('');
      setRating(5);
      await load();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setItems((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card space-y-4 p-5">
        <div>
          <label className="label" htmlFor="quote">Feedback quote</label>
          <textarea
            id="quote"
            className="input min-h-[96px] resize-y"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="e.g. Gorgeous dress and posted so quickly — will buy again! 💕"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="author">Customer name</label>
            <input
              id="author"
              className="input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Sarah M."
            />
          </div>
          <div>
            <label className="label" htmlFor="rating">Rating</label>
            <select
              id="rating"
              className="input"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Adding…' : 'Add feedback'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-plum/50">
          Published quotes {items ? `(${items.length})` : ''}
        </h2>
        {items === null ? (
          <div className="card h-24 animate-pulse" />
        ) : items.length === 0 ? (
          <div className="card p-6 text-center text-sm text-plum/60">
            No feedback yet — add your first happy-customer quote above. ✨
          </div>
        ) : (
          items.map((t) => (
            <div key={t.id} className="card flex items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-plum/80">“{t.quote}”</p>
                <p className="mt-1 text-xs font-semibold text-midg-600">
                  {'★'.repeat(t.rating)} {t.author ? `· ${t.author}` : ''}
                </p>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 text-xs text-plum/40 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
