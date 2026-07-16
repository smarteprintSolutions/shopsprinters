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
  if (pathname === '/' || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // Paths that require admin authentication
  const protectedRoutes = [
    '/admin',
    '/complete-setup',
    '/installation-failed',
  ];

  const needsAuth = protectedRoutes.some((p) => pathname.startsWith(p));

  if (needsAuth) {
    const authToken = request.cookies.get('auth_token');
    let isAdmin = false;

    if (authToken?.value) {
      try {
        const base64Url = authToken.value.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payloadStr = atob(base64);
          const payload = JSON.parse(payloadStr);
          if (payload.isAdmin === true) {
            isAdmin = true;
          }
        }
      } catch (e) {
        console.error('Error decoding auth_token in middleware:', e);
      }
    }

    if (!isAdmin) {
      // Not authenticated or not an admin – redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clean up the invalid admin-auth cookie if it exists
      response.cookies.delete('admin-auth');
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
