import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/session";

// Gate every route behind the shared-password session cookie. /api/* gets a
// 401 (the client already treats a failed /api/ledger call as "local-only"),
// everything else redirects to /login. sw.js/manifest/icon stay public so
// the PWA shell and offline install prompt keep working for a logged-out
// browser — neither exposes any ledger data.
export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (isValidSession(cookie)) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|sw.js|icon.svg).*)",
  ],
};
