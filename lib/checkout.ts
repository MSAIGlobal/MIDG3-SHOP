'use client';

import { createClient } from './supabase/client';
import { payLinkFor } from './payments';
import { POSTAGE, CURRENCY, CURRENCY_SYMBOL } from './constants';
import type { CartItem, PublicShopConfig } from './types';

export interface CheckoutResult {
  ref: string;
  itemTotal: number;
  postage: number;
  total: number;
  paymentMethod: string;
  payLink: string | null;
  recorded: boolean; // true if persisted to the backend (for HMRC statements)
}

export interface Buyer {
  name: string;
  email: string;
  phone?: string;
  address: string;
  paymentMethod: string;
}

function makeRef(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MIDG3-${stamp}-${rand}`;
}

// Emails the shop owner the order + delivery details via Netlify Forms
// (best-effort — never blocks the order). The owner enables the email
// notification for the "order-notification" form in Netlify.
async function notifyOwner(fields: Record<string, string>) {
  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': 'order-notification', ...fields }).toString(),
    });
  } catch {
    /* notification is best-effort */
  }
}

// Records an order (when the backend is connected), emails the owner, and
// returns the payment link for the total (items + one flat postage).
export async function placeOrder(
  items: CartItem[],
  buyer: Buyer,
  config: Pick<PublicShopConfig, 'revolutUsername' | 'paypalUsername'>
): Promise<CheckoutResult> {
  const itemTotal = items.reduce((sum, i) => sum + i.price, 0);
  const postage = items.length ? POSTAGE : 0;
  const total = itemTotal + postage;
  const ref = makeRef();
  const paymentMethod = buyer.paymentMethod;
  const payLink = payLinkFor(paymentMethod, config, total, CURRENCY);

  let recorded = false;
  const supabase = createClient();
  if (supabase && items.length) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        ref,
        buyer_name: buyer.name || null,
        buyer_email: buyer.email || null,
        buyer_phone: buyer.phone || null,
        buyer_address: buyer.address || null,
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

  const p = (n: number) => `${CURRENCY_SYMBOL}${n.toFixed(2)}`;
  await notifyOwner({
    reference: ref,
    customer_name: buyer.name,
    customer_email: buyer.email,
    customer_phone: buyer.phone || '—',
    delivery_address: buyer.address,
    items: items.map((i) => `${i.title} (${p(i.price)})`).join('\n'),
    items_total: p(itemTotal),
    postage: p(postage),
    order_total: p(total),
    payment_method: paymentMethod,
  });

  return { ref, itemTotal, postage, total, paymentMethod, payLink, recorded };
}
