import { Suspense } from "react";
import { AccessRequestForm } from "./access-request-form";

const ERROR_MESSAGES: Record<string, string> = {
  missing_token: "Lien invalide.",
  invalid_token: "Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau ci-dessous.",
  expired_access: "Votre période d'accès de 3 mois est terminée.",
};

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? "Une erreur est survenue." : null;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Accéder à mon espace</h1>
      <p className="mt-1 text-sm text-stone-500">
        Pack Démarrage Farmer CrossFit — saisissez l&apos;email utilisé lors de votre inscription,
        vous recevrez un lien de connexion valable 15 minutes.
      </p>

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {errorMessage}
        </p>
      )}

      <Suspense>
        <AccessRequestForm />
      </Suspense>
    </main>
  );
}
