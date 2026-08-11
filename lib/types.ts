// Shared domain types for MIDG3.

export type ListingStatus = 'active' | 'reserved' | 'sold';

export type Condition =
  | 'New with tags'
  | 'New without tags'
  | 'Excellent'
  | 'Good'
  | 'Fair';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number; // in major currency units (e.g. pounds)
  original_price: number | null; // for showing a reduction
  currency: string; // e.g. 'GBP'
  category: string;
  subcategory: string | null; // e.g. clothing audience: adults | kids | elders
  size: string | null;
  brand: string | null;
  color: string | null;
  condition: Condition;
  status: ListingStatus;
  images: string[]; // ordered image URLs, first is the cover
  created_at: string;
  seller_id?: string | null;
}

export interface PublicShopConfig {
  revolutUsername: string;
  paypalUsername: string;
  contactEmail: string;
  whatsapp: string;
}

export interface CartItem {
  listingId: string;
  title: string;
  price: number;
  image: string;
}

export interface OrderItem {
  id: string;
  listing_id: string | null;
  title: string;
  price: number;
}

export interface Order {
  id: string;
  ref: string;
  buyer_name: string | null;
  buyer_email: string | null;
  item_total: number;
  postage: number;
  total: number;
  currency: string;
  payment_method: string | null;
  status: 'placed' | 'paid' | 'cancelled' | 'refunded';
  created_at: string;
  items: OrderItem[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string | null;
  rating: number; // 1–5
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}
