import type { Testimonial } from '@/lib/types';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-midg-400" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden className={i < rating ? 'text-midg-400' : 'text-midg-100'}>
          ★
        </span>
      ))}
    </div>
  );
}

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="card flex w-[80vw] max-w-xs shrink-0 flex-col gap-3 p-5 sm:w-80">
      <Stars rating={t.rating} />
      <blockquote className="text-[15px] leading-relaxed text-plum/80">“{t.quote}”</blockquote>
      {t.author && (
        <figcaption className="mt-auto text-sm font-semibold text-midg-600">— {t.author}</figcaption>
      )}
    </figure>
  );
}

// Buyer-feedback scroller. Auto-scrolls as a marquee (pauses on hover/touch);
// on reduced-motion it becomes a normal swipeable row. Social proof like this is
// one of the most effective trust-builders for converting shoppers.
export function TestimonialScroller({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="marquee -mx-4 px-4">
      <div className="marquee-track py-1">
        {loop.map((t, i) => (
          <QuoteCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
