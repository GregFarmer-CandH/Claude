"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type ClientProp = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string | null;
  accessEndsAt: Date;
  manuallyDisabledAt: Date | null;
};

export function ClientEditForm({ client }: { client: ClientProp }) {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    email: client.email,
    notes: client.notes ?? "",
    accessEndsAt: client.accessEndsAt.toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isDisabled = !!client.manuallyDisabledAt;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function patch(body: Record<string, unknown>) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await patch({ ...form, accessEndsAt: new Date(form.accessEndsAt).toISOString() });
  }

  async function onDelete() {
    if (!confirm("Supprimer définitivement ce client et ses données ? Cette action est irréversible.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/clients/${client.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setLoading(false);
      setError("Suppression impossible.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
          <input
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <input
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <input
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <label className="text-xs text-stone-500">
          Fin d&apos;accès
          <input
            type="date"
            value={form.accessEndsAt}
            onChange={(e) => set("accessEndsAt", e.target.value)}
            className="mt-1 block rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={2}
          placeholder="Notes"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          Enregistrer
        </button>
      </form>

      <div className="flex flex-wrap gap-3 border-t border-stone-200 pt-4">
        <button
          type="button"
          disabled={loading}
          onClick={() => patch({ disabled: !isDisabled })}
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 disabled:opacity-50"
        >
          {isDisabled ? "Réactiver l'accès" : "Désactiver l'accès"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Supprimer le client
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
