# Pack Démarrage — Farmer CrossFit

Application de remplacement pour le Pack Démarrage (l'ancien outil, Manus, a
perdu les données clients). Deux interfaces :

1. **Interface administrateur** (`/admin`) : gestion des clients (nom,
   prénom, téléphone, email, date d'inscription) avec une fenêtre d'accès de
   3 mois à la plateforme, calculée et affichée automatiquement.
2. **Plateforme utilisateur** (`/portal`) : le client se connecte par lien
   magique (email, sans mot de passe), consulte les PDF/vidéos du dossier
   Drive partagé "Pack Démarrage", et choisit son intervenant (ostéopathe,
   diététicienne, massage sport chez Natural Spa) — ce qui envoie
   automatiquement un email à l'intervenant avec les coordonnées du client,
   en copie à `contact@farmer-crossfit.com`.

À l'expiration des 3 mois : email de rappel 10 jours avant, blocage
automatique de l'accès à la date d'échéance, puis email de confirmation du
blocage. L'admin peut aussi désactiver un accès manuellement à tout moment.

## Stack technique

- Next.js 16 (App Router, TypeScript) + Tailwind CSS
- Prisma (SQLite en dev, Postgres recommandé en prod)
- Sessions par cookies signés (JWT via `jose`) — pas de mot de passe côté
  client, mot de passe admin hashé avec bcrypt
- `googleapis` pour lister les fichiers du dossier Drive partagé
- `nodemailer` pour l'envoi des emails (lien magique, relances, notification
  intervenant)

## Stockage : pourquoi pas "tout" sur Google Drive

