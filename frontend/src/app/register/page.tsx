"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Misc";

export default function RegisterPage() {
  const { register, registerInstitute } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"student" | "institute">("student");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Institute specific fields
  const [instituteName, setInstituteName] = useState("");
  const [instituteCode, setInstituteCode] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (mode === "student") {
        await register(name, email, password);
        router.push("/dashboard");
      } else {
        const result = await registerInstitute({
          instituteName,
          instituteCode,
          name,
          email,
          password,
          phone,
          website,
          address,
        });
        setSuccessMessage(result.message);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
            <span>🧭</span>
            <span>ExamVerse AI</span>
          </Link>
          <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {mode === "student"
              ? "Sign up as a student or individual candidate."
              : "Register your educational institute. Admin approval is required before logging in."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="mb-6 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode("student");
              setError(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "student"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("institute");
              setError(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "institute"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Institute Signup
          </button>
        </div>

        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm dark:border-emerald-900 dark:bg-emerald-950/40">
            <div className="text-3xl">⏳</div>
            <h2 className="mt-3 text-lg font-bold text-emerald-900 dark:text-emerald-200">
              Registration Submitted
            </h2>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </p>
            <div className="mt-6">
              <Link href="/login">
                <Button fullWidth>Return to Login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {error && <Alert>{error}</Alert>}

            {mode === "institute" && (
              <>
                <div className="rounded-lg bg-indigo-50/70 p-3 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
                  📋 <strong>Note:</strong> Institute registration requires admin review. After submitting, an administrator will approve your request.
                </div>
                <Input
                  label="Institute Name"
                  required
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  placeholder="Springfield Institute of Technology"
                />
                <Input
                  label="Institute Code"
                  required
                  value={instituteCode}
                  onChange={(e) => setInstituteCode(e.target.value)}
                  placeholder="SIT-2026"
                  hint="A unique short identifier for your institute."
                />
              </>
            )}

            <Input
              label={mode === "institute" ? "Contact Person Name" : "Full name"}
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
            <Input
              label={mode === "institute" ? "Official Institute Email" : "Email"}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@institute.edu"
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              hint="Must include uppercase, lowercase, number and special character."
            />

            {mode === "institute" && (
              <>
                <Input
                  label="Phone Number (Optional)"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                />
                <Input
                  label="Website (Optional)"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://institute.edu"
                />
                <Input
                  label="Address (Optional)"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Academic Way, City"
                />
              </>
            )}

            <Button type="submit" loading={loading} fullWidth>
              {mode === "student" ? "Create Account" : "Submit Institute Request"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
