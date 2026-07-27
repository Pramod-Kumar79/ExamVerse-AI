// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import { api, ApiError } from "@/lib/api";
// import type { Exam, Question } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input, Textarea } from "@/components/ui/Field";
// import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";
// import { MathText } from "@/components/ui/MathText";
// import { Modal } from "@/components/ui/Modal";

// function fmt(dt?: string) {
//   if (!dt) return "—";
//   return new Date(dt).toLocaleString(undefined, {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// function extractList<T>(raw: unknown): T[] {
//   if (Array.isArray(raw)) return raw as T[];
//   if (raw && typeof raw === "object") {
//     for (const value of Object.values(raw as Record<string, unknown>)) {
//       if (Array.isArray(value)) return value as T[];
//     }
//   }
//   return [];
// }

// export default function ExamDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const router = useRouter();
//   const isManager = user?.role === "ADMIN" || user?.role === "TEACHER";

//   const [exam, setExam] = useState<Exam | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [busy, setBusy] = useState(false);

//   const [editOpen, setEditOpen] = useState(false);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     instructions: "",
//     maxAttempts: "1",
//   });

//   const [addOpen, setAddOpen] = useState(false);
//   const [bank, setBank] = useState<Question[]>([]);
//   const [bankSearch, setBankSearch] = useState("");
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [copied, setCopied] = useState(false);

