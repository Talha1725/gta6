// middleware.ts - Fixed for /admin access
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin/dashboard") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow access based on role
    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
