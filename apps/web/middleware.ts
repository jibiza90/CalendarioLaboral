import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/api", "/_next", "/static", "/fonts", "/images"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));

  // Allow static and landing/login
  if (isPublic) return NextResponse.next();

  const hasAuthCookie = req.cookies.get("cl_auth")?.value === "1";
  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirected", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
