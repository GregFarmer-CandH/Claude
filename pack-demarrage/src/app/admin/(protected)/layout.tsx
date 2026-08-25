import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminLogoutButton } from "./logout-button";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3">
          <Image
            src="/icon-192.png"
            alt=""
            width={36}
            height={36}
            className="rounded-md"
          />
          <div>
            <p className="text-sm text-stone-500">Administration</p>
            <h1 className="text-lg font-semibold tracking-tight">Pack Démarrage</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-stone-600 hover:text-stone-900">
              Clients
            </Link>
            <Link href="/admin/clients/new" className="text-stone-600 hover:text-stone-900">
              Nouveau client
            </Link>
          </nav>
          <AdminLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
