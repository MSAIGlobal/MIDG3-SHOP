import 'server-only';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/config';
import { SAMPLE_LISTINGS } from './sample-data';
import type { Listing, ListingStatus } from './types';

// Shape of a listing row joined with its images from Supabase.
interface ListingRow {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  currency: string;
  category: string;
  size: string | null;
  brand: string | null;
  color: string | null;
  condition: Listing['condition'];
  status: ListingStatus;
  created_at: string;
  seller_id: string | null;
  listing_images: { url: string; position: number }[] | null;
}

function rowToListing(row: ListingRow): Listing {
  const images = (row.listing_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((i) => i.url);
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    original_price: row.original_price != null ? Number(row.original_price) : null,
    currency: row.currency,
    category: row.category,
    size: row.size,
    brand: row.brand,
    color: row.color,
    condition: row.condition,
    status: row.status,
    images: images.length ? images : ['/placeholder.svg'],
    created_at: row.created_at,
    seller_id: row.seller_id,
  };
}

export interface ListingQuery {
  category?: string;
  search?: string;
  includeSold?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

/** Returns true when we're serving live data rather than sample stock. */
export function usingLiveData(): boolean {
  return isSupabaseConfigured;
}

export async function getListings(query: ListingQuery = {}): Promise<Listing[]> {
  const { category, search, includeSold = false, sort = 'newest' } = query;

  if (!isSupabaseConfigured) {
    return filterAndSortSample(SAMPLE_LISTINGS, query);
  }

  const supabase = createClient();
  if (!supabase) return filterAndSortSample(SAMPLE_LISTINGS, query);

  let q = supabase
    .from('listings')
    .select(
      'id,title,description,price,original_price,currency,category,size,brand,color,condition,status,created_at,seller_id,listing_images(url,position)'
    );

  if (!includeSold) q = q.neq('status', 'sold');
  if (category) q = q.eq('category', category);
  if (search) q = q.or(`title.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`);

  if (sort === 'price-asc') q = q.order('price', { ascending: true });
  else if (sort === 'price-desc') q = q.order('price', { ascending: false });
  else q = q.order('created_at', { ascending: false });

  const { data, error } = await q;
  if (error || !data) {
    // Fail soft — never show an empty broken shop.
    return filterAndSortSample(SAMPLE_LISTINGS, query);
  }
  return (data as unknown as ListingRow[]).map(rowToListing);
}

export async function getListing(id: string): Promise<Listing | null> {
  if (!isSupabaseConfigured) {
    return SAMPLE_LISTINGS.find((l) => l.id === id) ?? null;
  }
  const supabase = createClient();
  if (!supabase) return SAMPLE_LISTINGS.find((l) => l.id === id) ?? null;

  const { data, error } = await supabase
    .from('listings')
    .select(
      'id,title,description,price,original_price,currency,category,size,brand,color,condition,status,created_at,seller_id,listing_images(url,position)'
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToListing(data as unknown as ListingRow);
}

export async function getRelatedListings(listing: Listing, limit = 4): Promise<Listing[]> {
  const all = await getListings({ category: listing.category });
  return all.filter((l) => l.id !== listing.id).slice(0, limit);
}

function filterAndSortSample(listings: Listing[], query: ListingQuery): Listing[] {
  const { category, search, includeSold = false, sort = 'newest' } = query;
  let out = listings.slice();
  if (!includeSold) out = out.filter((l) => l.status !== 'sold');
  if (category) out = out.filter((l) => l.category === category);
  if (search) {
    const s = search.toLowerCase();
    out = out.filter(
      (l) =>
        l.title.toLowerCase().includes(s) ||
        (l.brand ?? '').toLowerCase().includes(s) ||
        l.description.toLowerCase().includes(s)
    );
  }
  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
  else out.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return out;
}
