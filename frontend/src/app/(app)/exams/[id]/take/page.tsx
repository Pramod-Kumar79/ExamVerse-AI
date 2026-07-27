// "use client";

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { api, ApiError } from "@/lib/api";
// import type { Exam, ExamAttempt } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Card, Spinner, Alert, Badge } from "@/components/ui/Misc";

// type AnswerValue = string | string[] | undefined;

// function fmtClock(seconds: number) {
//   const s = Math.max(0, Math.floor(seconds));
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   const h = Math.floor(m / 60);
//   const mm = m % 60;
//   if (h > 0)
//     return `${h}:${String(mm).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
//   return `${mm}:${String(r).padStart(2, "0")}`;
// }

// export default function TakeExamPage() {
//   return (
//     <Suspense fallback={<Spinner />}>
//       <TakeExamInner />
//     </Suspense>
//   );
// }

// function TakeExamInner() {
//   const searchParams = useSearchParams();
//   const attemptId = searchParams.get("attemptId");
//   const router = useRouter();

//   const [attempt, setAttempt] = useState<
//     (ExamAttempt & { exam?: Exam }) | null
//   >(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [resultAttempt, setResultAttempt] = useState<ExamAttempt | null>(null);
//   const [navOpen, setNavOpen] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
//   const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

//   const load = useCallback(async () => {
//     if (!attemptId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<ExamAttempt & { exam?: Exam }>(
//         `/exam-attempts/${attemptId}`,
//       );
//       setAttempt(res);
//       const initial: Record<string, AnswerValue> = {};
//       (res.answers || []).forEach((a) => {
//         initial[a.questionId] = a.answer as AnswerValue;
//       });
//       setAnswers(initial);
//       if (res.status && res.status !== "IN_PROGRESS") {
//         setSubmitted(true);
//         setResultAttempt(res);
//       }
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to load exam attempt.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [attemptId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const questions = useMemo(
//     () =>
//       (attempt?.exam?.examQuestions || [])
//         .slice()
//         .sort((a, b) => a.displayOrder - b.displayOrder),
//     [attempt],
//   );

//   const saveAnswer = (questionId: string, value: AnswerValue) => {
//     setAnswers((a) => ({ ...a, [questionId]: value }));
//     if (saveTimers.current[questionId])
//       clearTimeout(saveTimers.current[questionId]);
//     saveTimers.current[questionId] = setTimeout(async () => {
//       if (!attemptId) return;
//       try {
//         await api.patch(`/exam-attempts/${attemptId}/save-answer`, {
//           questionId,
//           answer: value,
//         });
//       } catch {
//         // silent — will retry on next change or submit
//       }
//     }, 500);
//   };

//   const handleSubmit = async (auto = false) => {
//     if (!attemptId || submitted) return;
//     if (
//       !auto &&
//       !confirm(
//         "Submit the exam now? You won't be able to change your answers after this.",
//       )
//     )
//       return;
//     setSubmitting(true);
//     try {
//       await api.post(`/exam-attempts/${attemptId}/submit`);
//       setSubmitted(true);
//       try {
//         const graded = await api.get<ExamAttempt>(
//           `/exam-attempts/${attemptId}`,
//         );
//         setResultAttempt(graded);
//       } catch {
//         // If this fails the confirmation screen still shows without a score.
//       }
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to submit exam.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     if (!attempt?.exam || !attempt.startedAt) return;
//     const durationMs = attempt.exam.durationMinutes * 60 * 1000;
//     const startMs = new Date(attempt.startedAt).getTime();
//     const tick = () => {
//       const remaining = Math.round((startMs + durationMs - Date.now()) / 1000);
//       setSecondsLeft(remaining);
//       if (remaining <= 0 && !submitted) {
//         handleSubmit(true);
//       }
//     };
//     tick();
//     const interval = setInterval(tick, 1000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [attempt, submitted]);

//   if (!attemptId)
//     return (
//       <Alert>Missing attempt reference. Please start the exam again.</Alert>
//     );
//   if (loading) return <Spinner />;
//   if (error && !attempt) return <Alert>{error}</Alert>;
//   if (!attempt?.exam) return <Alert>Could not load this exam attempt.</Alert>;

//   if (submitted) {
//     const totalMarks = attempt.exam.totalMarks;
//     const passingMarks = attempt.exam.passingMarks;
//     const score = resultAttempt?.score;
//     const hasScore = typeof score === "number";
//     const passed = hasScore && score >= passingMarks;
//     const showScore = attempt.exam.showResultImmediately !== false && hasScore;

//     const gradedAnswers = resultAttempt?.answers || attempt.answers || [];
//     const answerByQuestion = new Map(
//       gradedAnswers.map((a) => [a.questionId, a]),
//     );

//     return (
//       <div className="mx-auto flex max-w-2xl flex-col gap-5 py-8">
//         <div className="flex flex-col items-center gap-3 text-center">
//           <div className="text-4xl">
//             {showScore ? (passed ? "🎉" : "📝") : "✅"}
//           </div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//             Exam submitted!
//           </h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400">
//             Your answers for <strong>{attempt.exam.title}</strong> have been
//             recorded.
//           </p>

//           {showScore ? (
//             <Card className="w-full">
//               <p className="text-3xl font-bold text-slate-900 dark:text-white">
//                 {score}{" "}
//                 <span className="text-base font-normal text-slate-400">
//                   / {totalMarks}
//                 </span>
//               </p>
//               <Badge color={passed ? "green" : "red"}>
//                 {passed ? "Passed" : "Not passed"} (pass mark: {passingMarks})
//               </Badge>
//               <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
//                 Free-text or multi-select questions, if any, may still need
//                 manual grading by your teacher — this score reflects auto-graded
//                 questions only.
//               </p>
//             </Card>
//           ) : (
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Your teacher will share results once this exam has been evaluated.
//             </p>
//           )}

//           <Button onClick={() => router.push("/dashboard")}>
//             Back to dashboard
//           </Button>
//         </div>

//         {showScore && questions.length > 0 && (
//           <div className="flex flex-col gap-3">
//             <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//               Answer review
//             </h2>
//             {questions.map((eq, idx) => {
//               const q = eq.question;
//               const studentAnswer = answerByQuestion.get(q.id);
//               const rawAnswer = studentAnswer?.answer;
//               const obtainedMarks = studentAnswer?.obtainedMarks;
//               const hasOptions = Boolean(q.options && q.options.length > 0);
//               const solution = (q.solution || "").trim();
//               const gradable = ["MCQ", "TRUE_FALSE", "NUMERICAL"].includes(
//                 q.type,
//               );

//               return (
//                 <Card key={q.id}>
//                   <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//                     <div className="flex items-center gap-1.5">
//                       <Badge color="indigo">
//                         {q.type.replaceAll("_", " ")}
//                       </Badge>
//                       {gradable && typeof obtainedMarks === "number" && (
//                         <Badge
//                           color={
//                             obtainedMarks > 0
//                               ? "green"
//                               : obtainedMarks < 0
//                                 ? "red"
//                                 : "slate"
//                           }
//                         >
//                           {obtainedMarks > 0 ? "+" : ""}
//                           {obtainedMarks} mark
//                           {Math.abs(obtainedMarks) === 1 ? "" : "s"}
//                         </Badge>
//                       )}
//                       {!gradable && (
//                         <Badge color="amber">Needs manual grading</Badge>
//                       )}
//                     </div>
//                   </div>

//                   <p className="font-medium text-slate-900 dark:text-white">
//                     {idx + 1}. {q.title}
//                   </p>

//                   {hasOptions ? (
//                     <ul className="mt-3 space-y-1.5 text-sm">
//                       {q.options?.map((opt) => {
//                         const isCorrectOption = solution
//                           ? opt.optionText.trim() === solution
//                           : Boolean(opt.isCorrect);
//                         const isStudentChoice =
//                           typeof rawAnswer === "string"
//                             ? rawAnswer === opt.optionText
//                             : Array.isArray(rawAnswer)
//                               ? (rawAnswer as string[]).includes(opt.optionText)
//                               : false;

//                         return (
//                           <li
//                             key={opt.id}
//                             className={`rounded-lg border px-3 py-2 ${
//                               isCorrectOption
//                                 ? "border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
//                                 : isStudentChoice
//                                   ? "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
//                                   : "border-slate-200 dark:border-slate-800"
//                             }`}
//                           >
//                             {opt.optionText}
//                             {isCorrectOption && " ✓ Correct answer"}
//                             {isStudentChoice &&
//                               !isCorrectOption &&
//                               " ✗ Your answer"}
//                             {isStudentChoice &&
//                               isCorrectOption &&
//                               " (your answer)"}
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   ) : (
//                     <div className="mt-3 flex flex-col gap-2 text-sm">
//                       <div className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
//                         <span className="text-slate-500 dark:text-slate-400">
//                           Your answer:{" "}
//                         </span>
//                         <span className="text-slate-800 dark:text-slate-200">
//                           {(rawAnswer as string) || "(no answer given)"}
//                         </span>
//                       </div>
//                       {solution && (
//                         <div className="rounded-lg border border-emerald-400 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-950/30">
//                           <span className="text-slate-500 dark:text-slate-400">
//                             Correct answer:{" "}
//                           </span>
//                           <span className="text-slate-800 dark:text-slate-200">
//                             {solution}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {q.explanation && (
//                     <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
//                       <span className="font-medium text-slate-600 dark:text-slate-300">
//                         Explanation:{" "}
//                       </span>
//                       {q.explanation}
//                     </p>
//                   )}
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   }

//   const q = questions[current]?.question;
//   const value = q ? answers[q.id] : undefined;
//   const answeredCount = questions.filter((eq) => answers[eq.questionId]).length;

//   return (
//     <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
//       <div className="min-w-0 flex-1">
//         <Card className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h1 className="text-base font-semibold text-slate-900 dark:text-white">
//               {attempt.exam.title}
//             </h1>
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Question {current + 1} of {questions.length} • {answeredCount}{" "}
//               answered
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             {secondsLeft !== null && (
//               <Badge
//                 color={
//                   secondsLeft < 60
//                     ? "red"
//                     : secondsLeft < 300
//                       ? "amber"
//                       : "green"
//                 }
//               >
//                 ⏱ {fmtClock(secondsLeft)}
//               </Badge>
//             )}
//             <Button
//               size="sm"
//               variant="outline"
//               className="lg:hidden"
//               onClick={() => setNavOpen((v) => !v)}
//             >
//               {navOpen ? "Hide" : "Questions"}
//             </Button>
//           </div>
//         </Card>

//         {error && <Alert>{error}</Alert>}

//         {q && (
//           <Card>
//             <div className="mb-3 flex items-center gap-1.5">
//               <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>
//               <Badge color="slate">
//                 {questions[current].marks ?? q.marks ?? 1} marks
//               </Badge>
//             </div>
//             <p className="text-base font-medium text-slate-900 dark:text-white">
//               {q.title}
//             </p>
//             {q.description && (
//               <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
//                 {q.description}
//               </p>
//             )}

//             <div className="mt-4 flex flex-col gap-2">
//               {(q.type === "MCQ" || q.type === "TRUE_FALSE") &&
//                 q.options?.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
//                       value === opt.optionText
//                         ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
//                         : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={q.id}
//                       checked={value === opt.optionText}
//                       onChange={() => saveAnswer(q.id, opt.optionText)}
//                       className="h-4 w-4"
//                     />
//                     {opt.optionText}
//                   </label>
//                 ))}

//               {q.type === "MULTIPLE_SELECT" &&
//                 q.options?.map((opt) => {
//                   const selected = (value as string[] | undefined) || [];
//                   const checked = selected.includes(opt.optionText);
//                   return (
//                     <label
//                       key={opt.id}
//                       className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
//                         checked
//                           ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
//                           : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => {
//                           const next = checked
//                             ? selected.filter((t) => t !== opt.optionText)
//                             : [...selected, opt.optionText];
//                           saveAnswer(q.id, next);
//                         }}
//                         className="h-4 w-4"
//                       />
//                       {opt.optionText}
//                     </label>
//                   );
//                 })}

//               {(q.type === "NUMERICAL" || q.type === "SHORT_ANSWER") && (
//                 <input
//                   type={q.type === "NUMERICAL" ? "number" : "text"}
//                   value={(value as string) || ""}
//                   onChange={(e) => saveAnswer(q.id, e.target.value)}
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
//                   placeholder="Your answer"
//                 />
//               )}

//               {(q.type === "LONG_ANSWER" || q.type === "CODING") && (
//                 <textarea
//                   value={(value as string) || ""}
//                   onChange={(e) => saveAnswer(q.id, e.target.value)}
//                   className="min-h-[160px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
//                   placeholder="Write your answer here"
//                 />
//               )}
//             </div>

//             <div className="mt-6 flex justify-between gap-2">
//               <Button
//                 variant="outline"
//                 disabled={current === 0}
//                 onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//               >
//                 ← Previous
//               </Button>
//               {current < questions.length - 1 ? (
//                 <Button
//                   onClick={() =>
//                     setCurrent((c) => Math.min(questions.length - 1, c + 1))
//                   }
//                 >
//                   Next →
//                 </Button>
//               ) : (
//                 <Button
//                   variant="primary"
//                   loading={submitting}
//                   onClick={() => handleSubmit(false)}
//                 >
//                   Submit exam
//                 </Button>
//               )}
//             </div>
//           </Card>
//         )}
//       </div>

//       <div
//         className={`${navOpen ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-56`}
//       >
//         <Card>
//           <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
//             Questions
//           </p>
//           <div className="grid grid-cols-6 gap-2 lg:grid-cols-4">
//             {questions.map((eq, idx) => (
//               <button
//                 key={eq.questionId}
//                 onClick={() => {
//                   setCurrent(idx);
//                   setNavOpen(false);
//                 }}
//                 className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium ${
//                   idx === current
//                     ? "bg-indigo-600 text-white"
//                     : answers[eq.questionId]
//                       ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
//                       : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//           <Button
//             fullWidth
//             className="mt-4"
//             variant="primary"
//             loading={submitting}
//             onClick={() => handleSubmit(false)}
//           >
//             Submit exam
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// }

// "use client";

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { api, ApiError, assetUrl } from "@/lib/api";
// import type { Exam, ExamAttempt } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Card, Spinner, Alert, Badge } from "@/components/ui/Misc";

// type AnswerValue = string | string[] | undefined;

// function fmtClock(seconds: number) {
//   const s = Math.max(0, Math.floor(seconds));
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   const h = Math.floor(m / 60);
//   const mm = m % 60;
//   if (h > 0)
//     return `${h}:${String(mm).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
//   return `${mm}:${String(r).padStart(2, "0")}`;
// }

// export default function TakeExamPage() {
//   return (
//     <Suspense fallback={<Spinner />}>
//       <TakeExamInner />
//     </Suspense>
//   );
// }

// function TakeExamInner() {
//   const searchParams = useSearchParams();
//   const attemptId = searchParams.get("attemptId");
//   const router = useRouter();

//   const [attempt, setAttempt] = useState<
//     (ExamAttempt & { exam?: Exam }) | null
//   >(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [resultAttempt, setResultAttempt] = useState<ExamAttempt | null>(null);
//   const [navOpen, setNavOpen] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
//   const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

//   const load = useCallback(async () => {
//     if (!attemptId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get<ExamAttempt & { exam?: Exam }>(
//         `/exam-attempts/${attemptId}`,
//       );
//       setAttempt(res);
//       const initial: Record<string, AnswerValue> = {};
//       (res.answers || []).forEach((a) => {
//         initial[a.questionId] = a.answer as AnswerValue;
//       });
//       setAnswers(initial);
//       if (res.status && res.status !== "IN_PROGRESS") {
//         setSubmitted(true);
//         setResultAttempt(res);
//       }
//     } catch (e) {
//       setError(
//         e instanceof ApiError ? e.message : "Failed to load exam attempt.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [attemptId]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const questions = useMemo(
//     () =>
//       (attempt?.exam?.examQuestions || [])
//         .slice()
//         .sort((a, b) => a.displayOrder - b.displayOrder),
//     [attempt],
//   );

//   const saveAnswer = (questionId: string, value: AnswerValue) => {
//     setAnswers((a) => ({ ...a, [questionId]: value }));
//     if (saveTimers.current[questionId])
//       clearTimeout(saveTimers.current[questionId]);
//     saveTimers.current[questionId] = setTimeout(async () => {
//       if (!attemptId) return;
//       try {
//         await api.patch(`/exam-attempts/${attemptId}/save-answer`, {
//           questionId,
//           answer: value,
//         });
//       } catch {
//         // silent — will retry on next change or submit
//       }
//     }, 500);
//   };

//   const handleSubmit = async (auto = false) => {
//     if (!attemptId || submitted) return;
//     if (
//       !auto &&
//       !confirm(
//         "Submit the exam now? You won't be able to change your answers after this.",
//       )
//     )
//       return;
//     setSubmitting(true);
//     try {
//       await api.post(`/exam-attempts/${attemptId}/submit`);
//       setSubmitted(true);
//       try {
//         const graded = await api.get<ExamAttempt>(
//           `/exam-attempts/${attemptId}`,
//         );
//         setResultAttempt(graded);
//       } catch {
//         // If this fails the confirmation screen still shows without a score.
//       }
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to submit exam.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     if (!attempt?.exam || !attempt.startedAt) return;
//     const durationMs = attempt.exam.durationMinutes * 60 * 1000;
//     const startMs = new Date(attempt.startedAt).getTime();
//     const tick = () => {
//       const remaining = Math.round((startMs + durationMs - Date.now()) / 1000);
//       setSecondsLeft(remaining);
//       if (remaining <= 0 && !submitted) {
//         handleSubmit(true);
//       }
//     };
//     tick();
//     const interval = setInterval(tick, 1000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [attempt, submitted]);

//   if (!attemptId)
//     return (
//       <Alert>Missing attempt reference. Please start the exam again.</Alert>
//     );
//   if (loading) return <Spinner />;
//   if (error && !attempt) return <Alert>{error}</Alert>;
//   if (!attempt?.exam) return <Alert>Could not load this exam attempt.</Alert>;

//   if (submitted) {
//     const totalMarks = attempt.exam.totalMarks;
//     const passingMarks = attempt.exam.passingMarks;
//     const score = resultAttempt?.score;
//     const hasScore = typeof score === "number";
//     const passed = hasScore && score >= passingMarks;
//     const showScore = attempt.exam.showResultImmediately !== false && hasScore;

//     const gradedAnswers = resultAttempt?.answers || attempt.answers || [];
//     const answerByQuestion = new Map(
//       gradedAnswers.map((a) => [a.questionId, a]),
//     );

//     return (
//       <div className="mx-auto flex max-w-2xl flex-col gap-5 py-8">
//         <div className="flex flex-col items-center gap-3 text-center">
//           <div className="text-4xl">
//             {showScore ? (passed ? "🎉" : "📝") : "✅"}
//           </div>
//           <h1 className="text-xl font-bold text-slate-900 dark:text-white">
//             Exam submitted!
//           </h1>
//           <p className="text-sm text-slate-500 dark:text-slate-400">
//             Your answers for <strong>{attempt.exam.title}</strong> have been
//             recorded.
//           </p>

//           {showScore ? (
//             <Card className="w-full">
//               <p className="text-3xl font-bold text-slate-900 dark:text-white">
//                 {score}{" "}
//                 <span className="text-base font-normal text-slate-400">
//                   / {totalMarks}
//                 </span>
//               </p>
//               <Badge color={passed ? "green" : "red"}>
//                 {passed ? "Passed" : "Not passed"} (pass mark: {passingMarks})
//               </Badge>
//               <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
//                 Free-text or multi-select questions, if any, may still need
//                 manual grading by your teacher — this score reflects auto-graded
//                 questions only.
//               </p>
//             </Card>
//           ) : (
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               Your teacher will share results once this exam has been evaluated.
//             </p>
//           )}

//           <Button onClick={() => router.push("/dashboard")}>
//             Back to dashboard
//           </Button>
//         </div>

//         {showScore && questions.length > 0 && (
//           <div className="flex flex-col gap-3">
//             <h2 className="text-base font-semibold text-slate-900 dark:text-white">
//               Answer review
//             </h2>
//             {questions.map((eq, idx) => {
//               const q = eq.question;
//               const studentAnswer = answerByQuestion.get(q.id);
//               const rawAnswer = studentAnswer?.answer;
//               const obtainedMarks = studentAnswer?.obtainedMarks;
//               const hasOptions = Boolean(q.options && q.options.length > 0);
//               const solution = (q.solution || "").trim();
//               const gradable = ["MCQ", "TRUE_FALSE", "NUMERICAL"].includes(
//                 q.type,
//               );

//               return (
//                 <Card key={q.id}>
//                   <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//                     <div className="flex items-center gap-1.5">
//                       <Badge color="indigo">
//                         {q.type.replaceAll("_", " ")}
//                       </Badge>
//                       {gradable && typeof obtainedMarks === "number" && (
//                         <Badge
//                           color={
//                             obtainedMarks > 0
//                               ? "green"
//                               : obtainedMarks < 0
//                                 ? "red"
//                                 : "slate"
//                           }
//                         >
//                           {obtainedMarks > 0 ? "+" : ""}
//                           {obtainedMarks} mark
//                           {Math.abs(obtainedMarks) === 1 ? "" : "s"}
//                         </Badge>
//                       )}
//                       {!gradable && (
//                         <Badge color="amber">Needs manual grading</Badge>
//                       )}
//                     </div>
//                   </div>

//                   <p className="font-medium text-slate-900 dark:text-white">
//                     {idx + 1}. {q.title}
//                   </p>
//                   {q.imageUrl && (
//                     <img
//                       src={assetUrl(q.imageUrl)}
//                       alt="Question diagram"
//                       className="mt-2 max-h-64 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
//                     />
//                   )}

//                   {hasOptions ? (
//                     <ul className="mt-3 space-y-1.5 text-sm">
//                       {q.options?.map((opt) => {
//                         const isCorrectOption = solution
//                           ? opt.optionText.trim() === solution
//                           : Boolean(opt.isCorrect);
//                         const isStudentChoice =
//                           typeof rawAnswer === "string"
//                             ? rawAnswer === opt.optionText
//                             : Array.isArray(rawAnswer)
//                               ? (rawAnswer as string[]).includes(opt.optionText)
//                               : false;

//                         return (
//                           <li
//                             key={opt.id}
//                             className={`rounded-lg border px-3 py-2 ${
//                               isCorrectOption
//                                 ? "border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
//                                 : isStudentChoice
//                                   ? "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
//                                   : "border-slate-200 dark:border-slate-800"
//                             }`}
//                           >
//                             {opt.optionText}
//                             {isCorrectOption && " ✓ Correct answer"}
//                             {isStudentChoice &&
//                               !isCorrectOption &&
//                               " ✗ Your answer"}
//                             {isStudentChoice &&
//                               isCorrectOption &&
//                               " (your answer)"}
//                             {opt.imageUrl && (
//                               <img
//                                 src={assetUrl(opt.imageUrl)}
//                                 alt=""
//                                 className="mt-1.5 max-h-28 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
//                               />
//                             )}
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   ) : (
//                     <div className="mt-3 flex flex-col gap-2 text-sm">
//                       <div className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
//                         <span className="text-slate-500 dark:text-slate-400">
//                           Your answer:{" "}
//                         </span>
//                         <span className="text-slate-800 dark:text-slate-200">
//                           {(rawAnswer as string) || "(no answer given)"}
//                         </span>
//                       </div>
//                       {solution && (
//                         <div className="rounded-lg border border-emerald-400 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-950/30">
//                           <span className="text-slate-500 dark:text-slate-400">
//                             Correct answer:{" "}
//                           </span>
//                           <span className="text-slate-800 dark:text-slate-200">
//                             {solution}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {q.explanation && (
//                     <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
//                       <span className="font-medium text-slate-600 dark:text-slate-300">
//                         Explanation:{" "}
//                       </span>
//                       {q.explanation}
//                     </p>
//                   )}
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     );
//   }

//   const q = questions[current]?.question;
//   const value = q ? answers[q.id] : undefined;
//   const answeredCount = questions.filter((eq) => answers[eq.questionId]).length;

//   return (
//     <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
//       <div className="min-w-0 flex-1">
//         <Card className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h1 className="text-base font-semibold text-slate-900 dark:text-white">
//               {attempt.exam.title}
//             </h1>
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Question {current + 1} of {questions.length} • {answeredCount}{" "}
//               answered
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             {secondsLeft !== null && (
//               <Badge
//                 color={
//                   secondsLeft < 60
//                     ? "red"
//                     : secondsLeft < 300
//                       ? "amber"
//                       : "green"
//                 }
//               >
//                 ⏱ {fmtClock(secondsLeft)}
//               </Badge>
//             )}
//             <Button
//               size="sm"
//               variant="outline"
//               className="lg:hidden"
//               onClick={() => setNavOpen((v) => !v)}
//             >
//               {navOpen ? "Hide" : "Questions"}
//             </Button>
//           </div>
//         </Card>

//         {error && <Alert>{error}</Alert>}

//         {q && (
//           <Card>
//             <div className="mb-3 flex items-center gap-1.5">
//               <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>
//               <Badge color="slate">
//                 {questions[current].marks ?? q.marks ?? 1} marks
//               </Badge>
//             </div>
//             <p className="text-base font-medium text-slate-900 dark:text-white">
//               {q.title}
//             </p>
//             {q.description && (
//               <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
//                 {q.description}
//               </p>
//             )}
//             {q.imageUrl && (
//               <img
//                 src={assetUrl(q.imageUrl)}
//                 alt="Question diagram"
//                 className="mt-3 max-h-80 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
//               />
//             )}

//             <div className="mt-4 flex flex-col gap-2">
//               {(q.type === "MCQ" || q.type === "TRUE_FALSE") &&
//                 q.options?.map((opt) => (
//                   <label
//                     key={opt.id}
//                     className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
//                       value === opt.optionText
//                         ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
//                         : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name={q.id}
//                       checked={value === opt.optionText}
//                       onChange={() => saveAnswer(q.id, opt.optionText)}
//                       className="h-4 w-4"
//                     />
//                     <span className="flex flex-col gap-1.5">
//                       {opt.optionText}
//                       {opt.imageUrl && (
//                         <img
//                           src={assetUrl(opt.imageUrl)}
//                           alt=""
//                           className="max-h-32 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
//                         />
//                       )}
//                     </span>
//                   </label>
//                 ))}

//               {q.type === "MULTIPLE_SELECT" &&
//                 q.options?.map((opt) => {
//                   const selected = (value as string[] | undefined) || [];
//                   const checked = selected.includes(opt.optionText);
//                   return (
//                     <label
//                       key={opt.id}
//                       className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
//                         checked
//                           ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
//                           : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={() => {
//                           const next = checked
//                             ? selected.filter((t) => t !== opt.optionText)
//                             : [...selected, opt.optionText];
//                           saveAnswer(q.id, next);
//                         }}
//                         className="h-4 w-4"
//                       />
//                       <span className="flex flex-col gap-1.5">
//                         {opt.optionText}
//                         {opt.imageUrl && (
//                           <img
//                             src={assetUrl(opt.imageUrl)}
//                             alt=""
//                             className="max-h-32 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
//                           />
//                         )}
//                       </span>
//                     </label>
//                   );
//                 })}

//               {(q.type === "NUMERICAL" || q.type === "SHORT_ANSWER") && (
//                 <input
//                   type={q.type === "NUMERICAL" ? "number" : "text"}
//                   value={(value as string) || ""}
//                   onChange={(e) => saveAnswer(q.id, e.target.value)}
//                   className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
//                   placeholder="Your answer"
//                 />
//               )}

//               {(q.type === "LONG_ANSWER" || q.type === "CODING") && (
//                 <textarea
//                   value={(value as string) || ""}
//                   onChange={(e) => saveAnswer(q.id, e.target.value)}
//                   className="min-h-[160px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
//                   placeholder="Write your answer here"
//                 />
//               )}
//             </div>

//             <div className="mt-6 flex justify-between gap-2">
//               <Button
//                 variant="outline"
//                 disabled={current === 0}
//                 onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//               >
//                 ← Previous
//               </Button>
//               {current < questions.length - 1 ? (
//                 <Button
//                   onClick={() =>
//                     setCurrent((c) => Math.min(questions.length - 1, c + 1))
//                   }
//                 >
//                   Next →
//                 </Button>
//               ) : (
//                 <Button
//                   variant="primary"
//                   loading={submitting}
//                   onClick={() => handleSubmit(false)}
//                 >
//                   Submit exam
//                 </Button>
//               )}
//             </div>
//           </Card>
//         )}
//       </div>

//       <div
//         className={`${navOpen ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-56`}
//       >
//         <Card>
//           <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
//             Questions
//           </p>
//           <div className="grid grid-cols-6 gap-2 lg:grid-cols-4">
//             {questions.map((eq, idx) => (
//               <button
//                 key={eq.questionId}
//                 onClick={() => {
//                   setCurrent(idx);
//                   setNavOpen(false);
//                 }}
//                 className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium ${
//                   idx === current
//                     ? "bg-indigo-600 text-white"
//                     : answers[eq.questionId]
//                       ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
//                       : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//           <Button
//             fullWidth
//             className="mt-4"
//             variant="primary"
//             loading={submitting}
//             onClick={() => handleSubmit(false)}
//           >
//             Submit exam
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError, assetUrl } from "@/lib/api";
import type { Exam, ExamAttempt } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, Spinner, Alert, Badge } from "@/components/ui/Misc";
import { MathText } from "@/components/ui/MathText";

type AnswerValue = string | string[] | undefined;

function fmtClock(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0)
    return `${h}:${String(mm).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${mm}:${String(r).padStart(2, "0")}`;
}

export default function TakeExamPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <TakeExamInner />
    </Suspense>
  );
}

