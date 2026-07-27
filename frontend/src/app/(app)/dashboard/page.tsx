// "use client";

// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import { Card } from "@/components/ui/Misc";

// const ADMIN_LINKS = [
//   {
//     href: "/institutes",
//     label: "Institutes",
//     icon: "🏛️",
//     desc: "Manage institutes on the platform.",
//   },
//   {
//     href: "/subjects",
//     label: "Subjects",
//     icon: "📚",
//     desc: "Define the subjects taught.",
//   },
//   {
//     href: "/batches",
//     label: "Batches",
//     icon: "🎓",
//     desc: "Organize students into batches.",
//   },
//   {
//     href: "/teachers",
//     label: "Teachers",
//     icon: "🧑‍🏫",
//     desc: "Manage teacher profiles.",
//   },
//   {
//     href: "/students",
//     label: "Students",
//     icon: "🧑‍🎓",
//     desc: "Manage student profiles.",
//   },
//   {
//     href: "/courses",
//     label: "Courses",
//     icon: "📖",
//     desc: "Link subjects, batches & teachers.",
//   },
// ];

// const TEACHER_LINKS = [
//   {
//     href: "/courses",
//     label: "Courses",
//     icon: "📖",
//     desc: "View and manage your courses.",
//   },
//   {
//     href: "/documents",
//     label: "Documents & AI",
//     icon: "📄",
//     desc: "Upload papers and extract questions with AI.",
//   },
//   {
//     href: "/questions",
//     label: "Question Bank",
//     icon: "❓",
//     desc: "Curate and organize questions.",
//   },
//   {
//     href: "/exams",
//     label: "Exams",
//     icon: "📝",
//     desc: "Create and manage exams.",
//   },
// ];

// const STUDENT_LINKS = [
//   {
//     href: "/exams",
//     label: "My Exams",
//     icon: "📝",
//     desc: "View and take your scheduled exams.",
//   },
//   {
//     href: "/practice",
//     label: "Practice Exams",
//     icon: "🎯",
//     desc: "Create a self-test from the question bank, anytime.",
//   },
//   {
//     href: "/results",
//     label: "My Results",
//     icon: "📊",
//     desc: "See your scores and review past attempts.",
//   },
//   {
//     href: "/profile",
//     label: "Profile",
//     icon: "👤",
//     desc: "Update your account details.",
//   },
// ];

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const links =
//     user?.role === "ADMIN" || user?.role === "INSTITUTE"
//       ? ADMIN_LINKS
//       : user?.role === "TEACHER"
//         ? TEACHER_LINKS
//         : STUDENT_LINKS;

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
//           Welcome back, {user?.name?.split(" ")[0]} 👋
//         </h1>
//         <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//           Here&apos;s a quick overview of what you can do as{" "}
//           {["ADMIN", "INSTITUTE"].includes(user?.role || "") ? "an" : "a"}{" "}
//           {user?.role?.toLowerCase()}.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {links.map((l) => (
//           <Link key={l.href} href={l.href}>
//             <Card className="h-full transition-shadow hover:shadow-md">
//               <div className="text-2xl">{l.icon}</div>
//               <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
//                 {l.label}
//               </h3>
//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 {l.desc}
//               </p>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {user?.role === "STUDENT" && (
//         <Card>
//           <h3 className="text-base font-semibold text-slate-900 dark:text-white">
//             Getting started
//           </h3>
//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Once your teacher publishes an exam for your course, it will appear
//             under{" "}
//             <Link
//               href="/exams"
//               className="font-medium text-indigo-600 hover:underline"
//             >
//               My Exams
//             </Link>
//             . Make sure your profile details are up to date.
//           </p>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/Misc";

const ADMIN_LINKS = [
  {
    href: "/institutes",
    label: "Institutes",
    icon: "🏛️",
    desc: "Manage institutes on the platform.",
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: "📚",
    desc: "Define the subjects taught.",
  },
  {
    href: "/batches",
    label: "Batches",
    icon: "🎓",
    desc: "Organize students into batches.",
  },
  {
    href: "/teachers",
    label: "Teachers",
    icon: "🧑‍🏫",
    desc: "Manage teacher profiles.",
  },
  {
    href: "/students",
    label: "Students",
    icon: "🧑‍🎓",
    desc: "Manage student profiles.",
  },
  {
    href: "/courses",
    label: "Courses",
    icon: "📖",
    desc: "Link subjects, batches & teachers.",
  },
];

const TEACHER_LINKS = [
  {
    href: "/courses",
    label: "Courses",
    icon: "📖",
    desc: "View and manage your courses.",
  },
  {
    href: "/documents",
    label: "Documents & AI",
    icon: "📄",
    desc: "Upload papers and extract questions with AI.",
  },
  {
    href: "/questions",
    label: "Question Bank",
    icon: "❓",
    desc: "Curate and organize questions.",
  },
  {
    href: "/exams",
    label: "Exams",
    icon: "📝",
    desc: "Create and manage exams.",
  },
];

const STUDENT_LINKS = [
  {
    href: "/exams",
    label: "My Exams",
    icon: "📝",
    desc: "View and take your scheduled exams.",
  },
  {
    href: "/practice",
    label: "Practice Exams",
    icon: "🎯",
    desc: "Create a self-test from the question bank, anytime.",
  },
  {
    href: "/documents",
    label: "My Documents & AI",
    icon: "📄",
    desc: "Upload your own notes or papers and extract questions with AI.",
  },
  {
    href: "/questions",
    label: "My Question Bank",
    icon: "❓",
    desc: "Your personal question bank, separate from your teacher's.",
  },
  {
    href: "/results",
    label: "My Results",
    icon: "📊",
    desc: "See your scores and review past attempts.",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "👤",
    desc: "Update your account details.",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const links =
    user?.role === "ADMIN" || user?.role === "INSTITUTE"
      ? ADMIN_LINKS
      : user?.role === "TEACHER"
        ? TEACHER_LINKS
        : STUDENT_LINKS;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s a quick overview of what you can do as{" "}
          {["ADMIN", "INSTITUTE"].includes(user?.role || "") ? "an" : "a"}{" "}
          {user?.role?.toLowerCase()}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="text-2xl">{l.icon}</div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                {l.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {l.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {user?.role === "STUDENT" && (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Getting started
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Once your teacher publishes an exam for your course, it will appear
            under{" "}
            <Link
              href="/exams"
              className="font-medium text-indigo-600 hover:underline"
            >
              My Exams
            </Link>
            . Make sure your profile details are up to date.
          </p>
        </Card>
      )}
    </div>
  );
}