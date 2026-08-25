"use client";

import { useState, type FormEvent } from "react";

export function AccessRequestForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
      setStatus("sent");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Erreur inconnue.");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-6 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="vous@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi en cours..." : "Recevoir mon lien de connexion"}
      </button>
      {status === "error" && message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
