import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientStatus, STATUS_LABELS } from "@/lib/access";
import { ClientEditForm } from "./client-edit-form";

const INTERVENANT_LABELS: Record<string, string> = {
  OSTEOPATHE: "Ostéopathe",
  DIETETICIENNE: "Diététicienne",
  MASSAGE_SPORT: "Massage sport",
};

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { intervenantSelections: { orderBy: { selectedAt: "desc" } } },
  });
  if (!client) notFound();

  const status = getClientStatus(client);

  return (
    <section className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium">
            {client.firstName} {client.lastName}
          </h2>
          <p className="text-sm text-stone-500">
            Inscrit le {client.registeredAt.toLocaleDateString("fr-FR")} — statut : {STATUS_LABELS[status]}
          </p>
        </div>
      </div>

      <ClientEditForm client={client} />

      <div className="mt-8">
        <h3 className="mb-2 text-sm font-medium">Historique intervenant</h3>
        {client.intervenantSelections.length === 0 && (
          <p className="text-sm text-stone-500">Aucune sélection pour le moment.</p>
        )}
        <ul className="flex flex-col gap-1 text-sm text-stone-600">
          {client.intervenantSelections.map((s) => (
            <li key={s.id}>
              {INTERVENANT_LABELS[s.intervenant]} — {s.selectedAt.toLocaleDateString("fr-FR")}{" "}
              {s.notifiedAt ? "(email envoyé)" : s.notifyError ? "(échec envoi email)" : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