//   const copyExamLink = async () => {
//     await navigator.clipboard.writeText(String(id));
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<Exam>(
//         isManager ? `/exams/${id}/preview` : `/exams/${id}`,
//       );
//       setExam(res);
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to load exam.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id, isManager]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const openEdit = () => {
//     if (!exam) return;
//     setEditForm({
//       title: exam.title,
//       description: exam.description || "",
//       instructions: exam.instructions || "",
//       maxAttempts: String(exam.maxAttempts ?? 1),
//     });
//     setEditOpen(true);
//   };

//   const saveEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setBusy(true);
//     setError(null);
//     try {
//       await api.patch(`/exams/${id}`, {
//         ...editForm,
//         maxAttempts: Number(editForm.maxAttempts) || 1,
//       });
//       setEditOpen(false);
//       await load();
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to update exam.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const togglePublish = async () => {
//     if (!exam) return;
//     setBusy(true);
//     setError(null);
//     try {
//       await api.patch(`/exams/${id}`, { isPublished: !exam.isPublished });
//       await load();
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to update publish status.",
//       );
//     } finally {
//       setBusy(false);
//     }
//   };

//   const openAddQuestions = async () => {
//     setAddOpen(true);
//     try {
//       const res = await api.get<unknown>("/questions", {
//         search: bankSearch || undefined,
//         limit: 100,
//       });
//       setBank(extractList<Question>(res));
//     } catch {
//       setBank([]);
//     }
//   };

//   const searchBank = async () => {
//     try {
//       const res = await api.get<unknown>("/questions", {
//         search: bankSearch || undefined,
//         limit: 100,
//       });
//       setBank(extractList<Question>(res));
//     } catch {
//       setBank([]);
//     }
//   };

//   const toggleSelect = (qid: string) =>
//     setSelected((s) => {
//       const next = new Set(s);
//       if (next.has(qid)) next.delete(qid);
//       else next.add(qid);
//       return next;
//     });

//   const attachSelected = async () => {
//     if (selected.size === 0) return;
//     setBusy(true);
//     setError(null);
//     try {
//       await api.post(`/exams/${id}/questions`, {
//         questionIds: Array.from(selected),
//       });
//       setSelected(new Set());
//       setAddOpen(false);
//       await load();
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to attach questions.",
//       );
//     } finally {
//       setBusy(false);
//     }
//   };

//   const removeQuestion = async (questionId: string) => {
//     if (!confirm("Remove this question from the exam?")) return;
//     try {
//       await api.delete(`/exams/${id}/questions/${questionId}`);
//       await load();
//     } catch (e) {
//       alert(e instanceof ApiError ? e.message : "Failed to remove question.");
//     }
//   };

//   const moveQuestion = async (index: number, direction: -1 | 1) => {
//     if (!exam?.examQuestions) return;
//     const list = [...exam.examQuestions].sort(
//       (a, b) => a.displayOrder - b.displayOrder,
//     );
//     const target = index + direction;
//     if (target < 0 || target >= list.length) return;
//     [list[index], list[target]] = [list[target], list[index]];
//     const payload = {
//       questions: list.map((q, i) => ({
//         questionId: q.questionId,
//         displayOrder: i + 1,
//       })),
//     };
//     try {
//       await api.patch(`/exams/${id}/questions/reorder`, payload);
//       await load();
//     } catch (e) {
//       alert(e instanceof ApiError ? e.message : "Failed to reorder.");
//     }
//   };

//   const startOrResume = async () => {
//     setBusy(true);
//     setError(null);
//     try {
//       const attempt = await api.post<{ id: string }>("/exam-attempts/start", {
//         examId: id,
//       });
//       router.push(`/exams/${id}/take?attemptId=${attempt.id}`);
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to start exam.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   if (loading) return <Spinner />;
//   if (!exam) return <Alert>{error || "Exam not found."}</Alert>;

//   const sortedQuestions = (exam.examQuestions || [])
//     .slice()
//     .sort((a, b) => a.displayOrder - b.displayOrder);

//   const WINDOW_BUFFER_MS = 10 * 60 * 1000;
//   const nowMs = Date.now();
//   const startMs = new Date(exam.startTime).getTime();
//   const endMs = new Date(exam.endTime).getTime();
//   const windowStatus: "upcoming" | "open" | "closed" =
//     nowMs < startMs
//       ? "upcoming"
//       : nowMs > endMs + WINDOW_BUFFER_MS
//         ? "closed"
//         : "open";

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//         <div className="min-w-0">
//           <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
//             <Badge color={exam.isPublished ? "green" : "slate"}>
//               {exam.isPublished ? "Published" : "Draft"}
//             </Badge>
//             <Badge color="indigo">{exam.status || "DRAFT"}</Badge>
//             {!isManager && (
//               <Badge
//                 color={
//                   windowStatus === "open"
//                     ? "green"
//                     : windowStatus === "upcoming"
//                       ? "amber"
//                       : "red"
//                 }
//               >
//                 {windowStatus === "open"
//                   ? "Open now"
//                   : windowStatus === "upcoming"
//                     ? "Not started yet"
//                     : "Closed"}
//               </Badge>
//             )}
//           </div>
//           <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//             {exam.title}
//           </h1>
//           {exam.description && (
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               {exam.description}
//             </p>
//           )}
//         </div>
//         {isManager ? (
//           <div className="flex shrink-0 flex-wrap gap-2">
//             <Button variant="outline" size="sm" onClick={copyExamLink}>
//               {copied ? "Copied ✓" : "📋 Copy exam ID"}
//             </Button>
//             <Link href={`/exams/${id}/results`}>
//               <Button variant="outline" size="sm">
//                 📊 Results
//               </Button>
//             </Link>
//             <Button variant="outline" size="sm" onClick={openEdit}>
//               Edit
//             </Button>
//             <Button
//               size="sm"
//               variant={exam.isPublished ? "outline" : "primary"}
//               loading={busy}
//               onClick={togglePublish}
//             >
//               {exam.isPublished ? "Unpublish" : "Publish"}
//             </Button>
//           </div>
//         ) : (
//           <div className="flex shrink-0 flex-col items-end gap-1">
//             <Button loading={busy} onClick={startOrResume}>
//               Start / Resume Exam
//             </Button>
//             {windowStatus === "upcoming" && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Opens {new Date(exam.startTime).toLocaleString()}
//               </p>
//             )}
//             {windowStatus === "closed" && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Window closed {new Date(exam.endTime).toLocaleString()} — you
//                 can still finish if you already started.
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {error && <Alert>{error}</Alert>}

//       <Card>
//         <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Starts</p>
//             <p className="font-medium text-slate-900 dark:text-white">
//               {fmt(exam.startTime)}
//             </p>
//           </div>
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Ends</p>
//             <p className="font-medium text-slate-900 dark:text-white">
//               {fmt(exam.endTime)}
//             </p>
//           </div>
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Duration</p>
//             <p className="font-medium text-slate-900 dark:text-white">
//               {exam.durationMinutes} min
//             </p>
//           </div>
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Marks</p>
//             <p className="font-medium text-slate-900 dark:text-white">
//               {exam.totalMarks} (pass {exam.passingMarks})
//             </p>
//           </div>
//           <div>
//             <p className="text-slate-500 dark:text-slate-400">Max attempts</p>
//             <p className="font-medium text-slate-900 dark:text-white">
//               {exam.maxAttempts ?? 1}
//             </p>
//           </div>
//         </div>
//         {exam.instructions && (
//           <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
//             <p className="mb-1 font-medium text-slate-800 dark:text-slate-200">
//               Instructions
//             </p>
//             {exam.instructions}
//           </div>
//         )}
//       </Card>

//       {isManager && (
//         <div className="flex flex-col gap-3">
//           <div className="flex items-center justify-between">
//             <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//               Questions ({sortedQuestions.length})
//             </h2>
//             <Button size="sm" onClick={openAddQuestions}>
//               + Add questions
//             </Button>
//           </div>

//           {sortedQuestions.length === 0 ? (
//             <EmptyState
//               title="No questions attached yet"
//               description="Add questions from your bank."
//             />
//           ) : (
//             <div className="flex flex-col gap-2">
//               {sortedQuestions.map((eq, idx) => (
//                 <Card
//                   key={eq.questionId}
//                   className="flex items-center justify-between gap-3"
//                 >
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-medium text-slate-900 dark:text-white">
//                       {idx + 1}. <MathText text={eq.question?.title} />
//                     </p>
//                     <p className="text-xs text-slate-500 dark:text-slate-400">
//                       {eq.marks ?? eq.question?.marks ?? 1} marks
//                     </p>
//                   </div>
//                   <div className="flex shrink-0 items-center gap-1">
//                     <button
//                       onClick={() => moveQuestion(idx, -1)}
//                       disabled={idx === 0}
//                       className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
//                     >
//                       ↑
//                     </button>
//                     <button
//                       onClick={() => moveQuestion(idx, 1)}
//                       disabled={idx === sortedQuestions.length - 1}
//                       className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
//                     >
//                       ↓
//                     </button>
//                     <Button
//                       size="sm"
//                       variant="danger"
//                       onClick={() => removeQuestion(eq.questionId)}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <Modal
//         open={editOpen}
//         onClose={() => setEditOpen(false)}
//         title="Edit Exam"
//       >
//         <form onSubmit={saveEdit} className="flex flex-col gap-4">
//           <Input
//             label="Title"
//             required
//             value={editForm.title}
//             onChange={(e) =>
//               setEditForm((f) => ({ ...f, title: e.target.value }))
//             }
//           />
//           <Textarea
//             label="Description"
//             value={editForm.description}
//             onChange={(e) =>
//               setEditForm((f) => ({ ...f, description: e.target.value }))
//             }
//           />
//           <Textarea
//             label="Instructions"
//             value={editForm.instructions}
//             onChange={(e) =>
//               setEditForm((f) => ({ ...f, instructions: e.target.value }))
//             }
//           />
//           <Input
//             label="Max attempts"
//             type="number"
//             min={1}
//             required
//             hint="Students can't retake the exam beyond this many attempts."
//             value={editForm.maxAttempts}
//             onChange={(e) =>
//               setEditForm((f) => ({ ...f, maxAttempts: e.target.value }))
//             }
//           />
//           <div className="flex justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setEditOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={busy}>
//               Save
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         open={addOpen}
//         onClose={() => setAddOpen(false)}
//         title="Add Questions"
//         wide
//       >
//         <div className="flex flex-col gap-3">
//           <div className="flex gap-2">
//             <Input
//               placeholder="Search question bank..."
//               value={bankSearch}
//               onChange={(e) => setBankSearch(e.target.value)}
//               className="flex-1"
//             />
//             <Button variant="outline" onClick={searchBank} type="button">
//               Search
//             </Button>
//           </div>
//           <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
//             {bank.length === 0 ? (
//               <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
//                 No questions found.
//               </p>
//             ) : (
//               bank.map((q) => (
//                 <label
//                   key={q.id}
//                   className="flex items-start gap-2 border-b border-slate-100 p-3 text-sm last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selected.has(q.id)}
//                     onChange={() => toggleSelect(q.id)}
//                     className="mt-0.5 h-4 w-4 rounded border-slate-300"
//                   />
//                   <span>
//                     <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>{" "}
//                     <span className="text-slate-800 dark:text-slate-200">
//                       <MathText text={q.title} />
//                     </span>
//                   </span>
//                 </label>
//               ))
//             )}
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setAddOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               loading={busy}
//               disabled={selected.size === 0}
//               onClick={attachSelected}
//             >
//               Add {selected.size > 0 ? `(${selected.size})` : ""}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {!isManager && (
//         <p className="text-xs text-slate-400">
//           Need to review your course?{" "}
//           <Link href="/dashboard" className="underline">
//             Back to dashboard
//           </Link>
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import type { Exam, Question } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";
import { MathText } from "@/components/ui/MathText";
import { Modal } from "@/components/ui/Modal";

function fmt(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const isManager = user?.role === "ADMIN" || user?.role === "TEACHER";

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    instructions: "",
    maxAttempts: "1",
  });

  const [addOpen, setAddOpen] = useState(false);
  const [bank, setBank] = useState<Question[]>([]);
  const [bankSearch, setBankSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const copyExamLink = async () => {
    await navigator.clipboard.writeText(String(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Exam>(
        isManager ? `/exams/${id}/preview` : `/exams/${id}`,
      );
      setExam(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load exam.");
    } finally {
      setLoading(false);
    }
  }, [id, isManager]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = () => {
    if (!exam) return;
    setEditForm({
      title: exam.title,
      description: exam.description || "",
      instructions: exam.instructions || "",
      maxAttempts: String(exam.maxAttempts ?? 1),
    });
    setEditOpen(true);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/exams/${id}`, {
        ...editForm,
        maxAttempts: Number(editForm.maxAttempts) || 1,
      });
      setEditOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to update exam.");
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async () => {
    if (!exam) return;
    setBusy(true);
    setError(null);
    try {
      await api.patch(`/exams/${id}`, { isPublished: !exam.isPublished });
      await load();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to update publish status.",
      );
    } finally {
      setBusy(false);
    }
  };

  const openAddQuestions = async () => {
    setAddOpen(true);
    try {
      const res = await api.get<unknown>("/questions", {
        search: bankSearch || undefined,
        limit: 100,
      });
      setBank(extractList<Question>(res));
    } catch {
      setBank([]);
    }
  };

  const searchBank = async () => {
    try {
      const res = await api.get<unknown>("/questions", {
        search: bankSearch || undefined,
        limit: 100,
      });
      setBank(extractList<Question>(res));
    } catch {
      setBank([]);
    }
  };

  const toggleSelect = (qid: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });

  const attachSelected = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    setError(null);
    try {
      await api.post(`/exams/${id}/questions`, {
        questionIds: Array.from(selected),
      });
      setSelected(new Set());
      setAddOpen(false);
      await load();
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to attach questions.",
      );
    } finally {
      setBusy(false);
    }
  };

  const removeQuestion = async (questionId: string) => {
    if (!confirm("Remove this question from the exam?")) return;
    try {
      await api.delete(`/exams/${id}/questions/${questionId}`);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to remove question.");
    }
  };

  const moveQuestion = async (index: number, direction: -1 | 1) => {
    if (!exam?.examQuestions) return;
    const list = [...exam.examQuestions].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const payload = {
      questions: list.map((q, i) => ({
        questionId: q.questionId,
        displayOrder: i + 1,
      })),
    };
    try {
      await api.patch(`/exams/${id}/questions/reorder`, payload);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to reorder.");
    }
  };

  const startOrResume = async () => {
    setBusy(true);
    setError(null);
    try {
      const attempt = await api.post<{ id: string }>("/exam-attempts/start", {
        examId: id,
      });
      router.push(`/exams/${id}/take?attemptId=${attempt.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to start exam.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;
  if (!exam) return <Alert>{error || "Exam not found."}</Alert>;

  const sortedQuestions = (exam.examQuestions || [])
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const WINDOW_BUFFER_MS = 10 * 60 * 1000;
  const nowMs = Date.now();
  const startMs = new Date(exam.startTime).getTime();
  const endMs = new Date(exam.endTime).getTime();
  const windowStatus: "upcoming" | "open" | "closed" =
    nowMs < startMs
      ? "upcoming"
      : nowMs > endMs + WINDOW_BUFFER_MS
        ? "closed"
        : "open";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge color={exam.isPublished ? "green" : "slate"}>
              {exam.isPublished ? "Published" : "Draft"}
            </Badge>
            <Badge color="indigo">{exam.status || "DRAFT"}</Badge>
            {exam.isPractice && <Badge color="blue">🎯 Practice</Badge>}
            {!isManager && (
              <Badge
                color={
                  windowStatus === "open"
                    ? "green"
                    : windowStatus === "upcoming"
                      ? "amber"
                      : "red"
                }
              >
                {windowStatus === "open"
                  ? "Open now"
                  : windowStatus === "upcoming"
                    ? "Not started yet"
                    : "Closed"}
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {exam.title}
          </h1>
          {exam.description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {exam.description}
            </p>
          )}
        </div>
        {isManager ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyExamLink}>
              {copied ? "Copied ✓" : "📋 Copy exam ID"}
            </Button>
            <Link href={`/exams/${id}/results`}>
              <Button variant="outline" size="sm">
                📊 Results
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={openEdit}>
              Edit
            </Button>
            <Button
              size="sm"
              variant={exam.isPublished ? "outline" : "primary"}
              loading={busy}
              onClick={togglePublish}
            >
              {exam.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Button loading={busy} onClick={startOrResume}>
              Start / Resume Exam
            </Button>
            {windowStatus === "upcoming" && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Opens {new Date(exam.startTime).toLocaleString()}
              </p>
            )}
            {windowStatus === "closed" && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Window closed {new Date(exam.endTime).toLocaleString()} — you
                can still finish if you already started.
              </p>
            )}
          </div>
        )}
      </div>

      {error && <Alert>{error}</Alert>}

      <Card>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Starts</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {fmt(exam.startTime)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Ends</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {fmt(exam.endTime)}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Duration</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {exam.durationMinutes} min
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Marks</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {exam.totalMarks} (pass {exam.passingMarks})
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Max attempts</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {exam.maxAttempts ?? 1}
            </p>
          </div>
        </div>
        {exam.instructions && (
          <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <p className="mb-1 font-medium text-slate-800 dark:text-slate-200">
              Instructions
            </p>
            {exam.instructions}
          </div>
        )}
      </Card>

      {isManager && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Questions ({sortedQuestions.length})
            </h2>
            <Button size="sm" onClick={openAddQuestions}>
              + Add questions
            </Button>
          </div>

          {sortedQuestions.length === 0 ? (
            <EmptyState
              title="No questions attached yet"
              description="Add questions from your bank."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {sortedQuestions.map((eq, idx) => (
                <Card
                  key={eq.questionId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {idx + 1}. <MathText text={eq.question?.title} />
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {eq.marks ?? eq.question?.marks ?? 1} marks
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => moveQuestion(idx, -1)}
                      disabled={idx === 0}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveQuestion(idx, 1)}
                      disabled={idx === sortedQuestions.length - 1}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                    >
                      ↓
                    </button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeQuestion(eq.questionId)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Exam"
      >
        <form onSubmit={saveEdit} className="flex flex-col gap-4">
          <Input
            label="Title"
            required
            value={editForm.title}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <Textarea
            label="Instructions"
            value={editForm.instructions}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, instructions: e.target.value }))
            }
          />
          <Input
            label="Max attempts"
            type="number"
            min={1}
            required
            hint="Students can't retake the exam beyond this many attempts."
            value={editForm.maxAttempts}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, maxAttempts: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Questions"
        wide
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search question bank..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={searchBank} type="button">
              Search
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
            {bank.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
                No questions found.
              </p>
            ) : (
              bank.map((q) => (
                <label
                  key={q.id}
                  className="flex items-start gap-2 border-b border-slate-100 p-3 text-sm last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(q.id)}
                    onChange={() => toggleSelect(q.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300"
                  />
                  <span>
                    <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>{" "}
                    <span className="text-slate-800 dark:text-slate-200">
                      <MathText text={q.title} />
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={busy}
              disabled={selected.size === 0}
              onClick={attachSelected}
            >
              Add {selected.size > 0 ? `(${selected.size})` : ""}
            </Button>
          </div>
        </div>
      </Modal>

      {!isManager && (
        <p className="text-xs text-slate-400">
          Need to review your course?{" "}
          <Link href="/dashboard" className="underline">
            Back to dashboard
          </Link>
        </p>
      )}
    </div>
  );
}