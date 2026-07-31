// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { api, ApiError } from "@/lib/api";
// import type { Exam } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input, Select } from "@/components/ui/Field";
// import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";
// import { Modal } from "@/components/ui/Modal";

// function fmt(dt?: string) {
//   if (!dt) return "—";
//   return new Date(dt).toLocaleString(undefined, {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// function extractList(raw: unknown): Exam[] {
//   if (Array.isArray(raw)) return raw as Exam[];
//   if (raw && typeof raw === "object") {
//     for (const value of Object.values(raw as Record<string, unknown>)) {
//       if (Array.isArray(value)) return value as Exam[];
//     }
//   }
//   return [];
// }

// export default function PracticeExamsPage() {
//   const router = useRouter();
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [createOpen, setCreateOpen] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [createError, setCreateError] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     title: "",
//     chapter: "",
//     topic: "",
//     difficulty: "",
//     type: "",
//     questionCount: "10",
//     durationMinutes: "20",
//     negativeMarking: false,
//   });

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<unknown>("/exams/practice/mine");
//       setExams(extractList(res));
//     } catch (e) {
//       setError(
//         e instanceof ApiError
//           ? e.message
//           : "Failed to load your practice exams.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const openCreate = () => {
//     setCreateError(null);
//     setCreateOpen(true);
//   };

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setCreating(true);
//     setCreateError(null);
//     try {
//       const exam = await api.post<Exam>("/exams/practice", {
//         title: form.title || undefined,
//         chapter: form.chapter || undefined,
//         topic: form.topic || undefined,
//         difficulty: form.difficulty || undefined,
//         type: form.type || undefined,
//         questionCount: Number(form.questionCount),
//         durationMinutes: Number(form.durationMinutes),
//         negativeMarking: form.negativeMarking,
//       });
//       // Straight into the exam so practice feels instant — one click to
//       // create, then start right away.
//       router.push(`/exams/${exam.id}`);
//     } catch (e) {
//       setCreateError(
//         e instanceof ApiError ? e.message : "Failed to create practice exam.",
//       );
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//             Practice Exams
//           </h1>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Build a quick self-test from the question bank — pick a topic, how
//             many questions, and go. You can retake these as many times as you
//             like.
//           </p>
//         </div>
//         <Button onClick={openCreate} className="shrink-0">
//           + Create Practice Exam
//         </Button>
//       </div>

//       {error && <Alert>{error}</Alert>}

