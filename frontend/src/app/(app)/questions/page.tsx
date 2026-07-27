// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { api, ApiError, assetUrl } from "@/lib/api";
// import type {
//   Question,
//   QuestionOption,
//   QuestionType,
//   DifficultyLevel,
// } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input, Select, Textarea } from "@/components/ui/Field";
// import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";
// import { MathText } from "@/components/ui/MathText";
// import { Modal } from "@/components/ui/Modal";

// const QUESTION_TYPES: QuestionType[] = [
//   "MCQ",
//   "MULTIPLE_SELECT",
//   "TRUE_FALSE",
//   "NUMERICAL",
//   "SHORT_ANSWER",
//   "LONG_ANSWER",
//   "CODING",
// ];
// const DIFFICULTIES: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
// const NEEDS_OPTIONS: QuestionType[] = ["MCQ", "MULTIPLE_SELECT", "TRUE_FALSE"];

// function extractList(raw: unknown): Question[] {
//   if (Array.isArray(raw)) return raw as Question[];
//   if (raw && typeof raw === "object") {
//     for (const value of Object.values(raw as Record<string, unknown>)) {
//       if (Array.isArray(value)) return value as Question[];
//     }
//   }
//   return [];
// }

// function emptyOption(order: number): QuestionOption {
//   return { optionText: "", isCorrect: false, displayOrder: order };
// }

// export default function QuestionsPage() {
//   const [items, setItems] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [examFilter, setExamFilter] = useState("");
//   const [examOptions, setExamOptions] = useState<
//     { value: string; label: string }[]
//   >([]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState<Question | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [type, setType] = useState<QuestionType>("MCQ");
//   const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("MEDIUM");
//   const [chapter, setChapter] = useState("");
//   const [topic, setTopic] = useState("");
//   const [explanation, setExplanation] = useState("");
//   const [tags, setTags] = useState("");
//   const [marks, setMarks] = useState("1");
//   const [negativeMarks, setNegativeMarks] = useState("0");
//   const [numericalAnswer, setNumericalAnswer] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [uploadingImage, setUploadingImage] = useState<string | null>(null);
//   const [options, setOptions] = useState<QuestionOption[]>([
//     emptyOption(1),
//     emptyOption(2),
//   ]);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setPage(1);
//     try {
//       if (examFilter) {
//         const exam = await api.get<{
//           examQuestions?: { question: Question; displayOrder: number }[];
//         }>(`/exams/${examFilter}/preview`);
//         const questions = (exam.examQuestions || [])
//           .slice()
//           .sort((a, b) => a.displayOrder - b.displayOrder)
//           .map((eq) => eq.question);
//         setItems(questions);
//         setTotalPages(1);
//         setTotal(questions.length);
//       } else {
//         const res = await api.get<{
//           questions: Question[];
//           pagination: { page: number; totalPages: number; total: number };
//         }>("/questions", {
//           search: search || undefined,
//           type: typeFilter || undefined,
//           page: 1,
//           limit: 20,
//         });
//         setItems(res.questions || []);
//         setTotalPages(res.pagination?.totalPages ?? 1);
//         setTotal(res.pagination?.total ?? (res.questions || []).length);
//       }
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to load questions.");
//     } finally {
//       setLoading(false);
//     }
//   }, [search, typeFilter, examFilter]);

//   const loadMore = async () => {
//     if (examFilter) return;
//     setLoadingMore(true);
//     try {
//       const nextPage = page + 1;
//       const res = await api.get<{
//         questions: Question[];
//         pagination: { page: number; totalPages: number; total: number };
//       }>("/questions", {
//         search: search || undefined,
//         type: typeFilter || undefined,
//         page: nextPage,
//         limit: 20,
//       });
//       setItems((prev) => [...prev, ...(res.questions || [])]);
//       setPage(nextPage);
//       setTotalPages(res.pagination?.totalPages ?? nextPage);
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to load more questions.",
//       );
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     api
//       .get<unknown>("/exams")
//       .then((res) => {
//         const exams = extractList(res) as unknown as {
//           id: string;
//           title: string;
//         }[];
//         setExamOptions(exams.map((e) => ({ value: e.id, label: e.title })));
//       })
//       .catch(() => setExamOptions([]));
//   }, []);

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setType("MCQ");
//     setDifficulty("MEDIUM");
//     setChapter("");
//     setTopic("");
//     setExplanation("");
//     setTags("");
//     setMarks("1");
//     setNegativeMarks("0");
//     setNumericalAnswer("");
//     setImageUrl("");
//     setOptions([emptyOption(1), emptyOption(2)]);
//   };

