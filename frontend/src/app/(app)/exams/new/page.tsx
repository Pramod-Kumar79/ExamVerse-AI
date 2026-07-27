// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { api, ApiError } from "@/lib/api";
// import { useOptions } from "@/lib/useOptions";
// import type { Course, Exam } from "@/lib/types";
// import { Button } from "@/components/ui/Button";
// import { Input, Select, Textarea } from "@/components/ui/Field";
// import { Card, Alert, Spinner } from "@/components/ui/Misc";

// export default function NewExamPage() {
//   const router = useRouter();
//   const { options: courseOptions, loading } = useOptions<Course>("/courses", (c) => ({
//     value: c.id,
//     label: `${c.name} (${c.code})`,
//   }));

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     instructions: "",
//     courseId: "",
//     startTime: "",
//     endTime: "",
//     durationMinutes: "60",
//     totalMarks: "100",
//     passingMarks: "40",
//     negativeMarking: false,
//     shuffleQuestions: true,
//     shuffleOptions: true,
//     showResultImmediately: true,
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError(null);
//     try {
//       const exam = await api.post<Exam>("/exams", {
//         title: form.title,
//         description: form.description || undefined,
//         instructions: form.instructions || undefined,
//         courseId: form.courseId,
//         startTime: new Date(form.startTime).toISOString(),
//         endTime: new Date(form.endTime).toISOString(),
//         durationMinutes: Number(form.durationMinutes),
//         totalMarks: Number(form.totalMarks),
//         passingMarks: Number(form.passingMarks),
//         negativeMarking: form.negativeMarking,
//         shuffleQuestions: form.shuffleQuestions,
//         shuffleOptions: form.shuffleOptions,
//         showResultImmediately: form.showResultImmediately,
//       });
//       router.push(`/exams/${exam.id}`);
//     } catch (e) {
//       setError(e instanceof ApiError ? e.message : "Failed to create exam.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="mx-auto flex max-w-2xl flex-col gap-5">
//       <div>
//         <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//           Create Exam
//         </h1>
//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           You&apos;ll be able to attach questions from your bank in the next step.
//         </p>
//       </div>

//       <Card>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {error && <Alert>{error}</Alert>}
//           <Input
//             label="Title"
//             required
//             value={form.title}
//             onChange={(e) => set({ title: e.target.value })}
//             placeholder="Midterm Examination"
//           />
//           <Textarea
//             label="Description"
//             value={form.description}
//             onChange={(e) => set({ description: e.target.value })}
//           />
//           <Textarea
//             label="Instructions"
//             value={form.instructions}
//             onChange={(e) => set({ instructions: e.target.value })}
//             placeholder="Read each question carefully. No negative marking unless stated."
//           />
//           <Select
//             label="Course"
//             required
//             value={form.courseId}
//             onChange={(e) => set({ courseId: e.target.value })}
//           >
//             <option value="">Select course...</option>
//             {courseOptions.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </Select>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <Input
//               label="Start time"
//               type="datetime-local"
//               required
//               value={form.startTime}
//               onChange={(e) => set({ startTime: e.target.value })}
//             />
//             <Input
//               label="End time"
//               type="datetime-local"
//               required
//               value={form.endTime}
//               onChange={(e) => set({ endTime: e.target.value })}
//             />
//             <Input
//               label="Duration (minutes)"
//               type="number"
//               required
//               value={form.durationMinutes}
//               onChange={(e) => set({ durationMinutes: e.target.value })}
//             />
//             <Input
//               label="Total marks"
//               type="number"
//               required
//               value={form.totalMarks}
//               onChange={(e) => set({ totalMarks: e.target.value })}
//             />
//             <Input
//               label="Passing marks"
//               type="number"
//               required
//               value={form.passingMarks}
//               onChange={(e) => set({ passingMarks: e.target.value })}
//             />
//           </div>
//           <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
//             {[
//               { key: "negativeMarking", label: "Enable negative marking" },
//               { key: "shuffleQuestions", label: "Shuffle question order" },
//               { key: "shuffleOptions", label: "Shuffle answer options" },
//               { key: "showResultImmediately", label: "Show result immediately after submission" },
//             ].map((opt) => (
//               <label key={opt.key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
//                 <input
//                   type="checkbox"
//                   checked={form[opt.key as keyof typeof form] as boolean}
//                   onChange={(e) => set({ [opt.key]: e.target.checked } as Partial<typeof form>)}
//                   className="h-4 w-4 rounded border-slate-300"
//                 />
//                 {opt.label}
//               </label>
//             ))}
//           </div>
//           <Button type="submit" loading={saving} fullWidth>
//             Create exam
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useOptions } from "@/lib/useOptions";
import type { Course, Exam } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Card, Alert, Spinner } from "@/components/ui/Misc";

