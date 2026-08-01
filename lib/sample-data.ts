import type { Listing, Testimonial, Order } from './types';

// Demo stock shown before the Supabase backend is connected, so the shop looks
// alive from the very first deploy. Once real listings exist they take over.
// Photos are free-to-use Unsplash images.
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const hoursAgo = (h: number) => new Date(Date.now() - 1000 * 60 * 60 * h).toISOString();

export const SAMPLE_LISTINGS: Listing[] = [
  // ── Skincare ───────────────────────────────────────────────────────────
  {
    id: 'sample-1',
    title: 'Vitamin C Brightening Serum',
    description:
      'Brand-new, sealed vitamin C serum for a healthy glow. Helps even skin tone and brighten dull days. Bought as part of a bundle and never needed. 30ml.',
    price: 14, original_price: 22, currency: 'GBP',
    category: 'skincare', subcategory: null,
    size: '30ml', brand: null, color: null, condition: 'New with tags', status: 'active',
    images: [img('photo-1556228578-8c89e6adf883'), img('photo-1620916566398-39f1143ab7be')],
    created_at: hoursAgo(2),
  },
  {
    id: 'sample-2',
    title: 'Hydrating Rose Face Mist',
    description:
      'Gorgeous rose-scented facial mist to refresh and hydrate throughout the day. Used once or twice, practically full. Lovely on a warm day.',
    price: 9, original_price: null, currency: 'GBP',
    category: 'skincare', subcategory: null,
    size: '100ml', brand: null, color: 'Pink', condition: 'Excellent', status: 'active',
    images: [img('photo-1556760544-74068565f05c')],
    created_at: hoursAgo(9),
  },

  // ── Haircare ───────────────────────────────────────────────────────────
  {
    id: 'sample-3',
    title: 'Argan Oil Hair Treatment Set',
    description:
      'Nourishing argan oil duo — shampoo and mask for dry or coloured hair. New and unused, boxed. Smells divine and leaves hair super soft.',
    price: 16, original_price: 26, currency: 'GBP',
    category: 'haircare', subcategory: null,
    size: null, brand: null, color: null, condition: 'New with tags', status: 'active',
    images: [img('photo-1522338242992-e1a54906a8da'), img('photo-1526947425960-945c6e72858f')],
    created_at: hoursAgo(15),
  },
  {
    id: 'sample-4',
    title: 'Detangling Hair Brush — Blush Pink',
    description:
      'Gentle detangling brush, perfect for wet or dry hair. Barely used, cleaned and ready. Kind to little ones’ hair too.',
    price: 6, original_price: null, currency: 'GBP',
    category: 'haircare', subcategory: null,
    size: null, brand: null, color: 'Pink', condition: 'Good', status: 'active',
    images: [img('photo-1571875257727-256c39da42af')],
    created_at: hoursAgo(22),
  },

  // ── Makeup ─────────────────────────────────────────────────────────────
  {
    id: 'sample-5',
    title: 'Nude Eyeshadow Palette',
    description:
      'Beautiful everyday nude palette — warm neutrals and a couple of shimmers. Swatched only, fully hygienic. A wardrobe staple for any make-up bag.',
    price: 12, original_price: 20, currency: 'GBP',
    category: 'makeup', subcategory: null,
    size: null, brand: null, color: 'Nude', condition: 'New without tags', status: 'active',
    images: [img('photo-1596462502278-27bfdc403348'), img('photo-1522337660859-02fbefca4702')],
    created_at: hoursAgo(28),
  },
  {
    id: 'sample-6',
    title: 'Rose Tinted Lip Gloss Trio',
    description:
      'Set of three glossy lip tints in the prettiest rosy shades. Brand new, never opened. The perfect little treat or gift.',
    price: 10, original_price: null, currency: 'GBP',
    category: 'makeup', subcategory: null,
    size: null, brand: null, color: 'Pink', condition: 'New with tags', status: 'active',
    images: [img('photo-1512496015851-a90fb38ba796')],
    created_at: hoursAgo(34),
  },

  // ── Accessories ────────────────────────────────────────────────────────
  {
    id: 'sample-7',
    title: 'Classic Leather Crossbody Bag',
    description:
      'Timeless tan leather crossbody with gold hardware. Roomy enough for all your essentials. A little patina that only adds to the charm. Adjustable strap.',
    price: 35, original_price: null, currency: 'GBP',
    category: 'accessories', subcategory: null,
    size: null, brand: 'Fossil', color: 'Tan', condition: 'Excellent', status: 'active',
    images: [img('photo-1584917865442-de89df76afd3')],
    created_at: hoursAgo(40),
  },
  {
    id: 'sample-8',
    title: 'Blush Silk Scarf',
    description:
      'Luxurious blush silk scarf with a delicate print. Wear it in your hair, on your bag, or around your neck. Adds instant polish to any outfit.',
    price: 12, original_price: null, currency: 'GBP',
    category: 'accessories', subcategory: null,
    size: null, brand: null, color: 'Pink', condition: 'New with tags', status: 'active',
    images: [img('photo-1601924994987-69e26d50dc26')],
    created_at: hoursAgo(46),
  },
  {
    id: 'sample-9',
    title: 'Gold Hoop Earrings',
    description:
      'Everyday gold-tone hoops with a lovely weight to them. Hypoallergenic posts. The kind of earrings you put on and never take off.',
    price: 9, original_price: 15, currency: 'GBP',
    category: 'accessories', subcategory: null,
    size: null, brand: null, color: 'Gold', condition: 'New with tags', status: 'active',
    images: [img('photo-1635767798638-3e25273a8236')],
    created_at: hoursAgo(54),
  },

  // ── Household ───────────────────────────────────────────────────────────
  {
    id: 'sample-10',
    title: 'Handmade Ceramic Vase',
    description:
      'A one-of-a-kind handmade ceramic vase in soft neutral tones. Perfect for dried stems or fresh blooms. A little characterful wobble that shows it’s the real deal.',
    price: 22, original_price: null, currency: 'GBP',
    category: 'household', subcategory: null,
    size: null, brand: null, color: 'Beige', condition: 'Excellent', status: 'active',
    images: [img('photo-1578500494198-246f612d3b3d')],
    created_at: hoursAgo(62),
  },
  {
    id: 'sample-11',
    title: 'Scented Soy Candle Set',
    description:
      'Set of hand-poured soy candles — warm vanilla and fresh linen. Brand new, boxed, never lit. Cosy up your home or gift them on.',
    price: 15, original_price: 24, currency: 'GBP',
    category: 'household', subcategory: null,
    size: null, brand: null, color: null, condition: 'New with tags', status: 'active',
    images: [img('photo-1556909212-d5b604d0c90d'), img('photo-1591348122449-02525d70379b')],
    created_at: hoursAgo(70),
  },
  {
    id: 'sample-12',
    title: 'Linen Cushion Cover Pair',
    description:
      'Two soft linen-blend cushion covers in a warm oat tone. Freshly washed, hidden zip, 45x45cm. Instantly refresh your sofa.',
    price: 13, original_price: null, currency: 'GBP',
    category: 'household', subcategory: null,
    size: '45x45cm', brand: null, color: 'Oat', condition: 'Good', status: 'active',
    images: [img('photo-1584100936595-c0654b55a2e2')],
    created_at: hoursAgo(80),
  },

  // ── Pre-Loved Clothing · Adults ─────────────────────────────────────────
  {
    id: 'sample-13',
    title: 'Vintage 90s Levi’s Denim Jacket',
    description:
      'Gorgeous true-vintage Levi’s trucker jacket. Perfectly broken-in denim with that soft, lived-in feel. No rips or marks — just lovely honest wear. A proper wardrobe staple.',
    price: 42, original_price: 68, currency: 'GBP',
    category: 'clothing', subcategory: 'adults',
    size: 'M', brand: 'Levi’s', color: 'Blue', condition: 'Excellent', status: 'active',
    images: [img('photo-1516762689617-e1cffcef479d'), img('photo-1576871337622-98d48d1cf531')],
    created_at: hoursAgo(90),
  },
  {
    id: 'sample-14',
    title: 'Floral Tea Dress — Summer Ready',
    description:
      'The prettiest ditsy floral tea dress. Flattering wrap waist and a twirl-worthy skirt. Worn once to a garden party, freshly laundered and ready for its next adventure.',
    price: 24, original_price: null, currency: 'GBP',
    category: 'clothing', subcategory: 'adults',
    size: 'S', brand: 'Zara', color: 'Pink', condition: 'New without tags', status: 'active',
    images: [img('photo-1595777457583-95e059d581b8')],
    created_at: hoursAgo(100),
  },
  {
    id: 'sample-15',
    title: 'Tailored Wool Blazer',
    description:
      'Sharp navy wool-blend blazer. Beautifully structured shoulders and a nipped-in waist. Dress it up for work or throw over a tee. Dry-cleaned and immaculate.',
    price: 32, original_price: 55, currency: 'GBP',
    category: 'clothing', subcategory: 'adults',
    size: 'M', brand: 'Mango', color: 'Navy', condition: 'Excellent', status: 'reserved',
    images: [img('photo-1591047139829-d91aecb6caea')],
    created_at: hoursAgo(120),
  },

  // ── Pre-Loved Clothing · Kids ───────────────────────────────────────────
  {
    id: 'sample-16',
    title: 'Kids’ Rainbow Raincoat (Age 4-5)',
    description:
      'Adorable and practical rainbow raincoat. Fully waterproof with a cosy hood. Only outgrown, barely worn. Will brighten up any rainy school run.',
    price: 11, original_price: null, currency: 'GBP',
    category: 'clothing', subcategory: 'kids',
    size: '4-5y', brand: 'Next', color: 'Multi', condition: 'Excellent', status: 'active',
    images: [img('photo-1503919545889-aef636e10ad4')],
    created_at: hoursAgo(135),
  },

  {
    id: 'sample-17',
    title: 'Soft Lambswool Cardigan',
    description:
      'Wonderfully soft lambswool cardigan with easy-to-do buttons. Warm, lightweight and cosy. A little pilling but plenty of love left.',
    price: 26, original_price: 40, currency: 'GBP',
    category: 'clothing', subcategory: 'adults',
    size: 'L', brand: null, color: 'Camel', condition: 'Good', status: 'active',
    images: [img('photo-1594035910387-fea47794261f')],
    created_at: hoursAgo(150),
  },
  {
    id: 'sample-18',
    title: 'Chunky Cream Knit Jumper',
    description:
      'Snuggly oversized cable knit in a soft cream. Cosy without being bulky. Absolutely no bobbling. Perfect with jeans and boots for crisp autumn days.',
    price: 18, original_price: 30, currency: 'GBP',
    category: 'clothing', subcategory: 'adults',
    size: 'L', brand: 'H&M', color: 'Cream', condition: 'Good', status: 'sold',
    images: [img('photo-1576871337622-98d48d1cf531')],
    created_at: hoursAgo(200),
  },
];

