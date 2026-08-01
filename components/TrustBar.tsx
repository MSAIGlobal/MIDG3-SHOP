import { ShieldIcon, TruckIcon, SparkleIcon } from './icons';

// Trust signals reduce hesitation on second-hand buys. Kept short and scannable.
export function TrustBar() {
  const items = [
    { icon: SparkleIcon, title: 'Hand-picked', text: 'Every piece chosen with love' },
    { icon: ShieldIcon, title: 'Honestly described', text: 'What you see is what you get' },
    { icon: TruckIcon, title: 'Posted with care', text: 'Wrapped & sent quickly' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card flex flex-col items-center gap-1 p-3 text-center sm:flex-row sm:text-left sm:p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-midg-100 text-midg-600">
            <Icon width={18} height={18} />
          </span>
          <div>
            <p className="text-xs font-bold text-plum sm:text-sm">{title}</p>
            <p className="hidden text-xs text-plum/55 sm:block">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
