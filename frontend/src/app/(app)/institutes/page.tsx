"use client";

import { ResourceManager } from "@/components/ResourceManager";

export default function InstitutesPage() {
  return (
    <ResourceManager
      title="Institutes"
      description="Institutes that use ExamVerse AI. Each batch and course belongs to one institute."
      endpoint="/institutes"
      columns={[
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
      ]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Springfield Institute of Technology" },
        { name: "code", label: "Code", type: "text", required: true, placeholder: "SIT", hint: "A short unique code." },
        { name: "email", label: "Email", type: "text", placeholder: "contact@institute.edu" },
        { name: "phone", label: "Phone", type: "text", placeholder: "+1 555 000 0000" },
        { name: "website", label: "Website", type: "text", placeholder: "https://institute.edu" },
        { name: "address", label: "Address", type: "textarea", placeholder: "123 Main St, City, Country" },
      ]}
    />
  );
}