export default function NewExamPage() {
  const router = useRouter();
  const { options: courseOptions, loading } = useOptions<Course>(
    "/courses",
    (c) => ({
      value: c.id,
      label: `${c.name} (${c.code})`,
    }),
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    courseId: "",
    startTime: "",
    endTime: "",
    durationMinutes: "60",
    totalMarks: "100",
    passingMarks: "40",
    maxAttempts: "1",
    negativeMarking: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResultImmediately: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<typeof form>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const exam = await api.post<Exam>("/exams", {
        title: form.title,
        description: form.description || undefined,
        instructions: form.instructions || undefined,
        courseId: form.courseId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        durationMinutes: Number(form.durationMinutes),
        totalMarks: Number(form.totalMarks),
        passingMarks: Number(form.passingMarks),
        maxAttempts: Number(form.maxAttempts) || 1,
        negativeMarking: form.negativeMarking,
        shuffleQuestions: form.shuffleQuestions,
        shuffleOptions: form.shuffleOptions,
        showResultImmediately: form.showResultImmediately,
      });
      router.push(`/exams/${exam.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to create exam.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Create Exam
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          You&apos;ll be able to attach questions from your bank in the next
          step.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert>{error}</Alert>}
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Midterm Examination"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
          <Textarea
            label="Instructions"
            value={form.instructions}
            onChange={(e) => set({ instructions: e.target.value })}
            placeholder="Read each question carefully. No negative marking unless stated."
          />
          <Select
            label="Course"
            required
            value={form.courseId}
            onChange={(e) => set({ courseId: e.target.value })}
          >
            <option value="">Select course...</option>
            {courseOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Start time"
              type="datetime-local"
              required
              value={form.startTime}
              onChange={(e) => set({ startTime: e.target.value })}
            />
            <Input
              label="End time"
              type="datetime-local"
              required
              value={form.endTime}
              onChange={(e) => set({ endTime: e.target.value })}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              required
              value={form.durationMinutes}
              onChange={(e) => set({ durationMinutes: e.target.value })}
            />
            <Input
              label="Total marks"
              type="number"
              required
              value={form.totalMarks}
              onChange={(e) => set({ totalMarks: e.target.value })}
            />
            <Input
              label="Passing marks"
              type="number"
              required
              value={form.passingMarks}
              onChange={(e) => set({ passingMarks: e.target.value })}
            />
            <Input
              label="Max attempts"
              type="number"
              min={1}
              required
              hint="Students can't retake the exam beyond this many attempts."
              value={form.maxAttempts}
              onChange={(e) => set({ maxAttempts: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            {[
              { key: "negativeMarking", label: "Enable negative marking" },
              { key: "shuffleQuestions", label: "Shuffle question order" },
              { key: "shuffleOptions", label: "Shuffle answer options" },
              {
                key: "showResultImmediately",
                label: "Show result immediately after submission",
              },
            ].map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <input
                  type="checkbox"
                  checked={form[opt.key as keyof typeof form] as boolean}
                  onChange={(e) =>
                    set({ [opt.key]: e.target.checked } as Partial<typeof form>)
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <Button type="submit" loading={saving} fullWidth>
            Create exam
          </Button>
        </form>
      </Card>
    </div>
  );
}