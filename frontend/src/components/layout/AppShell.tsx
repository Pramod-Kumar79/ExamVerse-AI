// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import { useAuth } from "@/lib/auth-context";
// import type { UserRole } from "@/lib/types";

// interface NavItem {
//   href: string;
//   label: string;
//   icon: string;
//   roles?: UserRole[];
// }

// const NAV_ITEMS: NavItem[] = [
//   { href: "/dashboard", label: "Dashboard", icon: "🏠" },
//   {
//     href: "/institutes",
//     label: "Institutes",
//     icon: "🏛️",
//     roles: ["ADMIN", "INSTITUTE"],
//   },
//   {
//     href: "/subjects",
//     label: "Subjects",
//     icon: "📚",
//     roles: ["ADMIN", "INSTITUTE"],
//   },
//   {
//     href: "/batches",
//     label: "Batches",
//     icon: "🎓",
//     roles: ["ADMIN", "INSTITUTE"],
//   },
//   {
//     href: "/teachers",
//     label: "Teachers",
//     icon: "🧑‍🏫",
//     roles: ["ADMIN", "INSTITUTE"],
//   },
//   {
//     href: "/students",
//     label: "Students",
//     icon: "🧑‍🎓",
//     roles: ["ADMIN", "INSTITUTE"],
//   },
//   {
//     href: "/courses",
//     label: "Courses",
//     icon: "📖",
//     roles: ["ADMIN", "INSTITUTE", "TEACHER"],
//   },
//   {
//     href: "/documents",
//     label: "Documents & AI",
//     icon: "📄",
//     roles: ["ADMIN", "TEACHER"],
//   },
//   {
//     href: "/questions",
//     label: "Question Bank",
//     icon: "❓",
//     roles: ["ADMIN", "TEACHER"],
//   },
//   { href: "/exams", label: "Exams", icon: "📝" },
//   {
//     href: "/practice",
//     label: "Practice Exams",
//     icon: "🎯",
//     roles: ["STUDENT"],
//   },
//   { href: "/results", label: "My Results", icon: "📊", roles: ["STUDENT"] },
//   { href: "/profile", label: "Profile", icon: "👤" },
// ];

// function NavLinks({
//   items,
//   pathname,
//   onNavigate,
// }: {
//   items: NavItem[];
//   pathname: string | null;
//   onNavigate?: () => void;
// }) {
//   return (
//     <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
//       {items.map((item) => {
//         const active =
//           pathname === item.href || pathname?.startsWith(item.href + "/");
//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//             onClick={onNavigate}
//             className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
//               active
//                 ? "bg-indigo-600 text-white"
//                 : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
//             }`}
//           >
//             <span aria-hidden>{item.icon}</span>
//             {item.label}
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

// export function AppShell({ children }: { children: React.ReactNode }) {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const items = NAV_ITEMS.filter(
//     (item) => !item.roles || (user && item.roles.includes(user.role)),
//   );

//   const handleLogout = async () => {
//     await logout();
//     router.push("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
//       {/* Desktop sidebar */}
//       <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
//         <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
//           <span className="text-xl">🧭</span>
//           <span className="text-base font-bold text-slate-900 dark:text-white">
//             ExamVerse AI
//           </span>
//         </div>
//         <NavLinks items={items} pathname={pathname} />
//         <div className="border-t border-slate-200 p-4 dark:border-slate-800">
//           <div className="mb-3 flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
//               {user?.name?.[0]?.toUpperCase() ?? "?"}
//             </div>
//             <div className="min-w-0">
//               <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
//                 {user?.name}
//               </p>
//               <p className="truncate text-xs text-slate-500 dark:text-slate-400">
//                 {user?.role}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
//           >
//             Log out
//           </button>
//         </div>
//       </aside>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="fixed inset-0 z-40 lg:hidden">
//           <div
//             className="absolute inset-0 bg-slate-900/50"
//             onClick={() => setOpen(false)}
//           />
//           <div className="relative z-10 flex h-full w-72 flex-col bg-white dark:bg-slate-900">
//             <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
//               <span className="text-base font-bold text-slate-900 dark:text-white">
//                 🧭 ExamVerse AI
//               </span>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="p-1 text-slate-500"
//               >
//                 ✕
//               </button>
//             </div>
//             <NavLinks
//               items={items}
//               pathname={pathname}
//               onNavigate={() => setOpen(false)}
//             />
//             <div className="border-t border-slate-200 p-4 dark:border-slate-800">
//               <button
//                 onClick={handleLogout}
//                 className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
//               >
//                 Log out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex min-w-0 flex-1 flex-col">
//         {/* Topbar */}
//         <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
//           <button
//             onClick={() => setOpen(true)}
//             aria-label="Open menu"
//             className="rounded-lg border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
//           >
//             ☰
//           </button>
//           <span className="text-sm font-bold text-slate-900 dark:text-white">
//             🧭 ExamVerse AI
//           </span>
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
//             {user?.name?.[0]?.toUpperCase() ?? "?"}
//           </div>
//         </header>

//         <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  {
    href: "/institutes",
    label: "Institutes",
    icon: "🏛️",
    roles: ["ADMIN", "INSTITUTE"],
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: "📚",
    roles: ["INSTITUTE"],
  },
  {
    href: "/batches",
    label: "Batches",
    icon: "🎓",
    roles: ["INSTITUTE"],
  },
  {
    href: "/teachers",
    label: "Teachers",
    icon: "🧑‍🏫",
    roles: ["INSTITUTE"],
  },
  {
    href: "/students",
    label: "Students",
    icon: "🧑‍🎓",
    roles: ["INSTITUTE"],
  },
  {
    href: "/courses",
    label: "Courses",
    icon: "📖",
    roles: ["INSTITUTE", "TEACHER"],
  },
  {
    href: "/documents",
    label: "Documents & AI",
    icon: "📄",
    roles: ["INSTITUTE", "TEACHER", "STUDENT"],
  },
  {
    href: "/questions",
    label: "Question Bank",
    icon: "❓",
    roles: ["INSTITUTE", "TEACHER", "STUDENT"],
  },
  { href: "/exams", label: "Exams", icon: "📝", roles: ["INSTITUTE", "TEACHER", "STUDENT"] },
  {
    href: "/practice",
    label: "Practice Exams",
    icon: "🎯",
    roles: ["STUDENT"],
  },
  { href: "/results", label: "My Results", icon: "📊", roles: ["STUDENT"] },
  { href: "/profile", label: "Profile", icon: "👤" },
];

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const items = NAV_ITEMS.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <span className="text-xl">🧭</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ExamVerse AI
          </span>
        </div>
        <NavLinks items={items} pathname={pathname} />
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex h-full w-72 flex-col bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                🧭 ExamVerse AI
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-500"
              >
                ✕
              </button>
            </div>
            <NavLinks
              items={items}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <div className="border-t border-slate-200 p-4 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            ☰
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            🧭 ExamVerse AI
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}