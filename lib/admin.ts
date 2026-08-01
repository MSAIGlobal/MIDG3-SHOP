import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

// Fixed-credential owner login that works WITHOUT the Supabase backend.
// The credentials live in server-only env vars (never in the repo or the
// browser bundle); a successful login sets a signed, httpOnly cookie.

export const ADMIN_COOKIE = 'midg3_admin';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || '').trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD || 'midg3-dev-secret';

export function adminConfigured(): boolean {
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);
}

export function adminEmail(): string {
  return ADMIN_EMAIL;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  if (!adminConfigured()) return false;
  const emailOk = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  return emailOk && passOk;
}

// Opaque session token — an HMAC so the cookie can't be forged without SECRET.
export function adminCookieValue(): string {
  return createHmac('sha256', SECRET).update('midg3-admin-session-v1').digest('hex');
}

export function isAdminSession(): boolean {
  if (!adminConfigured()) return false;
  const value = cookies().get(ADMIN_COOKIE)?.value;
  return Boolean(value && safeEqual(value, adminCookieValue()));
}
