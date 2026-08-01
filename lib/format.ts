import { CURRENCY_SYMBOL } from './constants';

export function formatPrice(value: number, symbol = CURRENCY_SYMBOL): string {
  const hasPennies = Math.round(value * 100) % 100 !== 0;
  return `${symbol}${value.toFixed(hasPennies ? 2 : 0)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  let count = seconds;
  let unit = 'second';
  for (const [size, name] of units) {
    if (count < size) {
      unit = name;
      break;
    }
    count = Math.floor(count / size);
    unit = name;
  }
  if (unit === 'second' && count < 30) return 'just now';
  const rounded = Math.max(1, Math.floor(count));
  return `${rounded} ${unit}${rounded === 1 ? '' : 's'} ago`;
}

export function discountPercent(price: number, original: number | null): number | null {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
}
