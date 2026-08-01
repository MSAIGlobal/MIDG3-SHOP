'use client';

import { createClient } from './supabase/client';
import { payLinkFor } from './payments';
import { POSTAGE, CURRENCY } from './constants';
import type { CartItem } from './types';

export interface CheckoutResult {
  ref: string;
  itemTotal: number;
  postage: number;
  total: number;
  paymentMethod: string;
  payLink: string | null;
  recorded: boolean; // true if persisted to the backend (for HMRC statements)
}

function makeRef(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MIDG3-${stamp}-${rand}`;
}

// Records an order (when the backend is connected) and returns the Revolut
// payment link for the total (items + one flat postage). Works without a
// backend too — it still returns the pay link so Buy Now is never dead.
export async function placeOrder(
  items: CartItem[],
  buyer: { name?: string; email?: string; paymentMethod: string }
): Promise<CheckoutResult> {
  const itemTotal = items.reduce((sum, i) => sum + i.price, 0);
  const postage = items.length ? POSTAGE : 0;
  const total = itemTotal + postage;
  const ref = makeRef();
  const paymentMethod = buyer.paymentMethod;
  const payLink = payLinkFor(paymentMethod, total, CURRENCY);

  let recorded = false;
  const supabase = createClient();
  if (supabase && items.length) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ref,
        buyer_name: buyer.name || null,
        buyer_email: buyer.email || null,
        item_total: itemTotal,
        postage,
        total,
        currency: CURRENCY,
        payment_method: paymentMethod,
        status: 'placed',
      })
      .select('id')
      .single();

    if (!error && data) {
      const rows = items.map((i) => ({
        order_id: data.id,
        listing_id: i.listingId.startsWith('sample-') ? null : i.listingId,
        title: i.title,
        price: i.price,
      }));
      await supabase.from('order_items').insert(rows);
      recorded = true;
    }
  }

  return { ref, itemTotal, postage, total, paymentMethod, payLink, recorded };
}
