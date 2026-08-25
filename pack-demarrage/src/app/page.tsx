import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pack Démarrage</h1>
        <p className="mt-1 text-stone-500">Farmer CrossFit</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/access"
          className="rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700"
        >
          Espace client
        </Link>
        <Link
          href="/admin/login"
          className="rounded-lg border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Espace administrateur
        </Link>
      </div>
    </main>
  );
}
