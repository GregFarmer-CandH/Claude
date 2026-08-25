import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientStatus, STATUS_LABELS, type ComputedStatus } from "@/lib/access";

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

export default async function AdminClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { registeredAt: "desc" },
    include: { intervenantSelections: { orderBy: { selectedAt: "desc" }, take: 1 } },
  });

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
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  Aucun client pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
