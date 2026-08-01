import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/lib/cart';
import { getSessionUser } from '@/lib/auth';
import { SHOP_NAME, SHOP_TAGLINE } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: `${SHOP_NAME} — ${SHOP_TAGLINE}`,
    template: `%s · ${SHOP_NAME}`,
  },
  description:
    'MIDG3 is a boutique of pre-loved treasures — hand-picked fashion, bags and homeware, described honestly and posted with care. Follow the shop for first dibs on new arrivals.',
  openGraph: {
    title: `${SHOP_NAME} — ${SHOP_TAGLINE}`,
    description: 'Pre-loved treasures, hand-picked with love. New arrivals all the time.',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ff2d8e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const isOwner = Boolean(user?.isOwner);
  const signedIn = Boolean(user);

  return (
    <html lang="en-GB">
      <body className="min-h-screen">
        <CartProvider>
          <Header isOwner={isOwner} signedIn={signedIn} />
          {/* Bottom padding leaves room for the mobile tab bar. */}
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 pb-28 pt-4 md:pb-10">{children}</main>
          <Footer />
          <BottomNav isOwner={isOwner} signedIn={signedIn} />
        </CartProvider>
      </body>
    </html>
  );
}
