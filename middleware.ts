// middleware.ts - Fixed for /admin access
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PATH = '/admin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes, static files
  if (
    pathname.startsWith("/api/") || // All API routes
    pathname.startsWith("/_next/") || // Next.js files
    pathname.includes(".") || // Files with extensions
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Public routes that don't need authentication
  const publicRoutes = [
    "/login",
    "/signup",
    "/",
    "/payment-success",
    "/subscriptions",
  ];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Only check for /admin routes
  if (pathname.startsWith(ADMIN_PATH)) {
    try {
      const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If no token or not an admin, redirect to home
      if (!token || token.role !== 'admin') {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Allow access based on role
      return NextResponse.next();
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
