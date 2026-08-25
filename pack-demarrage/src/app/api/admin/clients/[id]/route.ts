import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { getClientStatus } from "@/lib/access";

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  notes: z.string().optional().nullable(),
  accessEndsAt: z.coerce.date().optional(),
  disabled: z.boolean().optional(),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { intervenantSelections: { orderBy: { selectedAt: "desc" } } },
  });
  if (!client) return NextResponse.json({ error: "Client introuvable." }, { status: 404 });

  return NextResponse.json({ client: { ...client, status: getClientStatus(client) } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { disabled, ...rest } = parsed.data;

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...rest,
      ...(disabled === true ? { manuallyDisabledAt: new Date() } : {}),
      ...(disabled === false ? { manuallyDisabledAt: null } : {}),
    },
  });

  return NextResponse.json({ client: { ...client, status: getClientStatus(client) } });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
