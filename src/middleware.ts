import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/signup"];

  const { pathname } = req.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
