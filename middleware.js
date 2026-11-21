import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Light-weight guard: only checks that a session cookie exists, so a logged-in user is never
// bounced to /sign-in on reload. Real session validation happens in the dashboard layout + API.
export function middleware(request) {
  const cookie = getSessionCookie(request);
  if (!cookie) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
