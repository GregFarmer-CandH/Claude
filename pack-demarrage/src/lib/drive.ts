import { google } from "googleapis";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  kind: "pdf" | "video" | "other";
  webViewLink: string | null;
  thumbnailLink: string | null;
  modifiedTime: string | null;
  sizeBytes: string | null;
};

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

/**
 * Liste les fichiers PDF et vidéo du dossier Drive partagé "Pack Démarrage".
 * Le compte de service doit avoir un accès lecteur sur GOOGLE_DRIVE_FOLDER_ID
 * (partage direct du dossier, ou appartenance à un Drive partagé).
 */
export async function listPackDemarrageFiles(): Promise<DriveFile[]> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID manquant dans les variables d'environnement.");
  }

  const drive = google.drive({ version: "v3", auth: getAuth() });

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and (mimeType = 'application/pdf' or mimeType contains 'video/')`,
    fields: "files(id, name, mimeType, webViewLink, thumbnailLink, modifiedTime, size)",
    orderBy: "name_natural",
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return (res.data.files ?? []).map((f) => ({
    id: f.id!,
    name: f.name ?? "Sans titre",
    mimeType: f.mimeType ?? "",
    kind: classify(f.mimeType ?? ""),
    webViewLink: f.webViewLink ?? null,
    thumbnailLink: f.thumbnailLink ?? null,
    modifiedTime: f.modifiedTime ?? null,
    sizeBytes: f.size ?? null,
  }));
}