//   const openCreate = () => {
//     setEditing(null);
//     resetForm();
//     setFormError(null);
//     setModalOpen(true);
//   };

//   const openEdit = (q: Question) => {
//     setEditing(q);
//     setTitle(q.title);
//     setDescription(q.description || "");
//     setType(q.type);
//     setDifficulty(q.difficulty || "MEDIUM");
//     setChapter(q.chapter || "");
//     setTopic(q.topic || "");
//     setExplanation(q.explanation || "");
//     setTags((q.tags || []).join(", "));
//     setMarks(String(q.marks ?? 1));
//     setNegativeMarks("0");
//     setNumericalAnswer(q.type === "NUMERICAL" ? q.solution || "" : "");
//     setImageUrl(q.imageUrl || "");
//     setOptions(
//       q.options && q.options.length > 0
//         ? q.options
//         : [emptyOption(1), emptyOption(2)],
//     );
//     setFormError(null);
//     setModalOpen(true);
//   };

//   const updateOption = (idx: number, patch: Partial<QuestionOption>) => {
//     setOptions((opts) =>
//       opts.map((o, i) => (i === idx ? { ...o, ...patch } : o)),
//     );
//   };
//   const addOption = () =>
//     setOptions((opts) => [...opts, emptyOption(opts.length + 1)]);
//   const removeOption = (idx: number) =>
//     setOptions((opts) => opts.filter((_, i) => i !== idx));

//   const handleImageUpload = async (
//     key: string,
//     file: File,
//     onDone: (url: string) => void,
//   ) => {
//     setUploadingImage(key);
//     setFormError(null);
//     try {
//       const res = await api.uploadImage("/questions/upload-image", file);
//       onDone(res.url);
//     } catch (e) {
//       setFormError(e instanceof ApiError ? e.message : "Image upload failed.");
//     } finally {
//       setUploadingImage(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setFormError(null);
//     try {
//       const needsOptions = NEEDS_OPTIONS.includes(type);
//       const cleanOptions = options
//         .filter((o) => o.optionText.trim())
//         .map((o, i) => ({
//           optionText: o.optionText,
//           isCorrect: Boolean(o.isCorrect),
//           displayOrder: i + 1,
//           imageUrl: o.imageUrl || undefined,
//         }));

//       const solution =
//         type === "NUMERICAL"
//           ? numericalAnswer.trim() || undefined
//           : needsOptions
//             ? cleanOptions.find((o) => o.isCorrect)?.optionText
//             : undefined;

//       const base = {
//         title,
//         description: description || undefined,
//         type,
//         difficulty: difficulty || undefined,
//         chapter: chapter || undefined,
//         topic: topic || undefined,
//         explanation: explanation || undefined,
//         tags: tags
//           ? tags
//               .split(",")
//               .map((t) => t.trim())
//               .filter(Boolean)
//           : undefined,
//         solution: type === "NUMERICAL" ? solution : undefined,
//         imageUrl: imageUrl || undefined,
//       };

