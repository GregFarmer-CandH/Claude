"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONSENT_TEXT } from "@/lib/legal";

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", notes: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Le consentement RGPD est obligatoire pour créer un accès client.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consentGiven: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      router.push(`/admin/clients/${data.client.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setLoading(false);
    }
  }

  return (
    <section className="max-w-lg">
      <h2 className="mb-1 text-base font-medium">Nouveau client</h2>
      <p className="mb-6 text-sm text-stone-500">
        L&apos;accès à la plateforme démarre à la création et dure 3 mois.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Prénom"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <input
            required
            placeholder="Nom"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <input
          required
          type="tel"
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <textarea
          placeholder="Notes (facultatif)"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />

        <label className="mt-2 flex items-start gap-2 rounded-lg bg-stone-100 p-3 text-xs text-stone-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>{CONSENT_TEXT}</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le client"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  );
}