function TakeExamInner() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const router = useRouter();

  const [attempt, setAttempt] = useState<
    (ExamAttempt & { exam?: Exam }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultAttempt, setResultAttempt] = useState<ExamAttempt | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const load = useCallback(async () => {
    if (!attemptId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ExamAttempt & { exam?: Exam }>(
        `/exam-attempts/${attemptId}`,
      );
      setAttempt(res);
      const initial: Record<string, AnswerValue> = {};
      (res.answers || []).forEach((a) => {
        initial[a.questionId] = a.answer as AnswerValue;
      });
      setAnswers(initial);
      if (res.status && res.status !== "IN_PROGRESS") {
        setSubmitted(true);
        setResultAttempt(res);
      }
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load exam attempt.",
      );
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => {
    load();
  }, [load]);

  const questions = useMemo(
    () =>
      (attempt?.exam?.examQuestions || [])
        .slice()
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [attempt],
  );

  const saveAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    if (saveTimers.current[questionId])
      clearTimeout(saveTimers.current[questionId]);
    saveTimers.current[questionId] = setTimeout(async () => {
      if (!attemptId) return;
      try {
        await api.patch(`/exam-attempts/${attemptId}/save-answer`, {
          questionId,
          answer: value,
        });
      } catch {
        // silent — will retry on next change or submit
      }
    }, 500);
  };

  const handleSubmit = async (auto = false) => {
    if (!attemptId || submitted) return;
    if (
      !auto &&
      !confirm(
        "Submit the exam now? You won't be able to change your answers after this.",
      )
    )
      return;
    setSubmitting(true);
    try {
      await api.post(`/exam-attempts/${attemptId}/submit`);
      setSubmitted(true);
      try {
        const graded = await api.get<ExamAttempt>(
          `/exam-attempts/${attemptId}`,
        );
        setResultAttempt(graded);
      } catch {
        // If this fails the confirmation screen still shows without a score.
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to submit exam.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!attempt?.exam || !attempt.startedAt) return;
    const durationMs = attempt.exam.durationMinutes * 60 * 1000;
    const startMs = new Date(attempt.startedAt).getTime();
    const tick = () => {
      const remaining = Math.round((startMs + durationMs - Date.now()) / 1000);
      setSecondsLeft(remaining);
      if (remaining <= 0 && !submitted) {
        handleSubmit(true);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, submitted]);

  if (!attemptId)
    return (
      <Alert>Missing attempt reference. Please start the exam again.</Alert>
    );
  if (loading) return <Spinner />;
  if (error && !attempt) return <Alert>{error}</Alert>;
  if (!attempt?.exam) return <Alert>Could not load this exam attempt.</Alert>;

  if (submitted) {
    const totalMarks = attempt.exam.totalMarks;
    const passingMarks = attempt.exam.passingMarks;
    const score = resultAttempt?.score;
    const hasScore = typeof score === "number";
    const passed = hasScore && score >= passingMarks;
    const showScore = attempt.exam.showResultImmediately !== false && hasScore;

    const gradedAnswers = resultAttempt?.answers || attempt.answers || [];
    const answerByQuestion = new Map(
      gradedAnswers.map((a) => [a.questionId, a]),
    );

    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-5 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">
            {showScore ? (passed ? "🎉" : "📝") : "✅"}
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Exam submitted!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your answers for <strong>{attempt.exam.title}</strong> have been
            recorded.
          </p>

          {showScore ? (
            <Card className="w-full">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {score}{" "}
                <span className="text-base font-normal text-slate-400">
                  / {totalMarks}
                </span>
              </p>
              <Badge color={passed ? "green" : "red"}>
                {passed ? "Passed" : "Not passed"} (pass mark: {passingMarks})
              </Badge>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Free-text or multi-select questions, if any, may still need
                manual grading by your teacher — this score reflects auto-graded
                questions only.
              </p>
            </Card>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your teacher will share results once this exam has been evaluated.
            </p>
          )}

          <Button onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </div>

        {showScore && questions.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Answer review
            </h2>
            {questions.map((eq, idx) => {
              const q = eq.question;
              const studentAnswer = answerByQuestion.get(q.id);
              const rawAnswer = studentAnswer?.answer;
              const obtainedMarks = studentAnswer?.obtainedMarks;
              const hasOptions = Boolean(q.options && q.options.length > 0);
              const solution = (q.solution || "").trim();
              const gradable = ["MCQ", "TRUE_FALSE", "NUMERICAL"].includes(
                q.type,
              );

              return (
                <Card key={q.id}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge color="indigo">
                        {q.type.replaceAll("_", " ")}
                      </Badge>
                      {gradable && typeof obtainedMarks === "number" && (
                        <Badge
                          color={
                            obtainedMarks > 0
                              ? "green"
                              : obtainedMarks < 0
                                ? "red"
                                : "slate"
                          }
                        >
                          {obtainedMarks > 0 ? "+" : ""}
                          {obtainedMarks} mark
                          {Math.abs(obtainedMarks) === 1 ? "" : "s"}
                        </Badge>
                      )}
                      {!gradable && (
                        <Badge color="amber">Needs manual grading</Badge>
                      )}
                    </div>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-white">
                    {idx + 1}. <MathText text={q.title} />
                  </p>
                  {q.imageUrl && (
                    <img
                      src={assetUrl(q.imageUrl)}
                      alt="Question diagram"
                      className="mt-2 max-h-64 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  )}

                  {hasOptions ? (
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {q.options?.map((opt) => {
                        const isCorrectOption = solution
                          ? opt.optionText.trim() === solution
                          : Boolean(opt.isCorrect);
                        const isStudentChoice =
                          typeof rawAnswer === "string"
                            ? rawAnswer === opt.optionText
                            : Array.isArray(rawAnswer)
                              ? (rawAnswer as string[]).includes(opt.optionText)
                              : false;

                        return (
                          <li
                            key={opt.id}
                            className={`rounded-lg border px-3 py-2 ${
                              isCorrectOption
                                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
                                : isStudentChoice
                                  ? "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                                  : "border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <MathText text={opt.optionText} />
                            {isCorrectOption && " ✓ Correct answer"}
                            {isStudentChoice &&
                              !isCorrectOption &&
                              " ✗ Your answer"}
                            {isStudentChoice &&
                              isCorrectOption &&
                              " (your answer)"}
                            {opt.imageUrl && (
                              <img
                                src={assetUrl(opt.imageUrl)}
                                alt=""
                                className="mt-1.5 max-h-28 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                              />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <div className="rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">
                          Your answer:{" "}
                        </span>
                        <span className="text-slate-800 dark:text-slate-200">
                          {rawAnswer ? (
                            <MathText text={rawAnswer as string} />
                          ) : (
                            "(no answer given)"
                          )}
                        </span>
                      </div>
                      {solution && (
                        <div className="rounded-lg border border-emerald-400 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-950/30">
                          <span className="text-slate-500 dark:text-slate-400">
                            Correct answer:{" "}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200">
                            <MathText text={solution} />
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {q.explanation && (
                    <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        Explanation:{" "}
                      </span>
                      <MathText text={q.explanation} />
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const q = questions[current]?.question;
  const value = q ? answers[q.id] : undefined;
  const answeredCount = questions.filter((eq) => answers[eq.questionId]).length;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
      <div className="min-w-0 flex-1">
        <Card className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {attempt.exam.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Question {current + 1} of {questions.length} • {answeredCount}{" "}
              answered
            </p>
          </div>
          <div className="flex items-center gap-2">
            {secondsLeft !== null && (
              <Badge
                color={
                  secondsLeft < 60
                    ? "red"
                    : secondsLeft < 300
                      ? "amber"
                      : "green"
                }
              >
                ⏱ {fmtClock(secondsLeft)}
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="lg:hidden"
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? "Hide" : "Questions"}
            </Button>
          </div>
        </Card>

        {error && <Alert>{error}</Alert>}

        {q && (
          <Card>
            <div className="mb-3 flex items-center gap-1.5">
              <Badge color="indigo">{q.type.replaceAll("_", " ")}</Badge>
              <Badge color="slate">
                {questions[current].marks ?? q.marks ?? 1} marks
              </Badge>
            </div>
            <p className="text-base font-medium text-slate-900 dark:text-white">
              <MathText text={q.title} />
            </p>
            {q.description && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <MathText text={q.description} />
              </p>
            )}
            {q.imageUrl && (
              <img
                src={assetUrl(q.imageUrl)}
                alt="Question diagram"
                className="mt-3 max-h-80 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
              />
            )}

            <div className="mt-4 flex flex-col gap-2">
              {(q.type === "MCQ" || q.type === "TRUE_FALSE") &&
                q.options?.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      value === opt.optionText
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={value === opt.optionText}
                      onChange={() => saveAnswer(q.id, opt.optionText)}
                      className="h-4 w-4"
                    />
                    <span className="flex flex-col gap-1.5">
                      <MathText text={opt.optionText} />
                      {opt.imageUrl && (
                        <img
                          src={assetUrl(opt.imageUrl)}
                          alt=""
                          className="max-h-32 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                        />
                      )}
                    </span>
                  </label>
                ))}

              {q.type === "MULTIPLE_SELECT" &&
                q.options?.map((opt) => {
                  const selected = (value as string[] | undefined) || [];
                  const checked = selected.includes(opt.optionText);
                  return (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        checked
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
                          : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? selected.filter((t) => t !== opt.optionText)
                            : [...selected, opt.optionText];
                          saveAnswer(q.id, next);
                        }}
                        className="h-4 w-4"
                      />
                      <span className="flex flex-col gap-1.5">
                        <MathText text={opt.optionText} />
                        {opt.imageUrl && (
                          <img
                            src={assetUrl(opt.imageUrl)}
                            alt=""
                            className="max-h-32 max-w-full rounded-lg border border-slate-200 dark:border-slate-800"
                          />
                        )}
                      </span>
                    </label>
                  );
                })}

              {(q.type === "NUMERICAL" || q.type === "SHORT_ANSWER") && (
                <input
                  type={q.type === "NUMERICAL" ? "number" : "text"}
                  value={(value as string) || ""}
                  onChange={(e) => saveAnswer(q.id, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Your answer"
                />
              )}

              {(q.type === "LONG_ANSWER" || q.type === "CODING") && (
                <textarea
                  value={(value as string) || ""}
                  onChange={(e) => saveAnswer(q.id, e.target.value)}
                  className="min-h-[160px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Write your answer here"
                />
              )}
            </div>

            <div className="mt-6 flex justify-between gap-2">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              >
                ← Previous
              </Button>
              {current < questions.length - 1 ? (
                <Button
                  onClick={() =>
                    setCurrent((c) => Math.min(questions.length - 1, c + 1))
                  }
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  loading={submitting}
                  onClick={() => handleSubmit(false)}
                >
                  Submit exam
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      <div
        className={`${navOpen ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-56`}
      >
        <Card>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Questions
          </p>
          <div className="grid grid-cols-6 gap-2 lg:grid-cols-4">
            {questions.map((eq, idx) => (
              <button
                key={eq.questionId}
                onClick={() => {
                  setCurrent(idx);
                  setNavOpen(false);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium ${
                  idx === current
                    ? "bg-indigo-600 text-white"
                    : answers[eq.questionId]
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <Button
            fullWidth
            className="mt-4"
            variant="primary"
            loading={submitting}
            onClick={() => handleSubmit(false)}
          >
            Submit exam
          </Button>
        </Card>
      </div>
    </div>
  );
}