//       if (editing) {
//         await api.patch(`/questions/${editing.id}`, {
//           ...base,
//           marks: Number(marks) || 1,
//           negativeMarks: Number(negativeMarks) || 0,
//           options: needsOptions ? cleanOptions : undefined,
//           solution,
//         });
//       } else {
//         const created = await api.post<Question>("/questions", base);
//         if (needsOptions && cleanOptions.length > 0) {
//           await api.patch(`/questions/${created.id}`, {
//             marks: Number(marks) || 1,
//             negativeMarks: Number(negativeMarks) || 0,
//             options: cleanOptions,
//             solution,
//           });
//         }
//       }
//       setModalOpen(false);
//       await load();
//     } catch (e) {
//       setFormError(e instanceof ApiError ? e.message : "Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (q: Question) => {
//     if (!confirm("Delete this question?")) return;
//     try {
//       await api.delete(`/questions/${q.id}`);
//       await load();
//     } catch (e) {
//       alert(e instanceof ApiError ? e.message : "Failed to delete.");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//             Question Bank
//           </h1>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Create and organize questions used across your exams.
//           </p>
//         </div>
//         <Button onClick={openCreate} className="shrink-0">
//           + Add Question
//         </Button>
//       </div>

//       <Card>
//         <div className="flex flex-col gap-3 sm:flex-row">
//           <Input
//             placeholder="Search questions..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="sm:flex-1"
//             disabled={Boolean(examFilter)}
//           />
//           <Select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="sm:w-56"
//             disabled={Boolean(examFilter)}
//           >
//             <option value="">All types</option>
//             {QUESTION_TYPES.map((t) => (
//               <option key={t} value={t}>
//                 {t.replaceAll("_", " ")}
//               </option>
//             ))}
//           </Select>
//           <Select
//             value={examFilter}
//             onChange={(e) => setExamFilter(e.target.value)}
//             className="sm:w-64"
//           >
//             <option value="">All questions (not tied to an exam)</option>
//             {examOptions.map((o) => (
//               <option key={o.value} value={o.value}>
//                 📝 {o.label}
//               </option>
//             ))}
//           </Select>
//         </div>
//         {examFilter && (
//           <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//             Showing questions attached to this exam, in exam order. Clear the
//             exam filter to search the full question bank.
//           </p>
//         )}
//       </Card>

//       {error && <Alert>{error}</Alert>}

