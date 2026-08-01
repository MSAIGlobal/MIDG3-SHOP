import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">🌸</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold text-plum">Oops, that’s gone</h1>
      <p className="mt-2 text-sm text-plum/60">
        This page or item can’t be found — it may have been snapped up already.
      </p>
      <Link href="/shop" className="btn-primary mt-6">Back to the shop</Link>
    </div>
  );
}
