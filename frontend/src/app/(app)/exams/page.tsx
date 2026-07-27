"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import type { Exam } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Card, EmptyState, Spinner, Alert, Badge } from "@/components/ui/Misc";

function extractList(raw: unknown): Exam[] {
  if (Array.isArray(raw)) return raw as Exam[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as Exam[];
    }
  }
  return [];
}

function fmt(dt?: string) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ManagerView() {
  const [items, setItems] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>("/exams");
      setItems(extractList(res));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load exams.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Exams</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage exams for your courses.
          </p>
        </div>
        <Link href="/exams/new">
          <Button>+ New Exam</Button>
        </Link>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          title="No exams yet"
          description="Create your first exam and attach questions from your bank."
          action={
            <Link href="/exams/new">
              <Button size="sm">+ New Exam</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Badge color={exam.isPublished ? "green" : "slate"}>
                    {exam.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Badge color="indigo">{exam.status || "DRAFT"}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{exam.title}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {fmt(exam.startTime)} → {fmt(exam.endTime)}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {exam.durationMinutes} min • {exam.totalMarks} marks
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentView() {
  const router = useRouter();
  const [examId, setExamId] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (examId.trim()) router.push(`/exams/${examId.trim()}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">My Exams</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the exam ID or link your teacher shared with you to view details and get started.
        </p>
      </div>
      <Card>
        <form onSubmit={go} className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Paste exam ID..."
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className="sm:flex-1"
          />
          <Button type="submit">Open exam</Button>
        </form>
      </Card>
    </div>
  );
}

export default function ExamsPage() {
  const { user } = useAuth();
  if (user?.role === "ADMIN" || user?.role === "TEACHER") return <ManagerView />;
  return <StudentView />;
}
