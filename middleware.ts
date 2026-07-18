import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Legacy PHP URLs → clean Next.js URLs.
// e.g. /cars/urbania.php → /cars/urbania, /index.php → /, /about.php → /about
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.toLowerCase().endsWith(".php")) {
    let clean = pathname.slice(0, -4);            // drop ".php"
    if (clean.endsWith("/index")) clean = clean.slice(0, -6); // /index → ""
    if (clean === "") clean = "/";
    const url = req.nextUrl.clone();
    url.pathname = clean;
    return NextResponse.redirect(url, 308);       // permanent
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and static asset requests.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
