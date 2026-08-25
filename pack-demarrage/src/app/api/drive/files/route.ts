import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/auth";
import { hasPortalAccess } from "@/lib/access";
import { listPackDemarrageFiles } from "@/lib/drive";

export async function GET() {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const client = await prisma.client.findUnique({ where: { id: session.clientId } });
  if (!client || !hasPortalAccess(client)) {
    return NextResponse.json({ error: "Accès expiré." }, { status: 403 });
  }

  try {
    const files = await listPackDemarrageFiles();
    return NextResponse.json({ files });
  } catch (err) {
    console.error("Erreur Google Drive:", err);
    return NextResponse.json(
      { error: "Impossible de charger les fichiers pour le moment. Réessayez plus tard." },
      { status: 502 },
    );
  }
}