//       {loading ? (
//         <Spinner />
//       ) : exams.length === 0 ? (
//         <EmptyState
//           title="No practice exams yet"
//           description="Create one to start testing yourself on any topic."
//           action={
//             <Button size="sm" onClick={openCreate}>
//               + Create Practice Exam
//             </Button>
//           }
//         />
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {exams.map((exam) => (
//             <Link key={exam.id} href={`/exams/${exam.id}`}>
//               <Card className="h-full transition-shadow hover:shadow-md">
//                 <div className="mb-2 flex items-center gap-1.5">
//                   <Badge color="indigo">🎯 Practice</Badge>
//                 </div>
//                 <h3 className="font-semibold text-slate-900 dark:text-white">
//                   {exam.title}
//                 </h3>
//                 <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//                   {exam.durationMinutes} min • {exam.totalMarks} marks
//                 </p>
//                 <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
//                   Created {fmt(exam.startTime)}
//                 </p>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       )}

//       <Modal
//         open={createOpen}
//         onClose={() => setCreateOpen(false)}
//         title="Create Practice Exam"
//       >
//         <form onSubmit={handleCreate} className="flex flex-col gap-4">
//           {createError && <Alert>{createError}</Alert>}
//           <Input
//             label="Title"
//             placeholder="e.g. Thermodynamics practice"
//             hint="Optional — we'll name it after the topic if left blank."
//             value={form.title}
//             onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="Chapter"
//               placeholder="Optional"
//               value={form.chapter}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, chapter: e.target.value }))
//               }
//             />
//             <Input
//               label="Topic"
//               placeholder="Optional"
//               value={form.topic}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, topic: e.target.value }))
//               }
//             />
//             <Select
//               label="Difficulty"
//               value={form.difficulty}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, difficulty: e.target.value }))
//               }
//             >
//               <option value="">Any</option>
//               <option value="EASY">Easy</option>
//               <option value="MEDIUM">Medium</option>
//               <option value="HARD">Hard</option>
//             </Select>
//             <Select
//               label="Question type"
//               value={form.type}
//               onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
//             >
//               <option value="">Any</option>
//               <option value="MCQ">MCQ</option>
//               <option value="TRUE_FALSE">True / False</option>
//               <option value="NUMERICAL">Numerical</option>
//               <option value="MULTIPLE_SELECT">Multiple select</option>
//               <option value="SHORT_ANSWER">Short answer</option>
//               <option value="LONG_ANSWER">Long answer</option>
//             </Select>
//             <Input
//               label="Number of questions"
//               type="number"
//               min={1}
//               max={50}
//               required
//               value={form.questionCount}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, questionCount: e.target.value }))
//               }
//             />
//             <Input
//               label="Duration (minutes)"
//               type="number"
//               min={1}
//               max={300}
//               required
//               value={form.durationMinutes}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, durationMinutes: e.target.value }))
//               }
//             />
//           </div>
//           <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
//             <input
//               type="checkbox"
//               checked={form.negativeMarking}
//               onChange={(e) =>
//                 setForm((f) => ({ ...f, negativeMarking: e.target.checked }))
//               }
//               className="h-4 w-4 rounded border-slate-300"
//             />
//             Enable negative marking
//           </label>
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Only questions matching your filters that already exist in the
//             shared question bank can be selected — if nothing matches, try
//             broadening your filters.
//           </p>
//           <Button type="submit" loading={creating} fullWidth>
//             Create &amp; open
//           </Button>
//         </form>
//       </Modal>
//     </div>
//   );
//}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { Exam, Question } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";
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

export default function PracticeExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("20");
  const [negativeMarking, setNegativeMarking] = useState(false);

  // Question picker state
  const [bank, setBank] = useState<Question[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [bankType, setBankType] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>("/exams/practice/mine");
      setExams(extractList<Exam>(res));
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "Failed to load your practice exams.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const searchBank = useCallback(async () => {
    setBankLoading(true);
    try {
      const res = await api.get<unknown>("/questions", {
        search: bankSearch || undefined,
        type: bankType || undefined,
        scope: "own_and_shared",
        limit: 50,
      });
      const list = extractList<Question>(res);
      setBank(list);
    } catch {
      setBank([]);
    } finally {
      setBankLoading(false);
    }
  }, [bankSearch, bankType]);

  const openCreate = () => {
    setCreateError(null);
    setTitle("");
    setDurationMinutes("20");
    setNegativeMarking(false);
    setSelected(new Set());
    setBankSearch("");
    setBankType("");
    setCreateOpen(true);
    searchBank();
  };

  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalMarks = bank
    .filter((q) => selected.has(q.id))
    .reduce((sum, q) => sum + (q.marks ?? 1), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0) {
      setCreateError("Pick at least one question.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const exam = await api.post<Exam>("/exams/practice", {
        title: title || undefined,
        questionIds: Array.from(selected),
        durationMinutes: Number(durationMinutes),
        negativeMarking,
      });
      // Straight into the exam so practice feels instant.
      router.push(`/exams/${exam.id}`);
    } catch (e) {
      setCreateError(
        e instanceof ApiError ? e.message : "Failed to create practice exam.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            Practice Exams
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pick questions from your own bank and the shared bank, build a quick
            self-test, and retake it as many times as you like. Only you can see
            these.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          + Create Practice Exam
        </Button>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : exams.length === 0 ? (
        <EmptyState
          title="No practice exams yet"
          description="Create one to start testing yourself on any topic."
          action={
            <Button size="sm" onClick={openCreate}>
              + Create Practice Exam
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center gap-1.5">
                  <Badge color="indigo">🎯 Practice</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {exam.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {exam.durationMinutes} min • {exam.totalMarks} marks
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Created {fmt(exam.startTime)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Practice Exam"
        wide
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {createError && <Alert>{createError}</Alert>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              placeholder="Optional — named after your selection if left blank"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              min={1}
              max={300}
              required
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={(e) => setNegativeMarking(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Enable negative marking
          </label>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Choose questions ({selected.size} selected, {totalMarks} marks)
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Search questions..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="flex-1"
              />
              <Select
                value={bankType}
                onChange={(e) => setBankType(e.target.value)}
                className="w-40"
              >
                <option value="">All types</option>
                <option value="MCQ">MCQ</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="NUMERICAL">Numerical</option>
                <option value="MULTIPLE_SELECT">Multiple select</option>
                <option value="SHORT_ANSWER">Short answer</option>
                <option value="LONG_ANSWER">Long answer</option>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={searchBank}
                loading={bankLoading}
              >
                Search
              </Button>
            </div>
            <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
              {bankLoading ? (
                <Spinner />
              ) : bank.length === 0 ? (
                <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
                  No questions found. Try a different search, or add some to
                  your bank first under Question Bank / Documents &amp; AI.
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
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
                    />
                    <span className="min-w-0">
                      <span className="mr-1.5 inline-flex">
                        <Badge color="indigo">
                          {q.type.replaceAll("_", " ")}
                        </Badge>
                      </span>
                      {q.aiGenerated && (
                        <span className="mr-1.5 inline-flex">
                          <Badge color="blue">AI</Badge>
                        </span>
                      )}
                      <span className="text-slate-800 dark:text-slate-200">
                        <MathText text={q.title} />
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={creating}
              disabled={selected.size === 0}
            >
              Create &amp; open ({selected.size})
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
