// Lightweight inline SVG icons (no icon library dependency).
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-3.5-3.5" />
  </svg>
);

export const HeartIcon = (p: P & { filled?: boolean }) => (
  <svg {...base} fill={p.filled ? 'currentColor' : 'none'} {...p}>
    <path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3 0 4.5 3 3 6C19 15.65 12 20 12 20Z" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m20 6-11 11-5-5" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" fill="currentColor" stroke="none" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const CardIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 9.5h19" />
    <path d="M6 14.5h4" />
  </svg>
);

export const CameraIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="3.2" />
  </svg>
);

export const UploadIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 16V5" />
    <path d="m7 10 5-5 5 5" />
    <path d="M5 19h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13" />
    <path d="M9 7V4h6v3" />
  </svg>
);

export const ShareIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8 15.8 6.2M8.2 13.2l7.6 4.6" />
  </svg>
);

export const LinkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
  </svg>
);

export const MailIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const FacebookIcon = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H18V.3C17.6.2 16.4 0 15.1 0 12.4 0 10.6 1.6 10.6 4.6V6H8v3h2.6v9H14V9Z" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.9 2H22l-7 8 8.2 12H16l-5-7.3L5.2 22H2l7.5-8.6L1.6 2H8l4.6 6.8L18.9 2Zm-1.1 18h1.7L7.3 4H5.4l12.4 16Z" />
  </svg>
);

export const PinterestIcon = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2C6.5 2 4 5.6 4 8.9c0 2 .8 3.8 2.4 4.4.3.1.5 0 .5-.3l.2-.9c.1-.3 0-.4-.1-.6-.4-.5-.7-1.2-.7-2.1 0-2.7 2-5.1 5.3-5.1 2.9 0 4.5 1.8 4.5 4.1 0 3.1-1.4 5.7-3.4 5.7-1.1 0-1.9-.9-1.7-2 .3-1.3.9-2.7.9-3.6 0-.8-.4-1.5-1.4-1.5-1.1 0-2 1.1-2 2.7 0 1 .3 1.6.3 1.6l-1.4 5.7c-.4 1.7-.1 3.8 0 4 .1.1.2.1.3 0 .1-.2 1.7-2.1 2.3-4l.8-3c.4.8 1.5 1.4 2.7 1.4 3.6 0 6-3.3 6-7.6C20 5.2 17.2 2 12 2Z" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7L12 17.8 5.7 21l1.5-7L2 9.3l7-.8L12 2Z" />
  </svg>
);

export const WhatsAppIcon = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.02c-.24.68-1.42 1.32-1.95 1.36-.5.04-.99.22-3.35-.7-2.82-1.11-4.6-3.98-4.74-4.16-.14-.18-1.13-1.5-1.13-2.86 0-1.36.71-2.03.96-2.31.25-.28.55-.35.73-.35l.53.01c.17 0 .4-.06.62.48.24.58.81 2 .88 2.14.07.14.12.31.02.49-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.6-.14.24.09 1.53.72 1.79.85.26.13.43.2.5.31.07.12.07.68-.17 1.36Z" />
  </svg>
);
