'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE,
  adminCookieValue,
  verifyAdminCredentials,
} from '@/lib/admin';

// Server action: owner sign-in with the fixed credentials. On success sets a
// signed, httpOnly cookie and redirects into the admin. On failure redirects
// back to /midge with an error flag.
export async function adminLogin(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/dashboard') || '/dashboard';

  if (!verifyAdminCredentials(email, password)) {
    redirect(`/midge?e=1&next=${encodeURIComponent(next)}`);
  }

  cookies().set(ADMIN_COOKIE, adminCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(next.startsWith('/') ? next : '/dashboard');
}

export async function adminLogout() {
  cookies().delete(ADMIN_COOKIE);
  redirect('/');
}
