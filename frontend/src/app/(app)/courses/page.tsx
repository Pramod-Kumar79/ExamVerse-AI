// "use client";

// import { ResourceManager } from "@/components/ResourceManager";
// import { useOptions } from "@/lib/useOptions";
// import type { Institute, Subject, Batch, TeacherProfile } from "@/lib/types";
// import { Spinner } from "@/components/ui/Misc";
// import { useAuth } from "@/lib/auth-context";

// export default function CoursesPage() {
//   const { user } = useAuth();
//   const isAdmin = user?.role === "ADMIN";

//   const { options: instituteOptions, loading: l1 } = useOptions<Institute>(
//     "/institutes",
//     (i) => ({ value: i.id, label: `${i.name} (${i.code})` }),
//   );
//   const { options: subjectOptions, loading: l2 } = useOptions<Subject>("/subjects", (s) => ({
//     value: s.id,
//     label: s.name,
//   }));
//   const { options: batchOptions, loading: l3 } = useOptions<Batch>("/batches", (b) => ({
//     value: b.id,
//     label: b.name,
//   }));
//   const { options: teacherOptions, loading: l4 } = useOptions<TeacherProfile>(
//     "/teachers",
//     (t) => ({ value: t.id, label: t.user?.name || t.designation || t.id }),
//   );

//   if (l1 || l2 || l3 || l4) return <Spinner />;

//   return (
//     <ResourceManager
//       title="Courses"
//       description="Courses connect a subject, a teacher and a batch within an institute. Exams are created within a course."
//       endpoint="/courses"
//       canCreate={isAdmin}
//       canDelete={isAdmin}
//       columns={[
//         { key: "name", label: "Name" },
//         { key: "code", label: "Code" },
//         { key: "academicYear", label: "Year" },
//         { key: "semester", label: "Semester" },
//         { key: "credits", label: "Credits" },
//       ]}
//       fields={[
//         { name: "name", label: "Name", type: "text", required: true, placeholder: "Operating Systems" },
//         { name: "code", label: "Code", type: "text", required: true, placeholder: "CS301" },
//         {
//           name: "instituteId",
//           label: "Institute",
//           type: "select",
//           required: true,
//           options: instituteOptions,
//         },
//         {
//           name: "subjectId",
//           label: "Subject",
//           type: "select",
//           required: true,
//           options: subjectOptions,
//         },
//         {
//           name: "teacherId",
//           label: "Teacher",
//           type: "select",
//           required: true,
//           options: teacherOptions,
//         },
//         { name: "batchId", label: "Batch", type: "select", required: true, options: batchOptions },
//         { name: "academicYear", label: "Academic Year", type: "text", placeholder: "2025-2026" },
//         { name: "semester", label: "Semester", type: "number", placeholder: "3" },
//         { name: "credits", label: "Credits", type: "number", placeholder: "4" },
//         { name: "description", label: "Description", type: "textarea" },
//       ]}
//     />
//   );
// }

"use client";

import { ResourceManager } from "@/components/ResourceManager";
import { useOptions } from "@/lib/useOptions";
import type { Institute, Subject, Batch, TeacherProfile } from "@/lib/types";
import { Spinner } from "@/components/ui/Misc";
import { useAuth } from "@/lib/auth-context";

export default function CoursesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "INSTITUTE";

  const { options: instituteOptions, loading: l1 } = useOptions<Institute>(
    "/institutes",
    (i) => ({ value: i.id, label: `${i.name} (${i.code})` }),
  );
  const { options: subjectOptions, loading: l2 } = useOptions<Subject>(
    "/subjects",
    (s) => ({
      value: s.id,
      label: s.name,
    }),
  );
  const { options: batchOptions, loading: l3 } = useOptions<Batch>(
    "/batches",
    (b) => ({
      value: b.id,
      label: b.name,
    }),
  );
  const { options: teacherOptions, loading: l4 } = useOptions<TeacherProfile>(
    "/teachers",
    (t) => ({ value: t.id, label: t.user?.name || t.designation || t.id }),
  );

  if (l1 || l2 || l3 || l4) return <Spinner />;

  return (
    <ResourceManager
      title="Courses"
      description="Courses connect a subject, a teacher and a batch within an institute. Exams are created within a course."
      endpoint="/courses"
      canCreate={isAdmin}
      canDelete={isAdmin}
      columns={[
        { key: "name", label: "Name" },
        { key: "code", label: "Code" },
        { key: "academicYear", label: "Year" },
        { key: "semester", label: "Semester" },
        { key: "credits", label: "Credits" },
      ]}
      fields={[
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          placeholder: "Operating Systems",
        },
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
          placeholder: "CS301",
        },
        {
          name: "instituteId",
          label: "Institute",
          type: "select",
          required: true,
          options: instituteOptions,
        },
        {
          name: "subjectId",
          label: "Subject",
          type: "select",
          required: true,
          options: subjectOptions,
        },
        {
          name: "teacherId",
          label: "Teacher",
          type: "select",
          required: true,
          options: teacherOptions,
        },
        {
          name: "batchId",
          label: "Batch",
          type: "select",
          required: true,
          options: batchOptions,
        },
        {
          name: "academicYear",
          label: "Academic Year",
          type: "text",
          placeholder: "2025-2026",
        },
        {
          name: "semester",
          label: "Semester",
          type: "number",
          placeholder: "3",
        },
        { name: "credits", label: "Credits", type: "number", placeholder: "4" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}