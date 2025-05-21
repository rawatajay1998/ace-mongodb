import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  // If the request is for /home, redirect to the root (/) with 301 permanent redirect
  if (pathname === "/home") {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/dashboard/:path*"], // protect routes
};