// Buyer feedback quotes shown in the home-page scroller before the backend is
// connected. Once Midge uploads real quotes they take over.
export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  { id: 't1', quote: 'Absolutely gorgeous dress and posted so quickly. Exactly as described — will 100% buy again! 💕', author: 'Sarah M.', rating: 5, created_at: hoursAgo(30) },
  { id: 't2', quote: 'Lovely little shop with a personal touch. The wrapping was so pretty it felt like a gift to myself.', author: 'Priya K.', rating: 5, created_at: hoursAgo(60) },
  { id: 't3', quote: 'Great quality skincare at a brilliant price. Honest description and super friendly. Thank you Midge!', author: 'Emma T.', rating: 5, created_at: hoursAgo(90) },
  { id: 't4', quote: 'Bought a bag for my mum and she adores it. Fab communication and speedy delivery.', author: 'Danielle R.', rating: 5, created_at: hoursAgo(120) },
  { id: 't5', quote: 'My go-to for pre-loved treasures now. Everything arrives clean, fresh and beautifully packaged.', author: 'Aisha B.', rating: 5, created_at: hoursAgo(150) },
  { id: 't6', quote: 'Five stars! Kids’ raincoat was spotless and such good value. Highly recommend this shop.', author: 'Laura P.', rating: 5, created_at: hoursAgo(180) },
];

