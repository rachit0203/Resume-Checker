import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow auth routes to pass through
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // For all other routes, they will be protected by client-side auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
