import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientStatus, STATUS_LABELS, type ComputedStatus } from "@/lib/access";
import type { Client, IntervenantSelection } from "@prisma/client";

const STATUS_STYLES: Record<ComputedStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  EXPIRING_SOON: "bg-amber-100 text-amber-800",
  EXPIRED: "bg-stone-200 text-stone-600",
  DISABLED: "bg-red-100 text-red-700",
};

const INTERVENANT_LABELS: Record<string, string> = {
  OSTEOPATHE: "Ostéopathe",
  DIETETICIENNE: "Diététicienne",
  MASSAGE_SPORT: "Massage sport",
};

type ClientWithIntervenant = Client & { intervenantSelections: IntervenantSelection[] };

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function groupByMonth(clients: ClientWithIntervenant[]) {
  const groups = new Map<string, { label: string; anchor: string; clients: ClientWithIntervenant[] }>();
  for (const client of clients) {
    const key = monthKey(client.registeredAt);
    if (!groups.has(key)) {
      groups.set(key, { label: monthLabel(client.registeredAt), anchor: `mois-${key}`, clients: [] });
    }
    groups.get(key)!.clients.push(client);
  }
  // clients arrive already sorted by registeredAt desc, so Map insertion order
  // (and therefore this array) is already most-recent-month-first.
  return Array.from(groups.values());
}

function ClientsTable({ clients }: { clients: ClientWithIntervenant[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-stone-100 text-xs uppercase tracking-wide text-stone-500">
          <tr>
            <th className="px-4 py-2 font-medium">Client</th>
            <th className="px-4 py-2 font-medium">Contact</th>
            <th className="px-4 py-2 font-medium">Inscription</th>
            <th className="px-4 py-2 font-medium">Fin d&apos;accès</th>
            <th className="px-4 py-2 font-medium">Intervenant</th>
            <th className="px-4 py-2 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {clients.map((client) => {
            const status = getClientStatus(client);
            const lastIntervenant = client.intervenantSelections[0];
            return (
              <tr key={client.id} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${client.id}`} className="font-medium hover:underline">
                    {client.firstName} {client.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  <div>{client.email}</div>
                  <div className="text-xs text-stone-400">{client.phone}</div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {client.registeredAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {client.accessEndsAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {lastIntervenant ? INTERVENANT_LABELS[lastIntervenant.intervenant] : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { registeredAt: "desc" },
    include: { intervenantSelections: { orderBy: { selectedAt: "desc" }, take: 1 } },
  });

  const groups = groupByMonth(clients);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium">
          Clients <span className="text-stone-400">({clients.length})</span>
        </h2>
        <Link
          href="/admin/clients/new"
          className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Nouveau client
        </Link>
      </div>

      {groups.length > 1 && (
        <nav className="mb-6 flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={group.anchor}
              href={`#${group.anchor}`}
              className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:border-stone-400 hover:text-stone-900"
            >
              {group.label} <span className="text-stone-400">({group.clients.length})</span>
            </a>
          ))}
        </nav>
      )}

      {groups.length === 0 && (
        <div className="rounded-lg border border-stone-200 px-4 py-8 text-center text-stone-400">
          Aucun client pour le moment.
        </div>
      )}

      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <div key={group.anchor} id={group.anchor} className="scroll-mt-4">
            <h3 className="mb-2 flex items-baseline gap-2 text-sm font-medium text-stone-700">
              {group.label}
              <span className="text-xs font-normal text-stone-400">
                {group.clients.length} adhérent{group.clients.length > 1 ? "s" : ""}
              </span>
            </h3>
            <ClientsTable clients={group.clients} />
          </div>
        ))}
      </div>
    </section>
  );
}
