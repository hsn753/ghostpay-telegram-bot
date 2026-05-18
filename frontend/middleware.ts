import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow login page
  if (pathname === '/support/login') {
    return NextResponse.next();
  }
  
  // Protected routes that require authentication
  const protectedRoutes = ['/support', '/agent', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if user is trying to access a protected route
  if (isProtectedRoute) {
    // Check for session token in cookies or localStorage (via header)
    const sessionToken = request.cookies.get('session_token')?.value;
    
    // If no session token, redirect to login
    if (!sessionToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/support/login';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/support/:path*', '/agent/:path*', '/admin/:path*'],
};
