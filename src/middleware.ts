import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internal and static assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Public routes – login page and root
  const publicRoutes = ['/admin/login', '/'];
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Paths that require admin authentication
  const protectedRoutes = [
    '/admin', // any admin sub‑path except login
    '/complete-setup',
    '/installation-failed',
  ];

  const needsAuth = protectedRoutes.some((p) => pathname.startsWith(p));

  if (needsAuth) {
    const authCookie = request.cookies.get('admin-auth');
    if (authCookie?.value === 'true') {
      return NextResponse.next();
    }
    // Not authenticated – redirect to login with original destination
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Default – allow request
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/complete-setup', '/installation-failed'],
};
