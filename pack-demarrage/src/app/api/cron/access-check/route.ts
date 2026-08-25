import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { REMINDER_DAYS_BEFORE_EXPIRY, getClientStatus } from "@/lib/access";
import { sendReminderEmail, sendExpiredEmail } from "@/lib/email";

/**
 * À appeler une fois par jour (Vercel Cron, cron-job.org, etc.) :
 * - envoie un rappel J-10 avant expiration (une seule fois par client)
 * - envoie un email au moment du blocage (l'accès est déjà coupé
 *   automatiquement dès que la date est dépassée, voir lib/access.ts)
 *
 * Protégé par le header `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const now = new Date();

  const candidates = await prisma.client.findMany({
    where: {
      manuallyDisabledAt: null,
      OR: [{ reminderSentAt: null }, { expiredEmailSentAt: null }],
    },
  });

  let remindersSent = 0;
  let expiredEmailsSent = 0;

  for (const client of candidates) {
    const status = getClientStatus(client, now);

    if (status === "EXPIRING_SOON" && !client.reminderSentAt) {
      const daysLeft = Math.max(
        1,
        Math.ceil((client.accessEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );
      await sendReminderEmail(client.email, client.firstName, daysLeft, `${appUrl}/access`);
      await prisma.client.update({ where: { id: client.id }, data: { reminderSentAt: now } });
      remindersSent++;
    }

    if (status === "EXPIRED" && !client.expiredEmailSentAt) {
      await sendExpiredEmail(client.email, client.firstName);
      await prisma.client.update({ where: { id: client.id }, data: { expiredEmailSentAt: now } });
      expiredEmailsSent++;
    }
  }

  const reminderThresholdDays = REMINDER_DAYS_BEFORE_EXPIRY;
  return NextResponse.json({ ok: true, remindersSent, expiredEmailsSent, reminderThresholdDays });
}
