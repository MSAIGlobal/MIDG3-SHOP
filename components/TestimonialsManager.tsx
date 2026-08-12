'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/lib/types';

// Owner tool to moderate buyer feedback: approve (one-click add to the shop),
// hide, or delete — plus add quotes manually.
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
      .select('id,quote,author,rating,created_at,published,order_ref')
      .order('published', { ascending: true }) // pending first
      .order('created_at', { ascending: false });
    setItems((data as Testimonial[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function setPublished(id: string, published: boolean) {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('testimonials').update({ published }).eq('id', id);
    setItems((prev) => (prev ? prev.map((t) => (t.id === id ? { ...t, published } : t)) : prev));
  }

  async function remove(id: string) {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setItems((prev) => (prev ? prev.filter((t) => t.id !== id) : prev));
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim()) return;
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    // Owner-added quotes go live straight away.
    const { error } = await supabase
      .from('testimonials')
      .insert({ quote: quote.trim(), author: author.trim() || null, rating, published: true });
    if (error) setError(error.message);
    else {
      setQuote('');
      setAuthor('');
      setRating(5);
      await load();
    }
    setBusy(false);
  }

  const pending = items?.filter((t) => !t.published) ?? [];
  const published = items?.filter((t) => t.published) ?? [];

  function Card({ t }: { t: Testimonial }) {
    return (
      <div className="card flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-plum/80">“{t.quote}”</p>
          <p className="mt-1 text-xs font-semibold text-midg-600">
            {'★'.repeat(t.rating)} {t.author ? `· ${t.author}` : ''}
            {t.order_ref ? <span className="text-plum/40"> · {t.order_ref}</span> : null}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {t.published ? (
            <button onClick={() => setPublished(t.id, false)} className="text-xs font-semibold text-plum/50 hover:underline">
              Hide
            </button>
          ) : (
            <button onClick={() => setPublished(t.id, true)} className="btn-primary px-3 py-1.5 text-xs">
              ✓ Add to shop
            </button>
          )}
          <button onClick={() => remove(t.id)} className="text-xs text-plum/40 hover:text-red-500">
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending moderation */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-plum/50">
          Awaiting approval {items ? `(${pending.length})` : ''}
        </h2>
        {items === null ? (
          <div className="card h-20 animate-pulse" />
        ) : pending.length === 0 ? (
          <div className="card p-5 text-center text-sm text-plum/55">
            No new feedback to review. Customer reviews appear here after they buy. ✨
          </div>
        ) : (
          pending.map((t) => <Card key={t.id} t={t} />)
        )}
      </div>

      {/* Published */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-plum/50">
          Live on your shop {items ? `(${published.length})` : ''}
        </h2>
        {published.length === 0 ? (
          <div className="card p-5 text-center text-sm text-plum/55">Nothing published yet.</div>
        ) : (
          published.map((t) => <Card key={t.id} t={t} />)
        )}
      </div>

      {/* Add manually */}
      <form onSubmit={add} className="card space-y-3 p-5">
        <h2 className="text-sm font-bold text-plum">Add a quote yourself</h2>
        <textarea
          className="input min-h-[80px] resize-y"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="e.g. Gorgeous dress and posted so quickly — will buy again! 💕"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Customer name" />
          <select className="input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>
            ))}
          </select>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Adding…' : 'Add & publish'}
        </button>
      </form>
    </div>
  );
}
