'use client';

import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/format';
import { groupByMonth, monthCsv, ukDate } from '@/lib/hmrc';
import type { Order } from '@/lib/types';

export function HmrcStatements({ orders, preview }: { orders: Order[]; preview: boolean }) {
  const groups = useMemo(() => groupByMonth(orders), [orders]);
  const [key, setKey] = useState(groups[0]?.key ?? '');
  const group = groups.find((g) => g.key === key) ?? groups[0];

  function downloadCsv() {
    if (!group) return;
    const blob = new Blob([monthCsv(group)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MIDG3-HMRC-${group.key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!group) {
    return (
      <div className="card p-10 text-center">
        <p className="text-4xl">🧾</p>
        <p className="mt-3 font-semibold text-plum">No sales yet</p>
        <p className="mt-1 text-sm text-plum/60">
          Once customers check out, their orders appear here grouped into monthly statements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {preview && (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          👀 Preview with sample orders. Real sales appear here automatically once the backend is
          connected and customers check out.
        </p>
      )}

      {/* Month picker + exports */}
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <label className="text-sm font-semibold text-plum/70" htmlFor="month">Month</label>
        <select id="month" className="input max-w-[16rem]" value={key} onChange={(e) => setKey(e.target.value)}>
          {groups.map((g) => (
            <option key={g.key} value={g.key}>{g.label} — {formatPrice(g.total)}</option>
          ))}
        </select>
        <button onClick={downloadCsv} className="btn-primary">Download CSV</button>
        <button onClick={() => window.print()} className="btn-secondary">Print / PDF</button>
      </div>

      {/* Statement */}
      <div className="card overflow-hidden">
        <div className="border-b border-midg-50 p-5">
          <h2 className="font-display text-lg font-extrabold text-plum">Income statement — {group.label}</h2>
          <p className="text-xs text-plum/55">
            MIDG3 · For UK Self Assessment (SA103) record-keeping · Tax year {group.taxYear} · All amounts GBP (£)
          </p>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {[
            { label: 'Sales income', value: formatPrice(group.salesIncome) },
            { label: 'Postage', value: formatPrice(group.postage) },
            { label: 'Total received', value: formatPrice(group.total) },
            { label: 'Orders', value: String(group.count) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-midg-50 p-3 text-center">
              <p className="text-lg font-extrabold text-midg-600">{s.value}</p>
              <p className="text-xs font-semibold text-plum/55">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-y border-midg-50 text-xs uppercase tracking-wide text-plum/50">
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Reference</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 text-right font-semibold">Sales (£)</th>
                <th className="p-3 text-right font-semibold">Postage (£)</th>
                <th className="p-3 text-right font-semibold">Total (£)</th>
              </tr>
            </thead>
            <tbody>
              {group.orders.map((o) => (
                <tr key={o.id} className="border-b border-midg-50/70 align-top">
                  <td className="whitespace-nowrap p-3 text-plum/70">{ukDate(o.created_at)}</td>
                  <td className="whitespace-nowrap p-3 font-medium text-plum">{o.ref}</td>
                  <td className="p-3 text-plum/70">{o.items.map((i) => i.title).join('; ')}</td>
                  <td className="p-3 text-plum/70">{o.buyer_name || '—'}</td>
                  <td className="p-3 text-right text-plum/80">{o.item_total.toFixed(2)}</td>
                  <td className="p-3 text-right text-plum/80">{o.postage.toFixed(2)}</td>
                  <td className="p-3 text-right font-semibold text-plum">{o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-midg-50 font-extrabold text-plum">
                <td className="p-3" colSpan={4}>Total · {group.count} order(s)</td>
                <td className="p-3 text-right">{group.salesIncome.toFixed(2)}</td>
                <td className="p-3 text-right">{group.postage.toFixed(2)}</td>
                <td className="p-3 text-right text-midg-600">{group.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <p className="text-xs text-plum/45">
        Keep these records for your Self Assessment. Sales income (turnover) goes in your SA103;
        postage you pay to send items is a separate allowable expense. This export is for
        record-keeping — it isn’t an automatic HMRC submission. If you’re registered for Making Tax
        Digital, submit via your compatible software or accountant.
      </p>
    </div>
  );
}
