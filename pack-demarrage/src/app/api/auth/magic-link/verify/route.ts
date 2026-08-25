import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/tokens";
import { createClientSession } from "@/lib/auth";
import { hasPortalAccess } from "@/lib/access";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(new URL("/access?error=missing_token", appUrl));
  }

  const record = await prisma.magicLinkToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { client: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.redirect(new URL("/access?error=invalid_token", appUrl));
  }

  if (!hasPortalAccess(record.client)) {
    return NextResponse.redirect(new URL("/access?error=expired_access", appUrl));
  }

  await prisma.magicLinkToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  await createClientSession(record.client.id, record.client.email);

  return NextResponse.redirect(new URL("/portal", appUrl));
}
