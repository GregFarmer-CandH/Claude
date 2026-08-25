import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { computeAccessEndsAt, getClientStatus } from "@/lib/access";
import { CONSENT_TEXT, CONSENT_TEXT_VERSION } from "@/lib/legal";

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  consentGiven: z.literal(true),
  notes: z.string().optional(),
});

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const clients = await prisma.client.findMany({
    orderBy: { registeredAt: "desc" },
    include: { intervenantSelections: { orderBy: { selectedAt: "desc" }, take: 1 } },
  });

  const now = new Date();
  return NextResponse.json({
    clients: clients.map((c) => ({
      ...c,
      status: getClientStatus(c, now),
    })),
  });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { firstName, lastName, phone, email, notes } = parsed.data;

  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un client avec cet email existe déjà." }, { status: 409 });
  }

  const registeredAt = new Date();
  const client = await prisma.client.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      notes,
      registeredAt,
      accessEndsAt: computeAccessEndsAt(registeredAt),
      consentGivenAt: registeredAt,
      consentTextSnapshot: `[v${CONSENT_TEXT_VERSION}] ${CONSENT_TEXT}`,
      createdByAdminId: admin.adminId,
    },
  });

  return NextResponse.json({ client }, { status: 201 });
}
