"use client";

import { ResourceManager } from "@/components/ResourceManager";
import { useOptions } from "@/lib/useOptions";
import type { Institute } from "@/lib/types";
import { Spinner } from "@/components/ui/Misc";

export default function BatchesPage() {
  const { options: instituteOptions, loading } = useOptions<Institute>("/institutes", (i) => ({
    value: i.id,
    label: `${i.name} (${i.code})`,
  }));

  if (loading) return <Spinner />;

  return (
    <ResourceManager
      title="Batches"
      description="Groups of students, e.g. Batch 2026, Semester 4 Section A."
      endpoint="/batches"
      columns={[
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "academicYear", label: "Academic Year" },
        { key: "semester", label: "Semester" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Batch 2026" },
        { name: "code", label: "Code", type: "text", placeholder: "B2026" },
        {
          name: "instituteId",
          label: "Institute",
          type: "select",
          required: true,
          options: instituteOptions,
        },
        { name: "academicYear", label: "Academic Year", type: "text", placeholder: "2025-2026" },
        { name: "semester", label: "Semester", type: "number", placeholder: "1" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
