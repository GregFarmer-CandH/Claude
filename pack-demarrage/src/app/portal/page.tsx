"use client";

import { useEffect, useMemo, useState } from "react";
import type { DriveFile } from "@/lib/drive";

function FileIcon({ kind }: { kind: DriveFile["kind"] }) {
  if (kind === "pdf") {
    return <span className="text-lg" aria-hidden>📄</span>;
  }
  if (kind === "video") {
    return <span className="text-lg" aria-hidden>🎬</span>;
  }
  return <span className="text-lg" aria-hidden>📁</span>;
}

function FileList({ files }: { files: DriveFile[] }) {
  return (
    <ul className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200">
      {files.map((file) => (
        <li key={file.id}>
          <a
            href={file.webViewLink ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-stone-100"
          >
            <FileIcon kind={file.kind} />
            <span className="flex-1 truncate">{file.name}</span>
            <span className="text-xs text-stone-400">
              {file.kind === "pdf" ? "PDF" : file.kind === "video" ? "Vidéo" : ""}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function PortalFilesPage() {
  const [files, setFiles] = useState<DriveFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/drive/files")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Erreur inconnue.");
        setFiles(data.files);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur inconnue."));
  }, []);

  const groups = useMemo(() => {
    if (!files) return [];
    const atRoot = files.filter((f) => !f.folder);
    const byFolder = new Map<string, DriveFile[]>();
    for (const f of files) {
      if (!f.folder) continue;
      byFolder.set(f.folder, [...(byFolder.get(f.folder) ?? []), f]);
    }
    return [
      ...(atRoot.length ? [{ label: null as string | null, files: atRoot }] : []),
      ...Array.from(byFolder.entries()).map(([label, items]) => ({ label, files: items })),
    ];
  }, [files]);

  return (
    <section>
      <h2 className="mb-4 text-base font-medium">Documents et vidéos</h2>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {!files && !error && <p className="text-sm text-stone-500">Chargement...</p>}

      {files && files.length === 0 && (
        <p className="text-sm text-stone-500">Aucun fichier disponible pour le moment.</p>
      )}

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label ?? "__root"}>
            {group.label && (
              <h3 className="mb-2 text-sm font-medium text-stone-600">{group.label}</h3>
            )}
            <FileList files={group.files} />
          </div>
        ))}
      </div>
    </section>
  );
}
