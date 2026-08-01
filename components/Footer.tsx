import Link from 'next/link';
import { Logo } from './Logo';
import { SHOP_TAGLINE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-midg-100 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-2 text-sm text-plum/60">{SHOP_TAGLINE}</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/shop" className="text-plum/70 hover:text-midg-600">Shop all</Link>
            <Link href="/about" className="text-plum/70 hover:text-midg-600">Our story</Link>
            <Link href="/favourites" className="text-plum/70 hover:text-midg-600">Saved items</Link>
            <Link href="/login" className="text-plum/70 hover:text-midg-600">Sign in</Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-plum/40">
          © {new Date().getFullYear()} MIDG3. Made with 💕. Pre-loved, re-loved.
        </p>
      </div>
    </footer>
  );
}
