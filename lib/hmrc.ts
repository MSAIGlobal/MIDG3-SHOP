// Helpers for building UK / HMRC-style income statements from orders.
//
// NOTE: This produces a monthly income statement + CSV for Self Assessment
// (SA103 self-employment) record-keeping. It is a bookkeeping export, not an
// automated submission — Making Tax Digital submissions require HMRC API
// onboarding.

import type { Order } from './types';

/** UK date format DD/MM/YYYY. */
export function ukDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Calendar-month key, e.g. "2026-08". */
export function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
}

/** UK tax year label (6 Apr – 5 Apr), e.g. "2026–27". */
export function taxYearLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  // Months Jan–Mar (1-3) fall in the tax year that started the previous April.
  const start = m >= 4 ? y : y - 1;
  return `${start}–${String((start + 1) % 100).padStart(2, '0')}`;
}

export interface MonthGroup {
  key: string;
  label: string;
  taxYear: string;
  orders: Order[];
  salesIncome: number;
  postage: number;
  total: number;
  count: number;
}

/** Group orders by calendar month, newest month first. */
export function groupByMonth(orders: Order[]): MonthGroup[] {
  const map = new Map<string, Order[]>();
  for (const o of orders) {
    const k = monthKey(o.created_at);
    (map.get(k) ?? map.set(k, []).get(k)!).push(o);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, os]) => ({
      key,
      label: monthLabel(key),
      taxYear: taxYearLabel(key),
      orders: os.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
      salesIncome: round(os.reduce((s, o) => s + o.item_total, 0)),
      postage: round(os.reduce((s, o) => s + o.postage, 0)),
      total: round(os.reduce((s, o) => s + o.total, 0)),
      count: os.length,
    }));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Build a CSV (income statement) for one month, aligned to SA103 columns. */
export function monthCsv(group: MonthGroup): string {
  const lines: string[] = [];
  lines.push(`MIDG3 income statement,${group.label}`);
  lines.push(`For UK Self Assessment (SA103) record-keeping — tax year ${group.taxYear}`);
  lines.push('');
  lines.push(
    ['Date', 'Reference', 'Description', 'Customer', 'Sales income (GBP)', 'Postage (GBP)', 'Total (GBP)']
      .map(csvCell)
      .join(',')
  );
  for (const o of group.orders) {
    lines.push(
      [
        ukDate(o.created_at),
        o.ref,
        o.items.map((i) => i.title).join('; '),
        o.buyer_name || '—',
        o.item_total.toFixed(2),
        o.postage.toFixed(2),
        o.total.toFixed(2),
      ]
        .map(csvCell)
        .join(',')
    );
  }
  lines.push('');
  lines.push(
    ['TOTAL', '', `${group.count} order(s)`, '', group.salesIncome.toFixed(2), group.postage.toFixed(2), group.total.toFixed(2)]
      .map(csvCell)
      .join(',')
  );
  return lines.join('\n');
}
