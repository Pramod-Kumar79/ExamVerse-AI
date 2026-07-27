"use client";

import { ResourceManager } from "@/components/ResourceManager";

export default function TeachersPage() {
  return (
    <ResourceManager
      title="Teachers"
      description="Link a registered user account to a teacher profile. Ask the person to share their User ID from their Profile page."
      endpoint="/teachers"
      columns={[
        { key: "designation", label: "Designation" },
        { key: "qualification", label: "Qualification" },
        { key: "experience", label: "Experience (yrs)" },
        { key: "userId", label: "User ID" },
      ]}
      canEdit
      fields={[
        {
          name: "userId",
          label: "User ID",
          type: "text",
          required: true,
          placeholder: "cku8x...",
          hint: "Only used when creating — the account must already be registered.",
        },
        { name: "designation", label: "Designation", type: "text", placeholder: "Assistant Professor" },
        { name: "qualification", label: "Qualification", type: "text", placeholder: "Ph.D. in Computer Science" },
        { name: "experience", label: "Experience (years)", type: "number", placeholder: "5" },
      ]}
    />
  );
}
