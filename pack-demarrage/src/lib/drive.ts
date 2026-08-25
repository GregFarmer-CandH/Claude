import { google, drive_v3 } from "googleapis";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: "pdf" | "video" | "other";
  webViewLink: string | null;
  thumbnailLink: string | null;
  modifiedTime: string | null;
  sizeBytes: string | null;
  /** Nom du sous-dossier d'origine (ex: "Vidéos apprentissage des mouvements"), ou null à la racine. */
  folder: string | null;
};

const FOLDER_MIME = "application/vnd.google-apps.folder";
const MAX_DEPTH = 3;

function classify(mimeType: string): DriveFile["kind"] {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("video/")) return "video";
  return "other";
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Identifiants Google Drive manquants (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY). Voir README.md.",
    );
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

async function listChildren(drive: drive_v3.Drive, folderId: string) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, thumbnailLink, modifiedTime, size)",
    orderBy: "folder,name_natural",
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return res.data.files ?? [];
}

/**
 * Liste les PDF et vidéos du dossier Drive partagé "Pack Démarrage", en
 * parcourant aussi les sous-dossiers (ex: "Vidéos apprentissage des
 * mouvements") jusqu'à MAX_DEPTH niveaux. Le compte de service doit avoir
 * un accès lecteur sur GOOGLE_DRIVE_FOLDER_ID (partage direct du dossier,
 * ou appartenance à un Drive partagé).
 */
export async function listPackDemarrageFiles(): Promise<DriveFile[]> {
  const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!rootFolderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID manquant dans les variables d'environnement.");
  }

  const drive = google.drive({ version: "v3", auth: getAuth() });
  const results: DriveFile[] = [];

  async function walk(folderId: string, folderLabel: string | null, depth: number) {
    const children = await listChildren(drive, folderId);

    for (const f of children) {
      if (f.mimeType === FOLDER_MIME) {
        if (depth < MAX_DEPTH && f.id) {
          await walk(f.id, f.name ?? folderLabel, depth + 1);
        }
        continue;
      }

      const kind = classify(f.mimeType ?? "");
      if (kind === "other") continue;

      results.push({
        id: f.id!,
        name: f.name ?? "Sans titre",
        mimeType: f.mimeType ?? "",
        kind,
        webViewLink: f.webViewLink ?? null,
        thumbnailLink: f.thumbnailLink ?? null,
        modifiedTime: f.modifiedTime ?? null,
        sizeBytes: f.size ?? null,
        folder: folderLabel,
      });
    }
  }

  await walk(rootFolderId, null, 0);
  return results;
}
