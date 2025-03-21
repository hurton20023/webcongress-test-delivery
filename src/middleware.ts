import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
    headers: { cookie: request.headers.get("cookie") || "" },
  });

  const session = await sessionRes?.json();


  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/users") && !session.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
};