//       {loading ? (
//         <Spinner />
//       ) : items.length === 0 ? (
//         <EmptyState
//           title="No questions found"
//           description="Try adjusting filters or add a new question."
//         />
//       ) : (
//         <div className="flex flex-col gap-3">
//           {items.map((q) => (
//             <Card key={q.id}>
//               <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
//                 {q.imageUrl && (
//                   <img
//                     src={assetUrl(q.imageUrl)}
//                     alt=""
//                     className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
//                   />
//                 )}
//                 <div className="min-w-0 flex-1">
//                   <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
//                     <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>
//                     {q.difficulty && (
//                       <Badge color="amber">{q.difficulty}</Badge>
//                     )}
//                     {q.aiGenerated && <Badge color="blue">AI</Badge>}
//                     {q.imageUrl && <Badge color="slate">🖼️ has image</Badge>}
//                   </div>
//                   <p className="font-medium text-slate-900 dark:text-white">
//                     <MathText text={q.title} />
//                   </p>
//                   {(q.chapter || q.topic) && (
//                     <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
//                       {[q.chapter, q.topic].filter(Boolean).join(" • ")}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex shrink-0 gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => openEdit(q)}
//                   >
//                     Edit
//                   </Button>
//                   {!examFilter && (
//                     <Button
//                       size="sm"
//                       variant="danger"
//                       onClick={() => handleDelete(q)}
//                     >
//                       Delete
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {!loading && !examFilter && items.length > 0 && (
//         <div className="flex flex-col items-center gap-2 pt-2">
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Showing {items.length} of {total} question{total === 1 ? "" : "s"}
//           </p>
//           {page < totalPages && (
//             <Button
//               variant="outline"
//               size="sm"
//               loading={loadingMore}
//               onClick={loadMore}
//             >
//               Load more
//             </Button>
//           )}
//         </div>
//       )}

//       <Modal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editing ? "Edit Question" : "Add Question"}
//         wide
//       >
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {formError && <Alert>{formError}</Alert>}
//           <Input
//             label="Title"
//             required
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <Textarea
//             label="Description / question body"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
//               Diagram / image (optional)
//             </label>
//             {imageUrl && (
//               <div className="relative w-fit">
//                 <img
//                   src={assetUrl(imageUrl)}
//                   alt="Question diagram"
//                   className="max-h-40 rounded-lg border border-slate-200 dark:border-slate-800"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setImageUrl("")}
//                   className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
//                 >
//                   ✕
//                 </button>
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/jpeg,image/png,image/webp,image/gif"
//               disabled={uploadingImage === "question"}
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) handleImageUpload("question", file, setImageUrl);
//                 e.target.value = "";
//               }}
//               className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 dark:text-slate-300 dark:file:bg-indigo-950 dark:file:text-indigo-300"
//             />
//             {uploadingImage === "question" && (
//               <p className="text-xs text-slate-500 dark:text-slate-400">
//                 Uploading…
//               </p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <Select
//               label="Type"
//               required
//               value={type}
//               onChange={(e) => setType(e.target.value as QuestionType)}
//             >
//               {QUESTION_TYPES.map((t) => (
//                 <option key={t} value={t}>
//                   {t.replaceAll("_", " ")}
//                 </option>
//               ))}
//             </Select>
//             <Select
//               label="Difficulty"
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
//             >
//               {DIFFICULTIES.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </Select>
//             <Input
//               label="Chapter"
//               value={chapter}
//               onChange={(e) => setChapter(e.target.value)}
//             />
//             <Input
//               label="Topic"
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//             />
//           </div>
//           <Textarea
//             label="Explanation"
//             required={type === "MCQ"}
//             hint={type === "MCQ" ? "Required for MCQ questions." : undefined}
//             value={explanation}
//             onChange={(e) => setExplanation(e.target.value)}
//           />
//           <Input
//             label="Tags"
//             hint="Comma separated"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             placeholder="arrays, sorting, recursion"
//           />

//           {editing && (
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label="Marks"
//                 type="number"
//                 min={0}
//                 value={marks}
//                 onChange={(e) => setMarks(e.target.value)}
//               />
//               <Input
//                 label="Negative marks"
//                 type="number"
//                 min={0}
//                 value={negativeMarks}
//                 onChange={(e) => setNegativeMarks(e.target.value)}
//               />
//             </div>
//           )}

//           {type === "NUMERICAL" && (
//             <Input
//               label="Correct answer"
//               type="number"
//               step="any"
//               required
//               hint="Used to auto-grade this question. Answers within 0.01 are accepted as correct."
//               value={numericalAnswer}
//               onChange={(e) => setNumericalAnswer(e.target.value)}
//             />
//           )}

//           {NEEDS_OPTIONS.includes(type) && editing && (
//             <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
//               <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
//                 Options
//               </p>
//               {options.map((opt, idx) => (
//                 <div
//                   key={idx}
//                   className="flex flex-col gap-1.5 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800"
//                 >
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={opt.isCorrect}
//                       onChange={(e) =>
//                         updateOption(idx, { isCorrect: e.target.checked })
//                       }
//                       className="h-4 w-4 shrink-0 rounded border-slate-300"
//                       title="Correct answer"
//                     />
//                     <input
//                       className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
//                       placeholder={`Option ${idx + 1}`}
//                       value={opt.optionText}
//                       onChange={(e) =>
//                         updateOption(idx, { optionText: e.target.value })
//                       }
//                     />
//                     <label
//                       className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
//                       title="Attach image to this option"
//                     >
//                       🖼️
//                       <input
//                         type="file"
//                         accept="image/jpeg,image/png,image/webp,image/gif"
//                         className="hidden"
//                         disabled={uploadingImage === `option-${idx}`}
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             handleImageUpload(`option-${idx}`, file, (url) =>
//                               updateOption(idx, { imageUrl: url }),
//                             );
//                           }
//                           e.target.value = "";
//                         }}
//                       />
//                     </label>
//                     <button
//                       type="button"
//                       onClick={() => removeOption(idx)}
//                       className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                   {uploadingImage === `option-${idx}` && (
//                     <p className="pl-6 text-xs text-slate-500 dark:text-slate-400">
//                       Uploading…
//                     </p>
//                   )}
//                   {opt.imageUrl && (
//                     <div className="relative ml-6 w-fit">
//                       <img
//                         src={assetUrl(opt.imageUrl)}
//                         alt={`Option ${idx + 1} diagram`}
//                         className="max-h-24 rounded-lg border border-slate-200 dark:border-slate-800"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           updateOption(idx, { imageUrl: undefined })
//                         }
//                         className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white shadow"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={addOption}
//               >
//                 + Add option
//               </Button>
//             </div>
//           )}
//           {NEEDS_OPTIONS.includes(type) && !editing && (
//             <Alert variant="info">
//               Save the question first, then edit it to add answer options and
//               marks.
//             </Alert>
//           )}

//           <div className="mt-2 flex justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" loading={saving}>
//               {editing ? "Save changes" : "Create"}
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, assetUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type {
  Question,
  QuestionOption,
  QuestionType,
  DifficultyLevel,
} from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";
import { MathText } from "@/components/ui/MathText";
import { Modal } from "@/components/ui/Modal";

const QUESTION_TYPES: QuestionType[] = [
  "MCQ",
  "MULTIPLE_SELECT",
  "TRUE_FALSE",
  "NUMERICAL",
  "SHORT_ANSWER",
  "LONG_ANSWER",
  "CODING",
];
const DIFFICULTIES: DifficultyLevel[] = ["EASY", "MEDIUM", "HARD"];
const NEEDS_OPTIONS: QuestionType[] = ["MCQ", "MULTIPLE_SELECT", "TRUE_FALSE"];

function extractList(raw: unknown): Question[] {
  if (Array.isArray(raw)) return raw as Question[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as Question[];
    }
  }
  return [];
}

function emptyOption(order: number): QuestionOption {
  return { optionText: "", isCorrect: false, displayOrder: order };
}

export default function QuestionsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";
  const [items, setItems] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [examOptions, setExamOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<QuestionType>("MCQ");
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("MEDIUM");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");
  const [marks, setMarks] = useState("1");
  const [negativeMarks, setNegativeMarks] = useState("0");
  const [numericalAnswer, setNumericalAnswer] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [options, setOptions] = useState<QuestionOption[]>([
    emptyOption(1),
    emptyOption(2),
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      if (examFilter) {
        const exam = await api.get<{
          examQuestions?: { question: Question; displayOrder: number }[];
        }>(`/exams/${examFilter}/preview`);
        const questions = (exam.examQuestions || [])
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((eq) => eq.question);
        setItems(questions);
        setTotalPages(1);
        setTotal(questions.length);
      } else {
        const res = await api.get<{
          questions: Question[];
          pagination: { page: number; totalPages: number; total: number };
        }>("/questions", {
          search: search || undefined,
          type: typeFilter || undefined,
          page: 1,
          limit: 20,
        });
        setItems(res.questions || []);
        setTotalPages(res.pagination?.totalPages ?? 1);
        setTotal(res.pagination?.total ?? (res.questions || []).length);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, examFilter]);

  const loadMore = async () => {
    if (examFilter) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await api.get<{
        questions: Question[];
        pagination: { page: number; totalPages: number; total: number };
      }>("/questions", {
        search: search || undefined,
        type: typeFilter || undefined,
        page: nextPage,
        limit: 20,
      });
      setItems((prev) => [...prev, ...(res.questions || [])]);
      setPage(nextPage);
      setTotalPages(res.pagination?.totalPages ?? nextPage);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load more questions.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isStudent) return;
    api
      .get<unknown>("/exams")
      .then((res) => {
        const exams = extractList(res) as unknown as {
          id: string;
          title: string;
        }[];
        setExamOptions(exams.map((e) => ({ value: e.id, label: e.title })));
      })
      .catch(() => setExamOptions([]));
  }, [isStudent]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("MCQ");
    setDifficulty("MEDIUM");
    setChapter("");
    setTopic("");
    setExplanation("");
    setTags("");
    setMarks("1");
    setNegativeMarks("0");
    setNumericalAnswer("");
    setImageUrl("");
    setOptions([emptyOption(1), emptyOption(2)]);
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (q: Question) => {
    setEditing(q);
    setTitle(q.title);
    setDescription(q.description || "");
    setType(q.type);
    setDifficulty(q.difficulty || "MEDIUM");
    setChapter(q.chapter || "");
    setTopic(q.topic || "");
    setExplanation(q.explanation || "");
    setTags((q.tags || []).join(", "));
    setMarks(String(q.marks ?? 1));
    setNegativeMarks("0");
    setNumericalAnswer(q.type === "NUMERICAL" ? q.solution || "" : "");
    setImageUrl(q.imageUrl || "");
    setOptions(
      q.options && q.options.length > 0
        ? q.options
        : [emptyOption(1), emptyOption(2)],
    );
    setFormError(null);
    setModalOpen(true);
  };

  const updateOption = (idx: number, patch: Partial<QuestionOption>) => {
    setOptions((opts) =>
      opts.map((o, i) => (i === idx ? { ...o, ...patch } : o)),
    );
  };
  const addOption = () =>
    setOptions((opts) => [...opts, emptyOption(opts.length + 1)]);
  const removeOption = (idx: number) =>
    setOptions((opts) => opts.filter((_, i) => i !== idx));

  const handleImageUpload = async (
    key: string,
    file: File,
    onDone: (url: string) => void,
  ) => {
    setUploadingImage(key);
    setFormError(null);
    try {
      const res = await api.uploadImage("/questions/upload-image", file);
      onDone(res.url);
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Image upload failed.");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const needsOptions = NEEDS_OPTIONS.includes(type);
      const cleanOptions = options
        .filter((o) => o.optionText.trim())
        .map((o, i) => ({
          optionText: o.optionText,
          isCorrect: Boolean(o.isCorrect),
          displayOrder: i + 1,
          imageUrl: o.imageUrl || undefined,
        }));

      const solution =
        type === "NUMERICAL"
          ? numericalAnswer.trim() || undefined
          : needsOptions
            ? cleanOptions.find((o) => o.isCorrect)?.optionText
            : undefined;

      const base = {
        title,
        description: description || undefined,
        type,
        difficulty: difficulty || undefined,
        chapter: chapter || undefined,
        topic: topic || undefined,
        explanation: explanation || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        solution: type === "NUMERICAL" ? solution : undefined,
        imageUrl: imageUrl || undefined,
      };

      if (editing) {
        await api.patch(`/questions/${editing.id}`, {
          ...base,
          marks: Number(marks) || 1,
          negativeMarks: Number(negativeMarks) || 0,
          options: needsOptions ? cleanOptions : undefined,
          solution,
        });
      } else {
        const created = await api.post<Question>("/questions", base);
        if (needsOptions && cleanOptions.length > 0) {
          await api.patch(`/questions/${created.id}`, {
            marks: Number(marks) || 1,
            negativeMarks: Number(negativeMarks) || 0,
            options: cleanOptions,
            solution,
          });
        }
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q: Question) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/questions/${q.id}`);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to delete.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
            {isStudent ? "My Question Bank" : "Question Bank"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isStudent
              ? "Your personal practice questions — separate from your teacher's shared bank."
              : "Create and organize questions used across your exams."}
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          + Add Question
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:flex-1"
            disabled={Boolean(examFilter)}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="sm:w-56"
            disabled={Boolean(examFilter)}
          >
            <option value="">All types</option>
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replaceAll("_", " ")}
              </option>
            ))}
          </Select>
          {!isStudent && (
            <Select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="sm:w-64"
            >
              <option value="">All questions (not tied to an exam)</option>
              {examOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  📝 {o.label}
                </option>
              ))}
            </Select>
          )}
        </div>
        {examFilter && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Showing questions attached to this exam, in exam order. Clear the
            exam filter to search the full question bank.
          </p>
        )}
      </Card>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="No questions found"
          description="Try adjusting filters or add a new question."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((q) => (
            <Card key={q.id}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                {q.imageUrl && (
                  <img
                    src={assetUrl(q.imageUrl)}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-800"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>
                    {q.difficulty && (
                      <Badge color="amber">{q.difficulty}</Badge>
                    )}
                    {q.aiGenerated && <Badge color="blue">AI</Badge>}
                    {q.imageUrl && <Badge color="slate">🖼️ has image</Badge>}
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    <MathText text={q.title} />
                  </p>
                  {(q.chapter || q.topic) && (
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {[q.chapter, q.topic].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(q)}
                  >
                    Edit
                  </Button>
                  {!examFilter && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(q)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && !examFilter && items.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {items.length} of {total} question{total === 1 ? "" : "s"}
          </p>
          {page < totalPages && (
            <Button
              variant="outline"
              size="sm"
              loading={loadingMore}
              onClick={loadMore}
            >
              Load more
            </Button>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Question" : "Add Question"}
        wide
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <Input
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description / question body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Diagram / image (optional)
            </label>
            {imageUrl && (
              <div className="relative w-fit">
                <img
                  src={assetUrl(imageUrl)}
                  alt="Question diagram"
                  className="max-h-40 rounded-lg border border-slate-200 dark:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white shadow"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploadingImage === "question"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload("question", file, setImageUrl);
                e.target.value = "";
              }}
              className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 dark:text-slate-300 dark:file:bg-indigo-950 dark:file:text-indigo-300"
            />
            {uploadingImage === "question" && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uploading…
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Type"
              required
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType)}
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Input
              label="Chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            />
            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Textarea
            label="Explanation"
            required={type === "MCQ"}
            hint={type === "MCQ" ? "Required for MCQ questions." : undefined}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          <Input
            label="Tags"
            hint="Comma separated"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="arrays, sorting, recursion"
          />

          {editing && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Marks"
                type="number"
                min={0}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
              <Input
                label="Negative marks"
                type="number"
                min={0}
                value={negativeMarks}
                onChange={(e) => setNegativeMarks(e.target.value)}
              />
            </div>
          )}

          {type === "NUMERICAL" && (
            <Input
              label="Correct answer"
              type="number"
              step="any"
              required
              hint="Used to auto-grade this question. Answers within 0.01 are accepted as correct."
              value={numericalAnswer}
              onChange={(e) => setNumericalAnswer(e.target.value)}
            />
          )}

          {NEEDS_OPTIONS.includes(type) && editing && (
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Options
              </p>
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1.5 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        updateOption(idx, { isCorrect: e.target.checked })
                      }
                      className="h-4 w-4 shrink-0 rounded border-slate-300"
                      title="Correct answer"
                    />
                    <input
                      className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                      placeholder={`Option ${idx + 1}`}
                      value={opt.optionText}
                      onChange={(e) =>
                        updateOption(idx, { optionText: e.target.value })
                      }
                    />
                    <label
                      className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      title="Attach image to this option"
                    >
                      🖼️
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingImage === `option-${idx}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(`option-${idx}`, file, (url) =>
                              updateOption(idx, { imageUrl: url }),
                            );
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      ✕
                    </button>
                  </div>
                  {uploadingImage === `option-${idx}` && (
                    <p className="pl-6 text-xs text-slate-500 dark:text-slate-400">
                      Uploading…
                    </p>
                  )}
                  {opt.imageUrl && (
                    <div className="relative ml-6 w-fit">
                      <img
                        src={assetUrl(opt.imageUrl)}
                        alt={`Option ${idx + 1} diagram`}
                        className="max-h-24 rounded-lg border border-slate-200 dark:border-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateOption(idx, { imageUrl: undefined })
                        }
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white shadow"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOption}
              >
                + Add option
              </Button>
            </div>
          )}
          {NEEDS_OPTIONS.includes(type) && !editing && (
            <Alert variant="info">
              Save the question first, then edit it to add answer options and
              marks.
            </Alert>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}