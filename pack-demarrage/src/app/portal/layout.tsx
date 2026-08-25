import { redirect } from "next/navigation";
import Link from "next/link";
import { getClientSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasPortalAccess, getClientStatus, STATUS_LABELS } from "@/lib/access";
import { LogoutButton } from "./logout-button";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession();
  if (!session) redirect("/access");

  const client = await prisma.client.findUnique({ where: { id: session.clientId } });
  if (!client || !hasPortalAccess(client)) redirect("/access?error=expired_access");

  const status = getClientStatus(client);
  const daysLeft = Math.max(
    0,
    Math.ceil((client.accessEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-sm text-stone-500">Pack Démarrage Farmer CrossFit</p>
          <h1 className="text-lg font-semibold tracking-tight">
            Bonjour {client.firstName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            <Link href="/portal" className="text-stone-600 hover:text-stone-900">
              Fichiers
            </Link>
            <Link href="/portal/intervenant" className="text-stone-600 hover:text-stone-900">
              Mon intervenant
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>

      {status === "EXPIRING_SOON" && (
        <p className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Votre accès se termine dans {daysLeft} jour{daysLeft > 1 ? "s" : ""} ({STATUS_LABELS[status]}).
        </p>
      )}

      {children}
    </div>
  );
}
