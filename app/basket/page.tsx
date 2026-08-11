'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useShopConfig } from '@/components/ConfigProvider';
import { placeOrder, type CheckoutResult } from '@/lib/checkout';
import { formatPrice } from '@/lib/format';
import { POSTAGE, PAYMENT_METHODS, paymentMethodLabel, type PaymentMethodId } from '@/lib/constants';
import { CardIcon, CheckIcon } from '@/components/icons';

export default function BasketPage() {
  const { items, subtotal, remove, clear, ready } = useCart();
  const shopConfig = useShopConfig();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<PaymentMethodId | ''>('');
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<CheckoutResult | null>(null);

  const postage = items.length ? POSTAGE : 0;
  const total = subtotal + postage;

  async function checkout() {
    if (!items.length || !method || busy) return;
    setBusy(true);
    const result = await placeOrder(items, { name, email, paymentMethod: method }, shopConfig);
    setPlaced(result);
    clear();
    setBusy(false);
  }

  // ── Order confirmation ──────────────────────────────────────────────────
  if (placed) {
    const methodLabel = paymentMethodLabel(placed.paymentMethod);
    return (
      <div className="mx-auto max-w-md space-y-5 py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckIcon width={32} height={32} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-plum">Order placed! 💕</h1>
          <p className="mt-1 text-sm text-plum/60">
            Reference <span className="font-semibold text-plum">{placed.ref}</span> · Paying by{' '}
            <span className="font-semibold text-plum">{methodLabel}</span>
          </p>
        </div>

        <div className="card p-5 text-left text-sm">
          <div className="flex justify-between"><span className="text-plum/60">Items</span><span>{formatPrice(placed.itemTotal)}</span></div>
          <div className="mt-1 flex justify-between"><span className="text-plum/60">Postage</span><span>{formatPrice(placed.postage)}</span></div>
          <div className="mt-2 flex justify-between border-t border-midg-50 pt-2 text-base font-extrabold text-plum">
            <span>Total</span><span className="text-midg-600">{formatPrice(placed.total)}</span>
          </div>
        </div>

        {/* Payment instructions per chosen method. The pay button is a real link
            the buyer taps — reliable on mobile (no popup blockers). */}
        {placed.payLink ? (
          <>
            <a href={placed.payLink} target="_blank" rel="noreferrer" className="btn bg-[#0666eb] text-white shadow-soft hover:bg-[#0552c2] w-full">
              <CardIcon width={20} height={20} /> Pay {formatPrice(placed.total)} with {methodLabel}
            </a>
            <p className="text-xs text-plum/50">
              {placed.paymentMethod === 'revolut' ? (
                <>
                  Enter <span className="font-semibold">{formatPrice(placed.total)}</span> and add reference{' '}
                  <span className="font-semibold">{placed.ref}</span> so Midge can match your order.
                </>
              ) : (
                <>
                  Please quote <span className="font-semibold">{placed.ref}</span> as the payment reference so Midge can match it up.
                </>
              )}
            </p>
          </>
        ) : (
          <p className="rounded-2xl bg-midg-50 p-4 text-sm text-plum/70">
            {placed.paymentMethod === 'collection'
              ? 'Pay cash when you collect — Midge will be in touch to arrange a time.'
              : placed.paymentMethod === 'bank'
              ? 'Midge will send you her bank transfer details to complete payment.'
              : `Midge will send you a ${methodLabel} payment request.`}{' '}
            Please keep your reference <span className="font-semibold">{placed.ref}</span>.
          </p>
        )}

        <Link href="/shop" className="btn-ghost">Continue shopping</Link>
      </div>
    );
  }

  // ── Empty basket ────────────────────────────────────────────────────────
  if (ready && items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-plum">Your basket is empty</h1>
        <p className="mt-2 text-sm text-plum/60">Add some treasures and they’ll appear here.</p>
        <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  // ── Basket + checkout ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-2">
      <h1 className="font-display text-2xl font-extrabold text-plum">Your basket</h1>

      <div className="card divide-y divide-midg-50">
        {items.map((i) => (
          <div key={i.listingId} className="flex items-center gap-3 p-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-midg-50">
              <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/item/${i.listingId}`} className="truncate text-sm font-semibold text-plum hover:text-midg-600">
                {i.title}
              </Link>
              <p className="text-sm font-bold text-midg-600">{formatPrice(i.price)}</p>
            </div>
            <button onClick={() => remove(i.listingId)} className="text-xs text-plum/40 hover:text-red-500">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Your details */}
      <div className="card space-y-3 p-5">
        <h2 className="text-sm font-bold text-plum">Your details <span className="font-normal text-plum/40">· so Midge can post your order</span></h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      {/* How would you like to pay? (required) */}
      <div className="card space-y-3 p-5">
        <h2 className="text-sm font-bold text-plum">How would you like to pay? <span className="font-normal text-midg-500">· required</span></h2>
        <div className="grid gap-2.5">
          {PAYMENT_METHODS.map((m) => {
            const active = method === m.id;
            return (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                  active ? 'border-midg-400 bg-midg-50 ring-2 ring-midg-100' : 'border-midg-100 hover:bg-midg-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={active}
                  onChange={() => setMethod(m.id)}
                  className="sr-only"
                />
                <span className="text-xl" aria-hidden>{m.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-plum">{m.label}</span>
                  <span className="block text-xs text-plum/50">{m.desc}</span>
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? 'border-midg-500 bg-midg-500 text-white' : 'border-midg-200'
                  }`}
                >
                  {active && <CheckIcon width={14} height={14} />}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="card space-y-2 p-5 text-sm">
        <div className="flex justify-between"><span className="text-plum/60">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-plum/60">UK postage</span><span>{formatPrice(postage)}</span></div>
        <div className="flex justify-between border-t border-midg-50 pt-2 text-lg font-extrabold text-plum">
          <span>Total</span><span className="text-midg-600">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={checkout}
        disabled={busy || !method}
        className="btn bg-[#0666eb] text-white shadow-soft hover:bg-[#0552c2] w-full"
      >
        <CardIcon width={20} height={20} />
        {busy ? 'Placing order…' : !method ? 'Choose a payment method' : `Place order · ${formatPrice(total)}`}
      </button>
      {!method && <p className="text-center text-xs text-plum/45">Please choose how you’d like to pay to continue.</p>}
    </div>
  );
}
