'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, SearchIcon, HeartIcon, UserIcon, PlusIcon } from './icons';

interface Props {
  isOwner: boolean;
  signedIn: boolean;
}

// Mobile-first bottom tab bar — always within thumb's reach. This is the
// primary navigation on phones (where most customers shop).
export function BottomNav({ isOwner, signedIn }: Props) {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/shop', label: 'Shop', icon: SearchIcon },
    isOwner
      ? { href: '/sell', label: 'Sell', icon: PlusIcon, highlight: true }
      : { href: '/favourites', label: 'Saved', icon: HeartIcon },
    {
      href: signedIn ? '/account' : '/login',
      label: signedIn ? 'Account' : 'Sign in',
      icon: UserIcon,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-midg-100 bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ href, label, icon: Icon, ...rest }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          const highlight = 'highlight' in rest && rest.highlight;
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  active ? 'text-midg-600' : 'text-plum/50'
                }`}
              >
                <span
                  className={
                    highlight
                      ? 'flex h-9 w-9 items-center justify-center rounded-full bg-midg-500 text-white shadow-soft'
                      : ''
                  }
                >
                  <Icon width={22} height={22} {...(active && !highlight ? { filled: true } : {})} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
