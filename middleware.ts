import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function middleware(request: NextRequest) {
  // When the Supabase backend isn't configured there's no session to refresh,
  // so the middleware is a pure no-op. We avoid importing the Supabase client
  // into the Edge Function at all in that case, keeping it tiny and robust.
  if (!isSupabaseConfigured) {
    return NextResponse.next();
  }
  const { updateSession } = await import('@/lib/supabase/middleware');
  return updateSession(request);
}

export const config = {
  matcher: [
    // Run on everything except static assets and images.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
