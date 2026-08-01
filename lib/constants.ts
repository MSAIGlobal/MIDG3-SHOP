import type { Condition } from './types';

export const SHOP_NAME = 'MIDG3';
export const SHOP_TAGLINE = 'Pre-loved treasures, hand-picked with love';

// Where "Message to buy" enquiries go, and the WhatsApp quick-buy number.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@midg3.shop';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '';

export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || '';

export const CATEGORIES: { slug: string; label: string; emoji: string }[] = [
  { slug: 'womenswear', label: 'Womenswear', emoji: '👗' },
  { slug: 'menswear', label: 'Menswear', emoji: '👔' },
  { slug: 'kids', label: 'Kids', emoji: '🧸' },
  { slug: 'shoes', label: 'Shoes', emoji: '👟' },
  { slug: 'bags', label: 'Bags', emoji: '👜' },
  { slug: 'accessories', label: 'Accessories', emoji: '💎' },
  { slug: 'jewellery', label: 'Jewellery', emoji: '💍' },
  { slug: 'home', label: 'Home', emoji: '🏡' },
];

export const CONDITIONS: Condition[] = [
  'New with tags',
  'New without tags',
  'Excellent',
  'Good',
  'Fair',
];

export const CURRENCY = 'GBP';
export const CURRENCY_SYMBOL = '£';

export const STORAGE_BUCKET = 'listing-images';
