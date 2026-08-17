import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isValidToken } from '@/lib/adminAuth';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // /admin itself renders its own login form, so let it through.
  if (path === '/admin' || path === '/admin/login') return NextResponse.next();

  if (path.startsWith('/admin')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!isValidToken(token)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
