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
  size: string | null;
  brand: string | null;
  color: string | null;
  condition: Condition;
  status: ListingStatus;
  images: string[]; // ordered image URLs, first is the cover
  created_at: string;
  seller_id?: string | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}
