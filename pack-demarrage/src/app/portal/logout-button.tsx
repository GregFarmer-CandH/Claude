"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/access");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      className="text-sm text-stone-500 hover:text-stone-900"
      type="button"
    >
      Déconnexion
    </button>
  );
}
