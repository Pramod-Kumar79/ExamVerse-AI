"use client";

import { ResourceManager } from "@/components/ResourceManager";
import { useOptions } from "@/lib/useOptions";
import type { Batch } from "@/lib/types";
import { Spinner } from "@/components/ui/Misc";

export default function StudentsPage() {
  const { options: batchOptions, loading } = useOptions<Batch>("/batches", (b) => ({
    value: b.id,
    label: b.name,
  }));

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      title="Students"
      description="Link a registered user account to a student profile and batch. Ask the person to share their User ID from their Profile page."
      endpoint="/students"
      columns={[
        { key: "rollNumber", label: "Roll No." },
        { key: "semester", label: "Semester" },
        { key: "batchId", label: "Batch ID" },
        { key: "userId", label: "User ID" },
      ]}
      fields={[
        {
          name: "userId",
          label: "User ID",
          type: "text",
          required: true,
          placeholder: "cku8x...",
          hint: "Only used when creating — the account must already be registered.",
        },
        { name: "batchId", label: "Batch", type: "select", required: true, options: batchOptions },
        { name: "rollNumber", label: "Roll Number", type: "text", placeholder: "2026-CS-014" },
        { name: "semester", label: "Semester", type: "number", placeholder: "4" },
      ]}
    />
  );
}
