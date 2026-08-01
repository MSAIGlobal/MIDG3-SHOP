import type { Metadata } from 'next';
import { FollowForm } from '@/components/FollowForm';
import { TrustBar } from '@/components/TrustBar';
import { SHOP_TAGLINE } from '@/lib/constants';

export const metadata: Metadata = { title: 'Our story' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      <div className="rounded-4xl bg-gradient-to-br from-midg-400 to-midg-500 px-6 py-10 text-center text-white shadow-soft">
        <p className="font-script text-3xl">Hello lovely 👋</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Welcome to MIDG3</h1>
        <p className="mt-2 text-white/90">{SHOP_TAGLINE}</p>
      </div>

      <div className="card space-y-4 p-6 text-[15px] leading-relaxed text-plum/80">
        <p>
          MIDG3 started with a simple love of finding beautiful things a second life. Every
          piece in the shop is chosen by hand, checked over with care, and described as
          honestly as I’d want it described to me.
        </p>
        <p>
          Shopping pre-loved is kinder on your purse <em>and</em> the planet — and there’s
          nothing quite like the thrill of a one-of-a-kind find. Whether it’s a floaty summer
          dress, a proper leather bag or a little something for the home, I hope you find
          something to fall for.
        </p>
        <p className="font-semibold text-plum">
          Thank you for supporting a small shop. It genuinely means the world. 💕
        </p>
      </div>

      <TrustBar />

      <div className="overflow-hidden rounded-4xl bg-plum px-6 py-8 text-center text-white">
        <h2 className="font-display text-xl font-extrabold">Never miss a new arrival</h2>
        <p className="mt-1 text-sm text-white/75">Follow the shop and get first dibs on new treasures.</p>
        <div className="mx-auto mt-4 max-w-md">
          <FollowForm />
        </div>
      </div>
    </div>
  );
}
