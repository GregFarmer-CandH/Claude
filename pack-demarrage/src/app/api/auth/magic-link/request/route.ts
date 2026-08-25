import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateToken, hashToken } from "@/lib/tokens";
import { sendMagicLinkEmail } from "@/lib/email";
import { hasPortalAccess } from "@/lib/access";

const schema = z.object({ email: z.string().email() });

const GENERIC_MESSAGE =
  "Si cet email correspond à un compte actif, un lien de connexion vient de vous être envoyé.";

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const { email } = parsed.data;
  const client = await prisma.client.findUnique({ where: { email } });

  // Réponse volontairement neutre pour ne pas révéler si l'email existe.
  if (!client || !hasPortalAccess(client)) {
    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { clientId: client.id, tokenHash: hashToken(token), expiresAt },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/api/auth/magic-link/verify?token=${token}`;

  try {
    await sendMagicLinkEmail(client.email, client.firstName, link);
  } catch (err) {
    console.error("Erreur envoi email lien magique:", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email pour le moment. Réessayez dans quelques minutes." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
}
