'use client';

import { useShopConfig } from './ConfigProvider';
import { FollowForm } from './FollowForm';
import { FacebookIcon, InstagramIcon, StarIcon } from './icons';

// Shown on the order confirmation: follow the shop (email), follow socials, and
// save/bookmark the site — one tap each.
export function StayInTouch() {
  const { facebookUrl, instagramUrl } = useShopConfig();

  function bookmark() {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const w = window as unknown as {
      sidebar?: { addPanel?: (t: string, u: string, x: string) => void };
      external?: { AddFavorite?: (u: string, t: string) => void };
    };
    try {
      if (w.sidebar?.addPanel) return w.sidebar.addPanel('MIDG3', url, '');
      if (w.external?.AddFavorite) return w.external.AddFavorite(url, 'MIDG3');
    } catch {
      /* fall through to hint */
    }
    const mac = /mac/i.test(navigator.platform);
    alert(`Press ${mac ? '⌘' : 'Ctrl'} + D to add MIDG3 to your favourites ⭐`);
  }

  const socials = [
    facebookUrl && { label: 'Facebook', href: facebookUrl, Icon: FacebookIcon, cls: 'bg-[#1877F2]' },
    instagramUrl && {
      label: 'Instagram',
      href: instagramUrl,
      Icon: InstagramIcon,
      cls: 'bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]',
    },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof FacebookIcon; cls: string }[];

  return (
    <div className="overflow-hidden rounded-4xl bg-gradient-to-br from-plum to-midg-700 px-6 py-7 text-white">
      <h3 className="font-display text-lg font-extrabold">Stay in touch 💕</h3>
      <p className="mt-1 text-sm text-white/80">Be first to see new arrivals and secret sales.</p>

      <div className="mx-auto mt-4 max-w-sm">
        <FollowForm />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        {socials.map(({ label, href, Icon, cls }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white ${cls}`}
          >
            <Icon width={18} height={18} /> Follow on {label}
          </a>
        ))}
        <button
          onClick={bookmark}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25"
        >
          <StarIcon width={16} height={16} /> Save this shop
        </button>
      </div>
    </div>
  );
}