const daysAgo = (d: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * d).toISOString();

// Sample orders so the HMRC statements format can be previewed before the
// backend is connected. Spread across recent weeks/months. Replaced by real
// orders once customers check out.
export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'o1', ref: 'MIDG3-SAMPLE-1042', buyer_name: 'Sarah Malik', buyer_email: 'sarah@example.com',
    item_total: 42, postage: 3.99, total: 45.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(3),
    items: [{ id: 'oi1', listing_id: null, title: 'Vintage 90s Levi’s Denim Jacket', price: 42 }],
  },
  {
    id: 'o2', ref: 'MIDG3-SAMPLE-1041', buyer_name: 'Priya Kaur', buyer_email: 'priya@example.com',
    item_total: 27, postage: 3.99, total: 30.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(6),
    items: [
      { id: 'oi2', listing_id: null, title: 'Blush Silk Scarf', price: 12 },
      { id: 'oi3', listing_id: null, title: 'Vitamin C Brightening Serum', price: 14 },
    ],
  },
  {
    id: 'o3', ref: 'MIDG3-SAMPLE-1040', buyer_name: 'Emma Thompson', buyer_email: 'emma@example.com',
    item_total: 16, postage: 3.99, total: 19.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(12),
    items: [{ id: 'oi4', listing_id: null, title: 'Argan Oil Hair Treatment Set', price: 16 }],
  },
  {
    id: 'o4', ref: 'MIDG3-SAMPLE-1039', buyer_name: 'Danielle Roberts', buyer_email: 'dani@example.com',
    item_total: 35, postage: 3.99, total: 38.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(20),
    items: [{ id: 'oi5', listing_id: null, title: 'Classic Leather Crossbody Bag', price: 35 }],
  },
  {
    id: 'o5', ref: 'MIDG3-SAMPLE-1038', buyer_name: 'Aisha Begum', buyer_email: 'aisha@example.com',
    item_total: 24, postage: 3.99, total: 27.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(38),
    items: [{ id: 'oi6', listing_id: null, title: 'Floral Tea Dress — Summer Ready', price: 24 }],
  },
  {
    id: 'o6', ref: 'MIDG3-SAMPLE-1037', buyer_name: 'Laura Price', buyer_email: 'laura@example.com',
    item_total: 21, postage: 3.99, total: 24.99, currency: 'GBP', payment_method: 'revolut', status: 'paid', created_at: daysAgo(45),
    items: [
      { id: 'oi7', listing_id: null, title: 'Kids’ Rainbow Raincoat (Age 4-5)', price: 11 },
      { id: 'oi8', listing_id: null, title: 'Rose Tinted Lip Gloss Trio', price: 10 },
    ],
  },
];
