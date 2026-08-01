'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/format';
import {
  LinkIcon,
  ShareIcon,
  CheckIcon,
  WhatsAppIcon,
  FacebookIcon,
  XIcon,
  PinterestIcon,
  MailIcon,
} from './icons';

interface Props {
  id: string;
  title: string;
  price: number;
  image: string;
  className?: string;
}

// One-click share for a listing. "Copy link" grabs the item URL for pasting
// anywhere; the social buttons open each platform's post composer pre-filled.
// When the link is posted, it unfurls with the item's MAIN photo as the hero
// image (set via Open Graph tags on the item page).
export function ShareListing({ id, title, price, image, className = '' }: Props) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    const base =
      window.location.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://midg3-shop.netlify.app';
    setUrl(`${base}/item/${id}`);
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, [id]);

  const text = `${title} — ${formatPrice(price)} at MIDG3 ✨`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  const img = encodeURIComponent(image);

  const socials = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsAppIcon, color: 'text-[#25D366]' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon, color: 'text-[#1877F2]' },
    { label: 'Pinterest', href: `https://pinterest.com/pin/create/button/?url=${u}&media=${img}&description=${t}`, Icon: PinterestIcon, color: 'text-[#E60023]' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, Icon: XIcon, color: 'text-plum' },
    { label: 'Email', href: `mailto:?subject=${t}&body=${u}`, Icon: MailIcon, color: 'text-midg-500' },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copy}
          className={copied ? 'btn bg-emerald-100 text-emerald-700' : 'btn-secondary'}
        >
          {copied ? <CheckIcon width={18} height={18} /> : <LinkIcon width={18} height={18} />}
          {copied ? 'Link copied!' : 'Copy link'}
        </button>
        {canNativeShare && (
          <button onClick={nativeShare} className="btn-primary">
            <ShareIcon width={18} height={18} /> Share
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {socials.map(({ label, href, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Share on ${label}`}
            title={`Share on ${label}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-midg-100 transition hover:bg-midg-50 ${color}`}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}
