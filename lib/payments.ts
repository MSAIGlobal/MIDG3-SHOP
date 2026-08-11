// Payment links. Handles are supplied by the caller (from the DB-backed shop
// config) rather than read from env here, so they can be changed without a
// rebuild.

function normalise(username: string, host: string): string {
  return (username || '')
    .replace(/^@/, '')
    .replace(new RegExp(`^https?://(www\\.)?${host}/`, 'i'), '')
    .replace(/\/.*$/, '')
    .trim();
}

// Revolut personal link — the plain profile link (opens reliably). The
// amount-in-path format isn't openable by the Revolut app, so the buyer enters
// the shown amount + reference.
export function revolutPayLink(username: string): string | null {
  const u = normalise(username, 'revolut\\.me');
  return u ? `https://revolut.me/${u}` : null;
}

// PayPal.Me link with the amount pre-filled (reliable click-and-pay).
export function paypalPayLink(username: string, amount: number, currency = 'GBP'): string | null {
  const u = normalise(username, 'paypal\\.me');
  if (!u) return null;
  const amt = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `https://paypal.me/${u}/${amt}${currency.toUpperCase()}`;
}

/** Pay link for a chosen method using the shop's configured handles. */
export function payLinkFor(
  method: string,
  config: { revolutUsername: string; paypalUsername: string },
  amount: number,
  currency = 'GBP'
): string | null {
  if (method === 'revolut') return revolutPayLink(config.revolutUsername);
  if (method === 'paypal') return paypalPayLink(config.paypalUsername, amount, currency);
  return null;
}
