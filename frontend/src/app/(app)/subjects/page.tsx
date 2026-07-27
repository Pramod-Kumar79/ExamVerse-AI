"use client";

import { ResourceManager } from "@/components/ResourceManager";

export default function SubjectsPage() {
  return (
    <ResourceManager
      title="Subjects"
      description="Subjects available across courses, e.g. Mathematics, Physics, Computer Science."
      endpoint="/subjects"
      columns={[
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Data Structures" },
        { name: "code", label: "Code", type: "text", placeholder: "CS201" },
        { name: "description", label: "Description", type: "textarea", placeholder: "Short description" },
      ]}
    />
  );
}
