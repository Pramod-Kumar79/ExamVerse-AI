// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { api, ApiError, API_BASE, getAccessToken } from "@/lib/api";
// import type { UploadedDocument } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";

// function statusColor(
//   status: string,
// ): "slate" | "green" | "amber" | "red" | "blue" {
//   const s = status?.toUpperCase?.() || "";
//   if (s.includes("COMPLETE") || s.includes("DONE") || s.includes("PROCESSED"))
//     return "green";
//   if (s.includes("FAIL") || s.includes("ERROR")) return "red";
//   if (s.includes("PROGRESS") || s.includes("PROCESSING")) return "blue";
//   return "slate";
// }

// function extractList(raw: unknown): UploadedDocument[] {
//   if (Array.isArray(raw)) return raw as UploadedDocument[];
//   if (raw && typeof raw === "object") {
//     for (const value of Object.values(raw as Record<string, unknown>)) {
//       if (Array.isArray(value)) return value as UploadedDocument[];
//     }
//   }
//   return [];
// }

// function formatBytes(bytes: number) {
//   if (!bytes) return "—";
//   const units = ["B", "KB", "MB", "GB"];
//   let i = 0;
//   let val = bytes;
//   while (val >= 1024 && i < units.length - 1) {
//     val /= 1024;
//     i++;
//   }
//   return `${val.toFixed(1)} ${units[i]}`;
// }

// export default function DocumentsPage() {
//   const [items, setItems] = useState<UploadedDocument[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const fileRef = useRef<HTMLInputElement>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<unknown>("/documents");
//       setItems(extractList(res));
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to load documents.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handleUpload = async () => {
//     const file = fileRef.current?.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     setError(null);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       // Uses the raw fetch here so we can send multipart/form-data with the current access token.
//       const res = await fetch(`${API_BASE}/documents/upload`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
//         credentials: "include",
//         body: formData,
//       });
//       const json = await res.json();
//       if (!res.ok) throw new Error(json?.message || "Upload failed.");
//       if (fileRef.current) fileRef.current.value = "";
//       await load();
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Upload failed.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this document?")) return;
//     try {
//       await api.delete(`/documents/${id}`);
//       await load();
//     } catch (e) {
//       alert(e instanceof ApiError ? e.message : "Failed to delete.");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <div>
//         <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//           Documents &amp; AI Extraction
//         </h1>
//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           Upload a past paper or textbook (PDF), then let AI pull out structured
//           questions ready for your question bank.
//         </p>
//       </div>

//       {error && <Alert>{error}</Alert>}

//       <Card>
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//           <input
//             ref={fileRef}
//             type="file"
//             accept="application/pdf,.pdf,image/*"
//             className="w-full flex-1 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 dark:text-slate-300 dark:file:bg-indigo-950 dark:file:text-indigo-300"
//           />
//           <Button
//             onClick={handleUpload}
//             loading={uploading}
//             className="shrink-0"
//           >
//             Upload document
//           </Button>
//         </div>
//       </Card>

//       {loading ? (
//         <Spinner />
//       ) : items.length === 0 ? (
//         <EmptyState
//           title="No documents yet"
//           description="Upload a PDF to get started with AI question extraction."
//         />
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {items.map((doc) => (
//             <Card key={doc.id} className="flex flex-col gap-2">
//               <div className="flex items-start justify-between gap-2">
//                 <p className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
//                   📄 {doc.originalName}
//                 </p>
//                 <Badge color={statusColor(doc.status)}>{doc.status}</Badge>
//               </div>
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 {formatBytes(doc.fileSize)}{" "}
//                 {doc.pageCount ? `• ${doc.pageCount} pages` : ""}
//               </p>
//               <div className="mt-2 flex gap-2">
//                 <Link href={`/documents/${doc.id}`} className="flex-1">
//                   <Button size="sm" variant="outline" fullWidth>
//                     Open
//                   </Button>
//                 </Link>
//                 <Button
//                   size="sm"
//                   variant="danger"
//                   onClick={() => handleDelete(doc.id)}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { UploadedDocument } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";

function statusColor(
  status: string,
): "slate" | "green" | "amber" | "red" | "blue" {
  const s = status?.toUpperCase?.() || "";
  if (s.includes("COMPLETE") || s.includes("DONE") || s.includes("PROCESSED"))
    return "green";
  if (s.includes("FAIL") || s.includes("ERROR")) return "red";
  if (s.includes("PROGRESS") || s.includes("PROCESSING")) return "blue";
  return "slate";
}

function extractList(raw: unknown): UploadedDocument[] {
  if (Array.isArray(raw)) return raw as UploadedDocument[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as UploadedDocument[];
    }
  }
  return [];
}

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${units[i]}`;
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";
  const [items, setItems] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>("/documents");
      setItems(extractList(res));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Uses the raw fetch here so we can send multipart/form-data with the current access token.
      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to delete.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          {isStudent
            ? "My Documents & AI Extraction"
            : "Documents & AI Extraction"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isStudent
            ? "Upload your own notes or past papers, then let AI pull out structured questions for your personal question bank — separate from your teacher's."
            : "Upload a past paper or textbook (PDF), then let AI pull out structured questions ready for your question bank."}
        </p>
      </div>

      {error && <Alert>{error}</Alert>}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf,image/*"
            className="w-full flex-1 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 dark:text-slate-300 dark:file:bg-indigo-950 dark:file:text-indigo-300"
          />
          <Button
            onClick={handleUpload}
            loading={uploading}
            className="shrink-0"
          >
            Upload document
          </Button>
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Upload a PDF to get started with AI question extraction."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((doc) => (
            <Card key={doc.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  📄 {doc.originalName}
                </p>
                <Badge color={statusColor(doc.status)}>{doc.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatBytes(doc.fileSize)}{" "}
                {doc.pageCount ? `• ${doc.pageCount} pages` : ""}
              </p>
              <div className="mt-2 flex gap-2">
                <Link href={`/documents/${doc.id}`} className="flex-1">
                  <Button size="sm" variant="outline" fullWidth>
                    Open
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}