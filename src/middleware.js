// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const isDashboard = url.pathname.startsWith('/dashboard');

  // Get your auth token or session cookie
  const token = request.cookies.get('token')?.value;

  // If trying to access dashboard and no token → redirect to home/login
  // if (isDashboard && !token) {
  //   return NextResponse.redirect(new URL(process.env.NEXT_PUBLIC_APP_URL, request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect /dashboard and all subroutes
};
