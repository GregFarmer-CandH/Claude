"use client";

import { useState } from "react";

const OPTIONS = [
  { value: "OSTEOPATHE", label: "Ostéopathe", description: "Suivi ostéopathique adapté à votre pratique sportive." },
  { value: "DIETETICIENNE", label: "Diététicienne", description: "Accompagnement nutritionnel personnalisé." },
  { value: "MASSAGE_SPORT", label: "Massage sport", description: "Massage sportif chez Natural Spa." },
] as const;

export default function IntervenantPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    if (!selected) return;
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/intervenant/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intervenant: selected }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 207) throw new Error(data.error ?? "Erreur inconnue.");
      setStatus("done");
      setMessage(
        res.status === 207
          ? data.error
          : "Votre choix a été transmis. L'intervenant va vous recontacter directement.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  if (status === "done") {
    return (
      <section>
        <h2 className="mb-4 text-base font-medium">Mon intervenant</h2>
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-1 text-base font-medium">Choisir mon intervenant</h2>
      <p className="mb-4 text-sm text-stone-500">
        Vos coordonnées (nom, prénom, téléphone, email) seront transmises à l&apos;intervenant
        choisi ainsi qu&apos;à l&apos;équipe Farmer CrossFit, afin qu&apos;il/elle vous recontacte.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`rounded-lg border p-4 text-left text-sm transition ${
              selected === opt.value
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 hover:border-stone-400"
            }`}
          >
            <p className="font-medium">{opt.label}</p>
            <p className={`mt-1 text-xs ${selected === opt.value ? "text-stone-300" : "text-stone-500"}`}>
              {opt.description}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={confirm}
        disabled={!selected || status === "loading"}
        className="mt-6 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi en cours..." : "Confirmer mon choix"}
      </button>

      {status === "error" && message && <p className="mt-3 text-sm text-red-600">{message}</p>}
    </section>
  );
}
