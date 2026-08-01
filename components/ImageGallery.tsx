'use client';

import Image from 'next/image';
import { useState } from 'react';

// Swipeable, tap-to-change photo gallery. Big imagery is the number-one
// conversion lever in fashion resale, so it fills the mobile viewport.
export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const safe = images.length ? images : ['/placeholder.svg'];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-midg-50 sm:rounded-4xl">
        <Image
          src={safe[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {safe.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {safe.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {safe.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
          {safe.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                i === active ? 'ring-midg-500' : 'ring-transparent'
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
