import type { Condition } from './types';

export const SHOP_NAME = 'MIDG3';
export const SHOP_TAGLINE = 'Pre-loved treasures, hand-picked with love';

// Where "Message to buy" enquiries go, and the WhatsApp quick-buy number.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@midg3.shop';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '';

// Server-only (no NEXT_PUBLIC_ prefix) so the owner's personal email is never
// shipped in the public browser bundle. Only read in server code (lib/auth).
export const OWNER_EMAIL = process.env.OWNER_EMAIL || '';

export interface SubCategory {
  slug: string;
  label: string;
  emoji: string;
}

export interface CategoryDef {
  slug: string;
  label: string;
  emoji: string;
  /** Optional audience/sub-department filters (used by Pre-Loved Clothing). */
  subcategories?: SubCategory[];
}

export const CATEGORIES: CategoryDef[] = [
  { slug: 'skincare', label: 'Skincare', emoji: '🧴' },
  { slug: 'haircare', label: 'Haircare', emoji: '💆‍♀️' },
  { slug: 'makeup', label: 'Makeup', emoji: '💄' },
  { slug: 'accessories', label: 'Accessories', emoji: '👜' },
  { slug: 'household', label: 'Household', emoji: '🏡' },
  {
    slug: 'clothing',
    label: 'Pre-Loved Clothing',
    emoji: '👗',
    subcategories: [
      { slug: 'adults', label: 'Adults', emoji: '👗' },
      { slug: 'kids', label: 'Kids', emoji: '🧸' },
    ],
  },
];

/** Look up a category (and optionally a sub-category) by slug for labels. */
export function findCategory(slug?: string | null): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function findSubCategory(
  categorySlug?: string | null,
  subSlug?: string | null
): SubCategory | undefined {
  return findCategory(categorySlug)?.subcategories?.find((s) => s.slug === subSlug);
}

export const CONDITIONS: Condition[] = [
  'New with tags',
  'New without tags',
  'Excellent',
  'Good',
  'Fair',
];

export const CURRENCY = 'GBP';
export const CURRENCY_SYMBOL = '£';

// Flat UK postage added at checkout (in pounds). All prices across the shop are
// in GBP (£).
export const POSTAGE = 3.99;

export const STORAGE_BUCKET = 'listing-images';

// Payment methods the buyer chooses between at checkout. Revolut/PayPal produce
// a pre-filled pay link when configured; the others give clear instructions.
export const PAYMENT_METHODS: {
  id: 'revolut' | 'paypal' | 'bank' | 'collection';
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { id: 'revolut', label: 'Revolut', emoji: '💳', desc: 'Pay by card or Revolut balance' },
  { id: 'paypal', label: 'PayPal', emoji: '🅿️', desc: 'PayPal account or card' },
  { id: 'bank', label: 'Bank transfer', emoji: '🏦', desc: 'Midge sends you her details' },
  { id: 'collection', label: 'Pay on collection', emoji: '🤝', desc: 'Cash when you collect (local)' },
];

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export function paymentMethodLabel(id?: string | null): string {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? (id || '—');
}
