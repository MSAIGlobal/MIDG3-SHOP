import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline gap-0.5 font-script text-2xl leading-none text-midg-600 ${className}`}
      aria-label="MIDG3 home"
    >
      <span>MIDG</span>
      <span className="font-display text-xl font-extrabold text-midg-500">3</span>
    </Link>
  );
}
