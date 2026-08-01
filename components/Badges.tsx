import type { Condition, ListingStatus } from '@/lib/types';

const conditionStyles: Record<Condition, string> = {
  'New with tags': 'bg-emerald-100 text-emerald-700',
  'New without tags': 'bg-teal-100 text-teal-700',
  Excellent: 'bg-midg-100 text-midg-700',
  Good: 'bg-amber-100 text-amber-700',
  Fair: 'bg-stone-200 text-stone-700',
};

export function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${conditionStyles[condition]}`}
    >
      {condition}
    </span>
  );
}

export function StatusBadge({ status }: { status: ListingStatus }) {
  if (status === 'active') return null;
  const map = {
    reserved: { label: 'Reserved', cls: 'bg-amber-500' },
    sold: { label: 'Sold', cls: 'bg-plum' },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
