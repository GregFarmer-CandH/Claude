import type { Client } from "@prisma/client";

export const ACCESS_PERIOD_DAYS = Number(process.env.ACCESS_PERIOD_DAYS ?? 90);
export const REMINDER_DAYS_BEFORE_EXPIRY = Number(
  process.env.REMINDER_DAYS_BEFORE_EXPIRY ?? 10,
);

export type ComputedStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "DISABLED";

/** Date de fin d'accès par défaut à partir d'une date d'inscription. */
export function computeAccessEndsAt(registeredAt: Date): Date {
  const end = new Date(registeredAt);
  end.setDate(end.getDate() + ACCESS_PERIOD_DAYS);
  return end;
}

/**
 * Statut d'accès calculé à la volée. La coupure manuelle (admin) est
 * toujours prioritaire sur les dates.
 */
export function getClientStatus(
  client: Pick<Client, "accessEndsAt" | "manuallyDisabledAt">,
  now: Date = new Date(),
): ComputedStatus {
  if (client.manuallyDisabledAt) return "DISABLED";

  const msRemaining = client.accessEndsAt.getTime() - now.getTime();
  if (msRemaining <= 0) return "EXPIRED";

  const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);
  if (daysRemaining <= REMINDER_DAYS_BEFORE_EXPIRY) return "EXPIRING_SOON";

  return "ACTIVE";
}

export function hasPortalAccess(
  client: Pick<Client, "accessEndsAt" | "manuallyDisabledAt">,
  now: Date = new Date(),
): boolean {
  const status = getClientStatus(client, now);
  return status === "ACTIVE" || status === "EXPIRING_SOON";
}

export const STATUS_LABELS: Record<ComputedStatus, string> = {
  ACTIVE: "Actif",
  EXPIRING_SOON: "Expire bientôt",
  EXPIRED: "Expiré",
  DISABLED: "Désactivé",
};
