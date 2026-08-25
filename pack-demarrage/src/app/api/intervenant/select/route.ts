import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/auth";
import { hasPortalAccess } from "@/lib/access";
import { sendIntervenantNotification } from "@/lib/email";

const schema = z.object({
  intervenant: z.enum(["OSTEOPATHE", "DIETETICIENNE", "MASSAGE_SPORT"]),
});

export async function POST(request: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const client = await prisma.client.findUnique({ where: { id: session.clientId } });
  if (!client || !hasPortalAccess(client)) {
    return NextResponse.json({ error: "Accès expiré." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Intervenant invalide." }, { status: 400 });
  }

  const selection = await prisma.intervenantSelection.create({
    data: { clientId: client.id, intervenant: parsed.data.intervenant },
  });

  try {
    await sendIntervenantNotification({
      intervenant: parsed.data.intervenant,
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
      },
    });
    await prisma.intervenantSelection.update({
      where: { id: selection.id },
      data: { notifiedAt: new Date() },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("Erreur envoi email intervenant:", message);
    await prisma.intervenantSelection.update({
      where: { id: selection.id },
      data: { notifyError: message },
    });
    return NextResponse.json(
      { error: "Votre choix a été enregistré mais l'email n'a pas pu être envoyé. L'équipe Farmer CrossFit a été prévenue." },
      { status: 207 },
    );
  }

  return NextResponse.json({ ok: true });
}
