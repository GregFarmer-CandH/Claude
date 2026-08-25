import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });
  return transporter;
}

type SendArgs = {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, cc, subject, html, text }: SendArgs) {
  const from = process.env.EMAIL_FROM ?? "Farmer CrossFit <contact@farmer-crossfit.com>";
  await getTransporter().sendMail({ from, to, cc, subject, html, text });
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="fr">
  <body style="font-family: system-ui, -apple-system, sans-serif; background:#f5f5f4; padding:24px; color:#1c1917;">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
      <h1 style="font-size:18px;margin:0 0 16px;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top:32px;font-size:12px;color:#78716c;">Farmer CrossFit — Pack Démarrage</p>
    </div>
  </body>
</html>`;
}

export async function sendMagicLinkEmail(to: string, firstName: string, link: string) {
  const subject = "Votre accès au Pack Démarrage Farmer CrossFit";
  const html = layout(
    subject,
    `<p>Bonjour ${firstName},</p>
     <p>Cliquez sur le lien ci-dessous pour accéder à votre plateforme Pack Démarrage (valable 15 minutes) :</p>
     <p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Accéder à mon espace</a></p>
     <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>`,
  );
  const text = `Bonjour ${firstName},\n\nAccédez à votre plateforme Pack Démarrage : ${link}\n(lien valable 15 minutes)`;
  await sendEmail({ to, subject, html, text });
}

export async function sendReminderEmail(to: string, firstName: string, daysLeft: number, link: string) {
  const subject = `Votre accès au Pack Démarrage se termine dans ${daysLeft} jours`;
  const html = layout(
    subject,
    `<p>Bonjour ${firstName},</p>
     <p>Votre accès à la plateforme Pack Démarrage Farmer CrossFit se termine dans <strong>${daysLeft} jours</strong>.</p>
     <p>Si ce n'est pas encore fait, pensez à choisir votre intervenant (ostéopathe, diététicienne ou massage sport) depuis votre espace :</p>
     <p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Accéder à mon espace</a></p>`,
  );
  const text = `Bonjour ${firstName},\n\nVotre accès au Pack Démarrage se termine dans ${daysLeft} jours. Accédez à votre espace : ${link}`;
  await sendEmail({ to, subject, html, text });
}

export async function sendExpiredEmail(to: string, firstName: string) {
  const subject = "Votre accès au Pack Démarrage est arrivé à son terme";
  const html = layout(
    subject,
    `<p>Bonjour ${firstName},</p>
     <p>Votre période d'accès de 3 mois à la plateforme Pack Démarrage Farmer CrossFit est terminée.</p>
     <p>Pour toute question, contactez-nous à contact@farmer-crossfit.com.</p>`,
  );
  const text = `Bonjour ${firstName},\n\nVotre accès au Pack Démarrage est terminé. Contact : contact@farmer-crossfit.com`;
  await sendEmail({ to, subject, html, text });
}

const INTERVENANT_LABELS: Record<string, string> = {
  OSTEOPATHE: "Ostéopathe",
  DIETETICIENNE: "Diététicienne",
  MASSAGE_SPORT: "Massage sport",
};

const INTERVENANT_EMAIL_ENV: Record<string, string | undefined> = {
  OSTEOPATHE: process.env.INTERVENANT_EMAIL_OSTEOPATHE,
  DIETETICIENNE: process.env.INTERVENANT_EMAIL_DIETETICIENNE,
  MASSAGE_SPORT: process.env.INTERVENANT_EMAIL_MASSAGE_SPORT,
};

export function getIntervenantEmail(intervenant: string): string | undefined {
  return INTERVENANT_EMAIL_ENV[intervenant];
}

export async function sendIntervenantNotification(params: {
  intervenant: string;
  client: { firstName: string; lastName: string; phone: string; email: string };
}) {
  const { intervenant, client } = params;
  const to = getIntervenantEmail(intervenant);
  if (!to) {
    throw new Error(`Aucune adresse email configurée pour l'intervenant ${intervenant}`);
  }
  const cc = process.env.CONTACT_EMAIL_CC || undefined;
  const label = INTERVENANT_LABELS[intervenant] ?? intervenant;

  const subject = `Nouveau client Pack Démarrage — ${client.firstName} ${client.lastName}`;
  const html = layout(
    subject,
    `<p>Bonjour,</p>
     <p>Un client du Pack Démarrage Farmer CrossFit a choisi <strong>${label}</strong> comme intervenant. Voici ses coordonnées :</p>
     <ul>
       <li><strong>Nom :</strong> ${client.lastName}</li>
       <li><strong>Prénom :</strong> ${client.firstName}</li>
       <li><strong>Téléphone :</strong> ${client.phone}</li>
       <li><strong>Email :</strong> ${client.email}</li>
     </ul>
     <p>Merci de le/la recontacter pour organiser un rendez-vous.</p>`,
  );
  const text = `Nouveau client Pack Démarrage pour ${label} :\nNom : ${client.lastName}\nPrénom : ${client.firstName}\nTéléphone : ${client.phone}\nEmail : ${client.email}`;

  await sendEmail({ to, cc, subject, html, text });
}
