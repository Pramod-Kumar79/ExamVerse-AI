"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Card, Spinner, Alert, Badge, EmptyState } from "@/components/ui/Misc";

interface AttemptRow {
  id: string;
  examId: string;
  status: string;
  score?: number | null;
  startedAt?: string;
  submittedAt?: string | null;
  exam?: {
    title: string;
    totalMarks: number;
    passingMarks: number;
    course?: { name?: string };
  };
}

function fmt(dt?: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusColor(status: string): "slate" | "green" | "blue" {
  if (
    status === "SUBMITTED" ||
    status === "EVALUATED" ||
    status === "AUTO_SUBMITTED"
  )
    return "green";
  if (status === "IN_PROGRESS") return "blue";
  return "slate";
}

export default function MyResultsPage() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>("/exam-attempts/me/attempts");
      setAttempts(Array.isArray(res) ? (res as AttemptRow[]) : []);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load your results.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          My Results
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Every exam you've taken, with your score and a link to review your
          answers.
        </p>
      </div>

      {error && <Alert>{error}</Alert>}

      {attempts.length === 0 ? (
        <EmptyState
          title="No exam attempts yet"
          description="Once you take an exam, it will show up here with your score."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {attempts.map((a) => {
            const passed =
              typeof a.score === "number" && a.exam
                ? a.score >= a.exam.passingMarks
                : null;
            const isDone = a.status !== "IN_PROGRESS";

            return (
              <Link
                key={a.id}
                href={`/exams/${a.examId}/take?attemptId=${a.id}`}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <Badge color={statusColor(a.status)}>
                          {a.status === "IN_PROGRESS"
                            ? "In progress"
                            : "Submitted"}
                        </Badge>
                        {passed !== null && (
                          <Badge color={passed ? "green" : "red"}>
                            {passed ? "Passed" : "Not passed"}
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {a.exam?.title || "Exam"}
                      </p>
                      {a.exam?.course?.name && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {a.exam.course.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {typeof a.score === "number" ? (
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {a.score}{" "}
                          <span className="text-sm font-normal text-slate-400">
                            / {a.exam?.totalMarks}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400">
                          {isDone ? "Pending evaluation" : "In progress"}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {fmt(a.submittedAt || a.startedAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
