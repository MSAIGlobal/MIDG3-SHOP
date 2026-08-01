// Revolut payment links.
//
// Midge collects payment via her personal Revolut link (revolut.me/<username>).
// Revolut supports pre-filling an amount and currency in the URL, e.g.
//   https://revolut.me/midge/24gbp
// which opens Revolut (app or web) with the amount ready to send — perfect for a
// small reseller with no merchant account needed.

export const REVOLUT_USERNAME = (process.env.NEXT_PUBLIC_REVOLUT_USERNAME || '')
  // Accept a bare username, an @handle, or a full revolut.me link.
  .replace(/^@/, '')
  .replace(/^https?:\/\/(www\.)?revolut\.me\//i, '')
  .replace(/\/.*$/, '')
  .trim();

export function hasRevolut(): boolean {
  return REVOLUT_USERNAME.length > 0;
}

/** Build a pre-filled Revolut payment link for an amount + currency. */
export function revolutPayLink(amount: number, currency = 'GBP'): string | null {
  if (!REVOLUT_USERNAME) return null;
  const amt = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `https://revolut.me/${REVOLUT_USERNAME}/${amt}${currency.toLowerCase()}`;
}

// PayPal.me link (paypal.me/<username>/<amount><CURRENCY>).
export const PAYPAL_USERNAME = (process.env.NEXT_PUBLIC_PAYPAL_USERNAME || '')
  .replace(/^@/, '')
  .replace(/^https?:\/\/(www\.)?paypal\.me\//i, '')
  .replace(/\/.*$/, '')
  .trim();

export function hasPaypal(): boolean {
  return PAYPAL_USERNAME.length > 0;
}

export function paypalPayLink(amount: number, currency = 'GBP'): string | null {
  if (!PAYPAL_USERNAME) return null;
  const amt = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `https://paypal.me/${PAYPAL_USERNAME}/${amt}${currency.toUpperCase()}`;
}

/** Pay link for a chosen method, or null if that method has no direct link. */
export function payLinkFor(method: string, amount: number, currency = 'GBP'): string | null {
  if (method === 'revolut') return revolutPayLink(amount, currency);
  if (method === 'paypal') return paypalPayLink(amount, currency);
  return null;
}
