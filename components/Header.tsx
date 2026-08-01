import Link from 'next/link';
import { Logo } from './Logo';
import { SearchIcon, HeartIcon, UserIcon, PlusIcon } from './icons';

interface Props {
  isOwner: boolean;
  signedIn: boolean;
}

// Top bar. Search is front-and-centre — findability drives resale sales.
export function Header({ isOwner, signedIn }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-midg-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo />

        {/* Search — hidden on the very smallest screens where the pill below shows */}
        <form action="/shop" className="ml-auto hidden flex-1 sm:block sm:max-w-md">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-midg-400"
              width={18}
              height={18}
            />
            <input
              type="search"
              name="q"
              placeholder="Search dresses, bags, brands…"
              className="input pl-10"
              aria-label="Search the shop"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:ml-2">
          {isOwner && (
            <Link href="/sell" className="btn-primary hidden md:inline-flex">
              <PlusIcon width={18} height={18} /> Add item
            </Link>
          )}
          <Link
            href="/favourites"
            className="hidden rounded-full p-2.5 text-plum/70 transition hover:bg-midg-50 hover:text-midg-600 md:inline-flex"
            aria-label="Saved items"
          >
            <HeartIcon />
          </Link>
          <Link
            href={signedIn ? '/account' : '/login'}
            className="hidden rounded-full p-2.5 text-plum/70 transition hover:bg-midg-50 hover:text-midg-600 md:inline-flex"
            aria-label={signedIn ? 'Your account' : 'Sign in'}
          >
            <UserIcon />
          </Link>
        </nav>
      </div>

      {/* Compact search pill for the smallest screens */}
      <form action="/shop" className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-midg-400"
            width={18}
            height={18}
          />
          <input
            type="search"
            name="q"
            placeholder="Search the shop…"
            className="input pl-10"
            aria-label="Search the shop"
          />
        </div>
      </form>
    </header>
  );
}
