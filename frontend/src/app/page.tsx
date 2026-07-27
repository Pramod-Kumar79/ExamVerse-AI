import Link from "next/link";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Question Extraction",
    desc: "Upload past papers or textbooks and let AI pull out structured, ready-to-use questions in minutes.",
  },
  {
    icon: "🏛️",
    title: "Multi-institute Ready",
    desc: "Manage institutes, batches, courses, teachers and students from a single, organized workspace.",
  },
  {
    icon: "🧠",
    title: "Smart Question Bank",
    desc: "Tag questions by chapter, topic, difficulty and Bloom level so the right exam is always one click away.",
  },
  {
    icon: "⏱️",
    title: "Timed, Fair Exams",
    desc: "Shuffle questions and options, enforce durations, and auto-submit when time runs out.",
  },
  {
    icon: "📱",
    title: "Works on Any Device",
    desc: "A fully responsive experience so students can take exams and teachers can manage content from anywhere.",
  },
  {
    icon: "📊",
    title: "Instant Insights",
    desc: "Track attempts, scores and evaluation status as soon as students submit.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span>🧭</span>
            <span>ExamVerse AI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 sm:px-4"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-16 text-center sm:px-6 sm:pt-20 sm:pb-24">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            ✨ AI-assisted exam creation
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Build, manage and take exams — faster, with AI on your side.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
            ExamVerse AI turns your documents into structured question banks, helps teachers assemble
            exams in minutes, and gives students a clean, distraction-free place to take them — on
            any device.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:w-auto"
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="w-full rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              I already have an account
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-2xl">{f.icon}</div>
                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Ready to modernize your exams?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
              Join as a student to take exams, or sign up and ask your institute admin to set you up
              as a teacher.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Get started for free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        © {new Date().getFullYear()} ExamVerse AI. All rights reserved.
      </footer>
    </div>
  );
}
