"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { Exam } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";

interface AttemptRow {
  id: string;
  status: string;
  score?: number | null;
  startedAt?: string;
  submittedAt?: string | null;
  student?: {
    rollNumber?: string | null;
    user?: { name?: string; email?: string };
  };
}

function fmt(dt?: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusColor(status: string): "slate" | "green" | "amber" | "blue" {
  if (
    status === "SUBMITTED" ||
    status === "EVALUATED" ||
    status === "AUTO_SUBMITTED"
  )
    return "green";
  if (status === "IN_PROGRESS") return "blue";
  return "slate";
}

export default function ExamResultsPage() {
  const { id } = useParams<{ id: string }>();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reevaluating, setReevaluating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [examRes, attemptsRes] = await Promise.all([
        api.get<Exam>(`/exams/${id}`),
        api.get<unknown>(`/exam-attempts/exam/${id}`),
      ]);
      setExam(examRes);
      setAttempts(
        Array.isArray(attemptsRes) ? (attemptsRes as AttemptRow[]) : [],
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load results.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const reevaluate = async (attemptId: string) => {
    setReevaluating(attemptId);
    try {
      await api.post(`/evaluation/${attemptId}/evaluate`);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Re-evaluation failed.");
    } finally {
      setReevaluating(null);
    }
  };

  if (loading) return <Spinner />;

  const graded = attempts.filter((a) => typeof a.score === "number");
  const passingMarks = exam?.passingMarks ?? 0;
  const passed = graded.filter((a) => (a.score ?? 0) >= passingMarks).length;
  const avgScore =
    graded.length > 0
      ? Math.round(
          (graded.reduce((sum, a) => sum + (a.score ?? 0), 0) / graded.length) *
            10,
        ) / 10
      : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Link
          href={`/exams/${id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to exam
        </Link>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          {exam?.title ? `Results — ${exam.title}` : "Exam Results"}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {attempts.length} attempt{attempts.length === 1 ? "" : "s"} recorded.
        </p>
      </div>

      {error && <Alert>{error}</Alert>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total attempts
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {attempts.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">Graded</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {graded.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Average score
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {avgScore ?? "—"}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pass rate
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {graded.length > 0
              ? `${Math.round((passed / graded.length) * 100)}%`
              : "—"}
          </p>
        </Card>
      </div>

      {attempts.length === 0 ? (
        <EmptyState
          title="No attempts yet"
          description="Once students start taking this exam, their attempts and scores will show up here."
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-x-auto p-0 md:block">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attempts.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {a.student?.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {a.student?.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={statusColor(a.status)}>{a.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {typeof a.score === "number" ? (
                        <span
                          className={
                            a.score >= passingMarks
                              ? "font-medium text-emerald-600 dark:text-emerald-400"
                              : "font-medium text-red-600 dark:text-red-400"
                          }
                        >
                          {a.score} / {exam?.totalMarks}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {fmt(a.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        loading={reevaluating === a.id}
                        disabled={a.status === "IN_PROGRESS"}
                        onClick={() => reevaluate(a.id)}
                      >
                        Re-evaluate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {attempts.map((a) => (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {a.student?.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {a.student?.user?.email}
                    </p>
                  </div>
                  <Badge color={statusColor(a.status)}>{a.status}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Score
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {typeof a.score === "number"
                      ? `${a.score} / ${exam?.totalMarks}`
                      : "—"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Submitted
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {fmt(a.submittedAt)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  className="mt-3"
                  loading={reevaluating === a.id}
                  disabled={a.status === "IN_PROGRESS"}
                  onClick={() => reevaluate(a.id)}
                >
                  Re-evaluate
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
