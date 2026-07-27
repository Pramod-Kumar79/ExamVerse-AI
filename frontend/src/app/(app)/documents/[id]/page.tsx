// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { api, ApiError } from "@/lib/api";
// import type { UploadedDocument } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";
// import { MathText } from "@/components/ui/MathText";
// import { Modal } from "@/components/ui/Modal";
// import { Input, Textarea, Select } from "@/components/ui/Field";

// interface ExtractedOption {
//   label: string;
//   text: string;
//   isCorrect: boolean;
// }
// interface ExtractedQuestion {
//   questionNumber: number;
//   questionType: string;
//   subject?: string | null;
//   chapter?: string | null;
//   topic?: string | null;
//   difficulty: string;
//   title: string;
//   description?: string | null;
//   options: ExtractedOption[];
//   correctAnswer?: string | null;
//   explanation?: string | null;
//   marks?: number | null;
//   negativeMarks?: number | null;
//   confidence: number;
//   tags: string[];
//   language: string;
// }

// export default function DocumentDetailPage() {
//   const params = useParams<{ id: string }>();
//   const id = params.id;

//   const [doc, setDoc] = useState<UploadedDocument | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [analyzing, setAnalyzing] = useState(false);
//   const [analyzedText, setAnalyzedText] = useState<string | null>(null);
//   const [analysisDebug, setAnalysisDebug] = useState<string | null>(null);
//   const [requiresOcr, setRequiresOcr] = useState(false);

//   const [runningOcr, setRunningOcr] = useState(false);
//   const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);

//   const [extracting, setExtracting] = useState(false);
//   const [extractAttempted, setExtractAttempted] = useState(false);
//   const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
//   const [savedIdx, setSavedIdx] = useState<Set<number>>(new Set());
//   const [savingIdx, setSavingIdx] = useState<number | null>(null);

