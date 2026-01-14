import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect demo route
 * Checks for authentication cookie before allowing access to /demo
 */

export function middleware(request: NextRequest) {
  // Only protect /demo route
  if (request.nextUrl.pathname === '/demo') {
    const authCookie = request.cookies.get('demo-access');

    // If no auth cookie, redirect to demo-access page
    if (!authCookie || authCookie.value !== 'authenticated') {
      const url = request.nextUrl.clone();
      url.pathname = '/demo-access';
      return NextResponse.redirect(url);
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Only run middleware on /demo route
export const config = {
  matcher: '/demo',
};
