import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE, CLIENT_COOKIE } from "@/lib/auth";

async function isValidSession(token: string | undefined, expectedKind: string): Promise<boolean> {
  if (!token) return false;
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(authSecret));
    return payload.kind === expectedKind;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await isValidSession(token, "admin"))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/portal")) {
    const token = request.cookies.get(CLIENT_COOKIE)?.value;
    if (!(await isValidSession(token, "client"))) {
      return NextResponse.redirect(new URL("/access", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