//   const [editingIdx, setEditingIdx] = useState<number | null>(null);
//   const [editForm, setEditForm] = useState<ExtractedQuestion | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<UploadedDocument>(`/documents/${id}`);
//       setDoc(res);
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to load document.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handleAnalyze = async () => {
//     setAnalyzing(true);
//     setError(null);
//     setRequiresOcr(false);
//     setOcrConfidence(null);
//     try {
//       const res = await api.post<{
//         text?: string;
//         content?: string;
//         requiresOcr?: boolean;
//         contentType?: string;
//         pages?: { pageNumber: number; text: string; hasText: boolean }[];
//         [k: string]: unknown;
//       }>(`/pdf-processing/${id}/analyze`);

//       const pagesText = (res.pages || [])
//         .map((p) => p.text)
//         .filter(Boolean)
//         .join("\n\n");

//       const text = res.text || res.content || pagesText || "";
//       setAnalyzedText(text);
//       setAnalysisDebug(text ? null : JSON.stringify(res, null, 2));
//       setRequiresOcr(Boolean(res.requiresOcr) || res.contentType === "SCANNED");
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to analyze document.",
//       );
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const handleRunOcr = async () => {
//     setRunningOcr(true);
//     setError(null);
//     try {
//       const res = await api.post<{
//         metadata: { averageConfidence: number };
//         pages: { pageNumber: number; text: string }[];
//       }>(`/ocr/documents/${id}/extract`);
//       const combined = res.pages.map((p) => p.text).join("\n\n");
//       setAnalyzedText(combined);
//       setAnalysisDebug(null);
//       setRequiresOcr(false);
//       setOcrConfidence(res.metadata?.averageConfidence ?? null);
//     } catch (e) {
//       setError(
//         e instanceof ApiError
//           ? e.message
//           : "OCR failed. This can take longer for large or low-quality scans — try again if it timed out.",
//       );
//     } finally {
//       setRunningOcr(false);
//     }
//   };

//   const handleExtract = async () => {
//     if (!analyzedText) return;
//     setExtracting(true);
//     setError(null);
//     setExtractAttempted(false);
//     try {
//       const res = await api.post<{ questions: ExtractedQuestion[] }>(
//         "/ai/extract-questions",
//         {
//           documentId: id,
//           text: analyzedText,
//         },
//       );
//       setQuestions(res.questions || []);
//       setSavedIdx(new Set());
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to extract questions.",
//       );
//     } finally {
//       setExtracting(false);
//       setExtractAttempted(true);
//     }
//   };

//   const addToBank = async (q: ExtractedQuestion, idx: number) => {
//     setSavingIdx(idx);
//     setError(null);
//     try {
//       const created = await api.post<{ id: string }>("/questions", {
//         title: q.title,
//         description: q.description || undefined,
//         type: q.questionType,
//         difficulty: q.difficulty,
//         chapter: q.chapter || undefined,
//         topic: q.topic || undefined,
//         explanation:
//           q.explanation ||
//           (q.questionType === "MCQ" ? "See correct option." : undefined),
//         tags: q.tags,
//         aiGenerated: true,
//       });
//       const opts = q.options?.map((o, i) => ({
//         optionText: o.text,
//         isCorrect: o.isCorrect,
//         displayOrder: i + 1,
//       }));
//       const correctOption = opts?.find((o) => o.isCorrect);
//       const solution =
//         q.questionType === "NUMERICAL"
//           ? q.correctAnswer || undefined
//           : correctOption?.optionText || q.correctAnswer || undefined;

//       const safeMarks = Math.max(1, Math.round(q.marks ?? 1) || 1);
//       const safeNegativeMarks = Math.max(
//         0,
//         Math.round(Math.abs(q.negativeMarks ?? 0)),
//       );

//       if (opts && opts.length > 0) {
//         await api.patch(`/questions/${created.id}`, {
//           marks: safeMarks,
//           negativeMarks: safeNegativeMarks,
//           options: opts,
//           solution,
//         });
//       } else if (solution) {
//         await api.patch(`/questions/${created.id}`, { solution });
//       }
//       setSavedIdx((s) => new Set(s).add(idx));
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to save question.");
//     } finally {
//       setSavingIdx(null);
//     }
//   };

//   const openEditExtracted = (idx: number) => {
//     setEditingIdx(idx);
//     setEditForm(structuredClone(questions[idx]));
//   };

//   const saveEditExtracted = () => {
//     if (editingIdx === null || !editForm) return;
//     setQuestions((qs) => qs.map((q, i) => (i === editingIdx ? editForm : q)));
//     setEditingIdx(null);
//     setEditForm(null);
//   };

//   const updateEditOption = (
//     optIdx: number,
//     patch: Partial<ExtractedOption>,
//   ) => {
//     setEditForm((f) =>
//       f
//         ? {
//             ...f,
//             options: f.options.map((o, i) =>
//               i === optIdx ? { ...o, ...patch } : o,
//             ),
//           }
//         : f,
//     );
//   };

//   const addEditOption = () => {
//     setEditForm((f) =>
//       f
//         ? {
//             ...f,
//             options: [
//               ...f.options,
//               {
//                 label: String.fromCharCode(97 + f.options.length),
//                 text: "",
//                 isCorrect: false,
//               },
//             ],
//           }
//         : f,
//     );
//   };

//   const removeEditOption = (optIdx: number) => {
//     setEditForm((f) =>
//       f ? { ...f, options: f.options.filter((_, i) => i !== optIdx) } : f,
//     );
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="flex flex-col gap-5">
//       <div>
//         <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//           {doc?.originalName || "Document"}
//         </h1>
//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           Status: <Badge>{doc?.status}</Badge>
//         </p>
//       </div>

//       {error && <Alert>{error}</Alert>}

//       <Card>
//         <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//           Step 1 · Analyze document
//         </h2>
//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           Extract raw text and metadata from the uploaded PDF.
//         </p>
//         <Button className="mt-3" onClick={handleAnalyze} loading={analyzing}>
//           Analyze with AI
//         </Button>
//         {analyzedText && (
//           <div className="mt-4 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
//             {analyzedText.slice(0, 4000)}
//             {analyzedText.length > 4000 ? "…" : ""}
//           </div>
//         )}
//         {!analyzedText && analysisDebug && (
//           <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
//             No text layer found. Raw analysis result:
//             {"\n"}
//             {analysisDebug}
//           </div>
//         )}
//       </Card>

//       {requiresOcr && (
//         <Card className="border-amber-300 dark:border-amber-800">
//           <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//             📷 Scanned document detected
//           </h2>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             This PDF has no embedded text layer (it&apos;s an image scan), so no
//             text could be read directly. Run OCR to extract text from the page
//             images instead. This can take a little while depending on the number
//             of pages.
//           </p>
//           <Button className="mt-3" onClick={handleRunOcr} loading={runningOcr}>
//             Run OCR
//           </Button>
//           {ocrConfidence !== null && (
//             <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//               OCR average confidence: {Math.round(ocrConfidence * 100)}%
//               {ocrConfidence < 0.6 &&
//                 " — text quality may be low, double-check the results below."}
//             </p>
//           )}
//         </Card>
//       )}

//       {analyzedText && (
//         <Card>
//           <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//             Step 2 · Extract questions with AI
//           </h2>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Gemini will read the extracted text and structure it into individual
//             questions.
//           </p>
//           <Button className="mt-3" onClick={handleExtract} loading={extracting}>
//             Extract questions
//           </Button>
//         </Card>
//       )}

//       {extractAttempted && questions.length === 0 && (
//         <EmptyState
//           title="No questions found in this document"
//           description="This can happen with mark schemes / answer keys, scanned image-only PDFs, or documents that don't use a clear numbered-question format. Try a document that contains the actual question text, or check the analyzed text above to see what AI actually read from the file."
//         />
//       )}

//       {questions.length > 0 && (
//         <div className="flex flex-col gap-3">
//           <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//             Step 3 · Review &amp; add to question bank ({questions.length}{" "}
//             found)
//           </h2>
//           <Alert variant="info">
//             AI extraction only reads the text of this document — it can&apos;t
//             detect or pull out diagrams, graphs, or figures from the PDF. If a
//             question below relies on a diagram, add it to the bank first, then
//             open it from the Question Bank and attach the image there.
//           </Alert>
//           {questions.map((q, idx) => (
//             <Card key={idx}>
//               <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
//                 <div className="min-w-0 flex-1">
//                   <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
//                     <Badge color="indigo">
//                       {q.questionType.replaceAll("_", " ")}
//                     </Badge>
//                     <Badge color="amber">{q.difficulty}</Badge>
//                     <Badge color="slate">
//                       {Math.round(q.confidence * 100)}% confidence
//                     </Badge>
//                   </div>
//                   <p className="font-medium text-slate-900 dark:text-white">
//                     {q.questionNumber}. <MathText text={q.title} />
//                   </p>
//                   {q.options?.length > 0 && (
//                     <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
//                       {q.options.map((o) => (
//                         <li
//                           key={o.label}
//                           className={
//                             o.isCorrect
//                               ? "font-medium text-emerald-600 dark:text-emerald-400"
//                               : ""
//                           }
//                         >
//                           {o.label}. <MathText text={o.text} />{" "}
//                           {o.isCorrect && "✓"}
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//                 <div className="flex shrink-0 gap-2">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     disabled={savedIdx.has(idx)}
//                     onClick={() => openEditExtracted(idx)}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={savedIdx.has(idx) ? "outline" : "primary"}
//                     disabled={savedIdx.has(idx)}
//                     loading={savingIdx === idx}
//                     onClick={() => addToBank(q, idx)}
//                   >
//                     {savedIdx.has(idx) ? "Added ✓" : "Add to bank"}
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Modal
//         open={editingIdx !== null}
//         onClose={() => {
//           setEditingIdx(null);
//           setEditForm(null);
//         }}
//         title="Edit Extracted Question"
//         wide
//       >
//         {editForm && (
//           <div className="flex flex-col gap-4">
//             <Input
//               label="Title"
//               value={editForm.title}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, title: e.target.value })
//               }
//             />
//             <Textarea
//               label="Description / additional context"
//               value={editForm.description || ""}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, description: e.target.value })
//               }
//             />
//             <div className="grid grid-cols-2 gap-4">
//               <Select
//                 label="Difficulty"
//                 value={editForm.difficulty}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, difficulty: e.target.value })
//                 }
//               >
//                 <option value="EASY">EASY</option>
//                 <option value="MEDIUM">MEDIUM</option>
//                 <option value="HARD">HARD</option>
//               </Select>
//               <Input
//                 label="Marks"
//                 type="number"
//                 value={editForm.marks ?? 1}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, marks: Number(e.target.value) })
//                 }
//               />
//               <Input
//                 label="Chapter"
//                 value={editForm.chapter || ""}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, chapter: e.target.value })
//                 }
//               />
//               <Input
//                 label="Topic"
//                 value={editForm.topic || ""}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, topic: e.target.value })
//                 }
//               />
//             </div>

//             {editForm.options && editForm.options.length > 0 ? (
//               <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
//                 <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
//                   Options
//                 </p>
//                 {editForm.options.map((opt, optIdx) => (
//                   <div key={optIdx} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={opt.isCorrect}
//                       onChange={(e) =>
//                         updateEditOption(optIdx, {
//                           isCorrect: e.target.checked,
//                         })
//                       }
//                       className="h-4 w-4 shrink-0 rounded border-slate-300"
//                       title="Correct answer"
//                     />
//                     <input
//                       className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
//                       placeholder={`Option ${opt.label}`}
//                       value={opt.text}
//                       onChange={(e) =>
//                         updateEditOption(optIdx, { text: e.target.value })
//                       }
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeEditOption(optIdx)}
//                       className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//                 <Button
//                   type="button"
//                   size="sm"
//                   variant="outline"
//                   onClick={addEditOption}
//                 >
//                   + Add option
//                 </Button>
//               </div>
//             ) : (
//               <Input
//                 label="Correct answer"
//                 hint="Used to auto-grade this question."
//                 value={editForm.correctAnswer || ""}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, correctAnswer: e.target.value })
//                 }
//               />
//             )}

//             <Textarea
//               label="Explanation"
//               value={editForm.explanation || ""}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, explanation: e.target.value })
//               }
//             />

//             <div className="flex justify-end gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setEditingIdx(null);
//                   setEditForm(null);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={saveEditExtracted}>Save changes</Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, ApiError, assetUrl } from "@/lib/api";
import type { UploadedDocument } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";
import { MathText } from "@/components/ui/MathText";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Field";

interface ExtractedOption {
  label: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
}
interface ExtractedQuestion {
  questionNumber: number;
  questionType: string;
  subject?: string | null;
  chapter?: string | null;
  topic?: string | null;
  difficulty: string;
  title: string;
  description?: string | null;
  options: ExtractedOption[];
  correctAnswer?: string | null;
  explanation?: string | null;
  marks?: number | null;
  negativeMarks?: number | null;
  confidence: number;
  tags: string[];
  language: string;
  imageUrl?: string;
}

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [doc, setDoc] = useState<UploadedDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedText, setAnalyzedText] = useState<string | null>(null);
  const [analysisDebug, setAnalysisDebug] = useState<string | null>(null);
  const [requiresOcr, setRequiresOcr] = useState(false);

  const [runningOcr, setRunningOcr] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);

  const [extracting, setExtracting] = useState(false);
  const [extractAttempted, setExtractAttempted] = useState(false);
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [savedIdx, setSavedIdx] = useState<Set<number>>(new Set());
  const [savingIdx, setSavingIdx] = useState<number | null>(null);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ExtractedQuestion | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<UploadedDocument>(`/documents/${id}`);
      setDoc(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load document.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setRequiresOcr(false);
    setOcrConfidence(null);
    try {
      const res = await api.post<{
        text?: string;
        content?: string;
        requiresOcr?: boolean;
        contentType?: string;
        pages?: { pageNumber: number; text: string; hasText: boolean }[];
        [k: string]: unknown;
      }>(`/pdf-processing/${id}/analyze`);

      const pagesText = (res.pages || [])
        .map((p) => p.text)
        .filter(Boolean)
        .join("\n\n");

      const text = res.text || res.content || pagesText || "";
      setAnalyzedText(text);
      setAnalysisDebug(text ? null : JSON.stringify(res, null, 2));
      setRequiresOcr(Boolean(res.requiresOcr) || res.contentType === "SCANNED");
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to analyze document.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunOcr = async () => {
    setRunningOcr(true);
    setError(null);
    try {
      const res = await api.post<{
        metadata: { averageConfidence: number };
        pages: { pageNumber: number; text: string }[];
      }>(`/ocr/documents/${id}/extract`);
      const combined = res.pages.map((p) => p.text).join("\n\n");
      setAnalyzedText(combined);
      setAnalysisDebug(null);
      setRequiresOcr(false);
      setOcrConfidence(res.metadata?.averageConfidence ?? null);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : "OCR failed. This can take longer for large or low-quality scans — try again if it timed out.",
      );
    } finally {
      setRunningOcr(false);
    }
  };

  const handleExtract = async () => {
    if (!analyzedText) return;
    setExtracting(true);
    setError(null);
    setExtractAttempted(false);
    try {
      const res = await api.post<{ questions: ExtractedQuestion[] }>(
        "/ai/extract-questions",
        {
          documentId: id,
          text: analyzedText,
        },
      );
      setQuestions(res.questions || []);
      setSavedIdx(new Set());
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to extract questions.",
      );
    } finally {
      setExtracting(false);
      setExtractAttempted(true);
    }
  };

  const addToBank = async (q: ExtractedQuestion, idx: number) => {
    setSavingIdx(idx);
    setError(null);
    try {
      const created = await api.post<{ id: string }>("/questions", {
        title: q.title,
        description: q.description || undefined,
        type: q.questionType,
        difficulty: q.difficulty,
        chapter: q.chapter || undefined,
        topic: q.topic || undefined,
        explanation:
          q.explanation ||
          (q.questionType === "MCQ" ? "See correct option." : undefined),
        tags: q.tags,
        aiGenerated: true,
        imageUrl: q.imageUrl || undefined,
      });
      const opts = q.options?.map((o, i) => ({
        optionText: o.text,
        isCorrect: o.isCorrect,
        displayOrder: i + 1,
        imageUrl: o.imageUrl || undefined,
      }));
      const correctOption = opts?.find((o) => o.isCorrect);
      const solution =
        q.questionType === "NUMERICAL"
          ? q.correctAnswer || undefined
          : correctOption?.optionText || q.correctAnswer || undefined;

      const safeMarks = Math.max(1, Math.round(q.marks ?? 1) || 1);
      const safeNegativeMarks = Math.max(
        0,
        Math.round(Math.abs(q.negativeMarks ?? 0)),
      );

      if (opts && opts.length > 0) {
        await api.patch(`/questions/${created.id}`, {
          marks: safeMarks,
          negativeMarks: safeNegativeMarks,
          options: opts,
          solution,
        });
      } else if (solution) {
        await api.patch(`/questions/${created.id}`, { solution });
      }
      setSavedIdx((s) => new Set(s).add(idx));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save question.");
    } finally {
      setSavingIdx(null);
    }
  };

  const openEditExtracted = (idx: number) => {
    setEditingIdx(idx);
    setEditForm(structuredClone(questions[idx]));
  };

  const saveEditExtracted = () => {
    if (editingIdx === null || !editForm) return;
    setQuestions((qs) => qs.map((q, i) => (i === editingIdx ? editForm : q)));
    setEditingIdx(null);
    setEditForm(null);
  };

  const updateEditOption = (
    optIdx: number,
    patch: Partial<ExtractedOption>,
  ) => {
    setEditForm((f) =>
      f
        ? {
            ...f,
            options: f.options.map((o, i) =>
              i === optIdx ? { ...o, ...patch } : o,
            ),
          }
        : f,
    );
  };

  const addEditOption = () => {
    setEditForm((f) =>
      f
        ? {
            ...f,
            options: [
              ...f.options,
              {
                label: String.fromCharCode(97 + f.options.length),
                text: "",
                isCorrect: false,
              },
            ],
          }
        : f,
    );
  };

  const removeEditOption = (optIdx: number) => {
    setEditForm((f) =>
      f ? { ...f, options: f.options.filter((_, i) => i !== optIdx) } : f,
    );
  };

  const handleEditImageUpload = async (
    key: string,
    file: File,
    onDone: (url: string) => void,
  ) => {
    setUploadingImage(key);
    setError(null);
    try {
      const res = await api.uploadImage("/questions/upload-image", file);
      onDone(res.url);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Image upload failed.");
    } finally {
      setUploadingImage(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          {doc?.originalName || "Document"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Status: <Badge>{doc?.status}</Badge>
        </p>
      </div>

      {error && <Alert>{error}</Alert>}

      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Step 1 · Analyze document
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Extract raw text and metadata from the uploaded PDF.
        </p>
        <Button className="mt-3" onClick={handleAnalyze} loading={analyzing}>
          Analyze with AI
        </Button>
        {analyzedText && (
          <div className="mt-4 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {analyzedText.slice(0, 4000)}
            {analyzedText.length > 4000 ? "…" : ""}
          </div>
        )}
        {!analyzedText && analysisDebug && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500">
            No text layer found. Raw analysis result:
            {"\n"}
            {analysisDebug}
          </div>
        )}
      </Card>

      {requiresOcr && (
        <Card className="border-amber-300 dark:border-amber-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            📷 Scanned document detected
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This PDF has no embedded text layer (it&apos;s an image scan), so no
            text could be read directly. Run OCR to extract text from the page
            images instead. This can take a little while depending on the number
            of pages.
          </p>
          <Button className="mt-3" onClick={handleRunOcr} loading={runningOcr}>
            Run OCR
          </Button>
          {ocrConfidence !== null && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              OCR average confidence: {Math.round(ocrConfidence * 100)}%
              {ocrConfidence < 0.6 &&
                " — text quality may be low, double-check the results below."}
            </p>
          )}
        </Card>
      )}

      {analyzedText && (
        <Card>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Step 2 · Extract questions with AI
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gemini will read the extracted text and structure it into individual
            questions.
          </p>
          <Button className="mt-3" onClick={handleExtract} loading={extracting}>
            Extract questions
          </Button>
        </Card>
      )}

      {extractAttempted && questions.length === 0 && (
        <EmptyState
          title="No questions found in this document"
          description="This can happen with mark schemes / answer keys, scanned image-only PDFs, or documents that don't use a clear numbered-question format. Try a document that contains the actual question text, or check the analyzed text above to see what AI actually read from the file."
        />
      )}

      {questions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Step 3 · Review &amp; add to question bank ({questions.length}{" "}
            found)
          </h2>
          <Alert variant="info">
            AI extraction only reads the text of this document — it can&apos;t
            detect or pull out diagrams, graphs, or figures from the PDF. If a
            question below relies on a diagram, add it to the bank first, then
            open it from the Question Bank and attach the image there.
          </Alert>
          {questions.map((q, idx) => (
            <Card key={idx}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge color="indigo">
                      {q.questionType.replaceAll("_", " ")}
                    </Badge>
                    <Badge color="amber">{q.difficulty}</Badge>
                    <Badge color="slate">
                      {Math.round(q.confidence * 100)}% confidence
                    </Badge>
                    {q.imageUrl && (
                      <Badge color="green">🖼️ image attached</Badge>
                    )}
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {q.questionNumber}. <MathText text={q.title} />
                  </p>
                  {q.imageUrl && (
                    <img
                      src={assetUrl(q.imageUrl)}
                      alt="Question diagram"
                      className="mt-2 max-h-40 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  )}
                  {q.options?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      {q.options.map((o) => (
                        <li
                          key={o.label}
                          className={
                            o.isCorrect
                              ? "font-medium text-emerald-600 dark:text-emerald-400"
                              : ""
                          }
                        >
                          {o.label}. <MathText text={o.text} />{" "}
                          {o.isCorrect && "✓"}
                          {o.imageUrl && (
                            <img
                              src={assetUrl(o.imageUrl)}
                              alt=""
                              className="mt-1 max-h-24 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={savedIdx.has(idx)}
                    onClick={() => openEditExtracted(idx)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={savedIdx.has(idx) ? "outline" : "primary"}
                    disabled={savedIdx.has(idx)}
                    loading={savingIdx === idx}
                    onClick={() => addToBank(q, idx)}
                  >
                    {savedIdx.has(idx) ? "Added ✓" : "Add to bank"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={editingIdx !== null}
        onClose={() => {
          setEditingIdx(null);
          setEditForm(null);
        }}
        title="Edit Extracted Question"
        wide
      >
        {editForm && (
          <div className="flex flex-col gap-4">
            <Input
              label="Title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
            />
            <Textarea
              label="Description / additional context"
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Diagram / image (optional)
              </label>
              {editForm.imageUrl && (
                <div className="relative w-fit">
                  <img
                    src={assetUrl(editForm.imageUrl)}
                    alt="Question diagram"
                    className="max-h-40 rounded-lg border border-slate-200 dark:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm({ ...editForm, imageUrl: undefined })
                    }
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
                  if (file) {
                    handleEditImageUpload("question", file, (url) =>
                      setEditForm((f) => (f ? { ...f, imageUrl: url } : f)),
                    );
                  }
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

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Difficulty"
                value={editForm.difficulty}
                onChange={(e) =>
                  setEditForm({ ...editForm, difficulty: e.target.value })
                }
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </Select>
              <Input
                label="Marks"
                type="number"
                value={editForm.marks ?? 1}
                onChange={(e) =>
                  setEditForm({ ...editForm, marks: Number(e.target.value) })
                }
              />
              <Input
                label="Chapter"
                value={editForm.chapter || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, chapter: e.target.value })
                }
              />
              <Input
                label="Topic"
                value={editForm.topic || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, topic: e.target.value })
                }
              />
            </div>

            {editForm.options && editForm.options.length > 0 ? (
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Options
                </p>
                {editForm.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex flex-col gap-1.5 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={opt.isCorrect}
                        onChange={(e) =>
                          updateEditOption(optIdx, {
                            isCorrect: e.target.checked,
                          })
                        }
                        className="h-4 w-4 shrink-0 rounded border-slate-300"
                        title="Correct answer"
                      />
                      <input
                        className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                        placeholder={`Option ${opt.label}`}
                        value={opt.text}
                        onChange={(e) =>
                          updateEditOption(optIdx, { text: e.target.value })
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
                          disabled={uploadingImage === `option-${optIdx}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleEditImageUpload(
                                `option-${optIdx}`,
                                file,
                                (url) =>
                                  updateEditOption(optIdx, { imageUrl: url }),
                              );
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeEditOption(optIdx)}
                        className="shrink-0 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        ✕
                      </button>
                    </div>
                    {uploadingImage === `option-${optIdx}` && (
                      <p className="pl-6 text-xs text-slate-500 dark:text-slate-400">
                        Uploading…
                      </p>
                    )}
                    {opt.imageUrl && (
                      <div className="relative ml-6 w-fit">
                        <img
                          src={assetUrl(opt.imageUrl)}
                          alt={`Option ${opt.label} diagram`}
                          className="max-h-24 rounded-lg border border-slate-200 dark:border-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateEditOption(optIdx, { imageUrl: undefined })
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
                  onClick={addEditOption}
                >
                  + Add option
                </Button>
              </div>
            ) : (
              <Input
                label="Correct answer"
                hint="Used to auto-grade this question."
                value={editForm.correctAnswer || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, correctAnswer: e.target.value })
                }
              />
            )}

            <Textarea
              label="Explanation"
              value={editForm.explanation || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, explanation: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingIdx(null);
                  setEditForm(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveEditExtracted}>Save changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}