Le dossier Drive partagé de farmer-crossfit.com sert **uniquement** de
bibliothèque de fichiers (PDF/vidéos) — c'est un bon usage de Drive. Les
données personnelles des clients (nom, téléphone, email, dates d'accès)
sont stockées dans une vraie base de données (Prisma/SQLite en dev,
Postgres en prod), pas dans des fichiers Drive : cela permet un contrôle
d'accès fiable par client, l'automatisation des relances/blocages à 3 mois,
et évite de rejouer l'incident de perte de données avec un système plus
robuste qu'un simple dossier partagé.

## Démarrage en local

```bash
npm install
cp .env.example .env   # puis renseigner les valeurs, voir ci-dessous
npx prisma migrate dev
npm run seed            # crée le premier compte admin (ADMIN_EMAIL / ADMIN_PASSWORD dans .env)
npm run dev
```

- Espace client : http://localhost:3000/access
- Espace admin : http://localhost:3000/admin/login

Sans configuration Google Drive / SMTP, l'appli démarre et l'admin
fonctionne intégralement (création/édition/désactivation de clients) ; la
liste de fichiers et l'envoi d'emails renverront une erreur explicite tant
que les identifiants ci-dessous ne sont pas renseignés.

## Configuration Google Workspace (farmer-crossfit.com)

### 1. Dossier Drive partagé "Pack Démarrage"

1. Dans le Drive de farmer-crossfit.com, crée (ou réutilise) le dossier qui
   contiendra les PDF et vidéos du Pack Démarrage.
2. Récupère son ID dans l'URL : `https://drive.google.com/drive/folders/<ID>`.
3. Mets cet ID dans `GOOGLE_DRIVE_FOLDER_ID`.

### 2. Compte de service (accès en lecture à ce dossier)

1. Va sur [Google Cloud Console](https://console.cloud.google.com/), crée
   (ou réutilise) un projet.
2. Active l'API **Google Drive API**.
3. Crée un **compte de service** (IAM & Admin → Comptes de service), puis
   une **clé JSON** pour ce compte.
4. Dans le JSON téléchargé, récupère `client_email` et `private_key` →
   `GOOGLE_SERVICE_ACCOUNT_EMAIL` et `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
   (garder les `\n` tels quels, ou les remplacer par de vrais retours à la
   ligne).
5. **Partage le dossier Drive** (étape 1) avec l'adresse
   `GOOGLE_SERVICE_ACCOUNT_EMAIL`, en lecteur. C'est cette étape qui donne
   à l'application l'accès au dossier — sans elle, la liste de fichiers
   renverra une erreur.

### 3. Envoi d'emails

Deux options :

- **SMTP Google Workspace** (simple, gratuit) : dans le compte
  `contact@farmer-crossfit.com`, active la validation en 2 étapes puis crée
  un **mot de passe d'application** (myaccount.google.com → Sécurité →
  Mots de passe des applications). Utilise-le comme `SMTP_PASSWORD` avec
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=contact@farmer-crossfit.com`.
- **Service transactionnel** (Brevo, Resend...) : meilleure délivrabilité à
  grande échelle, il suffit de renseigner leurs identifiants SMTP à la
  place.

Renseigne aussi les adresses email des intervenants
(`INTERVENANT_EMAIL_OSTEOPATHE`, `INTERVENANT_EMAIL_DIETETICIENNE`,
`INTERVENANT_EMAIL_MASSAGE_SPORT`) et `CONTACT_EMAIL_CC` (généralement
`contact@farmer-crossfit.com`).

## Variables d'environnement

Voir `.env.example` pour la liste complète et les commentaires. Les plus
importantes :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion base de données |
| `AUTH_SECRET` | Signature des sessions (générer avec `openssl rand -base64 48`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Premier compte admin (via `npm run seed`) |
| `SMTP_*`, `EMAIL_FROM` | Envoi d'emails |
| `INTERVENANT_EMAIL_*` | Destinataires des notifications de sélection |
| `GOOGLE_SERVICE_ACCOUNT_*`, `GOOGLE_DRIVE_FOLDER_ID` | Accès au dossier Drive |
| `ACCESS_PERIOD_DAYS` | Durée d'accès (90 jours par défaut) |
| `REMINDER_DAYS_BEFORE_EXPIRY` | Délai du rappel avant expiration (10 jours par défaut) |
| `CRON_SECRET` | Protège l'appel de `/api/cron/access-check` |

## Déploiement

Recommandé : [Vercel](https://vercel.com) (créé par les auteurs de
Next.js, déploiement automatique depuis GitHub).

1. Passer `prisma/schema.prisma` sur `provider = "postgresql"` et utiliser
   une base managée (ex. [Neon](https://neon.tech) ou
   [Supabase](https://supabase.com)) — le plan gratuit suffit largement
   pour "quelques milliers de clients".
2. Renseigner toutes les variables d'environnement ci-dessus dans les
   réglages du projet Vercel.
3. `npx prisma migrate deploy` (automatisable dans le build command :
   `prisma migrate deploy && next build`).
4. Programmer l'appel quotidien de `/api/cron/access-check` avec
   [Vercel Cron](https://vercel.com/docs/cron-jobs) (fichier `vercel.json`
   fourni) — Vercel envoie automatiquement l'en-tête
   `Authorization: Bearer $CRON_SECRET`.

## Ajouter un deuxième compte admin

Pas encore d'interface dédiée (volontairement, pour rester simple au
démarrage). En attendant, deux options :
- relancer `npm run seed` avec d'autres `ADMIN_EMAIL`/`ADMIN_PASSWORD` dans
  l'environnement ;
- ou passer par `npx prisma studio` pour ajouter une ligne dans la table
  `AdminUser` (le mot de passe doit être haché avec bcrypt, coût 12).

## RGPD

- Consentement explicite recueilli à la création de chaque client (case à
  cocher obligatoire côté admin), avec horodatage et copie du texte de
  consentement conservés sur chaque fiche client (`consentGivenAt`,
  `consentTextSnapshot` dans `prisma/schema.prisma`), pour garder une
  preuve même si le texte évolue plus tard.
- Le texte affiché est dans `src/lib/legal.ts` — à faire relire/valider
  juridiquement avant mise en production.
- Ceci ne remplace pas un registre de traitement RGPD ni une politique de
  confidentialité publiée ; à mettre en place séparément.
- **Important, sans rapport avec cette reconstruction** : la perte des
  données clients côté Manus peut constituer une violation de données au
  sens du RGPD, avec une possible obligation de notification à la CNIL
  (sous 72h) et aux personnes concernées si le risque est élevé — à faire
  évaluer indépendamment de ce chantier technique.

## Limites connues / suite possible

- Testé en local sans identifiants Google Drive / SMTP réels dans cet
  environnement : la logique (auth, accès 3 mois, CRUD clients, relances)
  est vérifiée de bout en bout, mais l'intégration Drive et l'envoi
  d'emails doivent être validés avec de vrais identifiants avant mise en
  production.
- Pas de recherche/filtre sur la liste des clients admin (facile à ajouter
  si le volume le justifie).
- Pas de renouvellement en libre-service par le client à l'expiration (le
  parcours actuel est : email d'expiration → contact manuel de l'équipe).
