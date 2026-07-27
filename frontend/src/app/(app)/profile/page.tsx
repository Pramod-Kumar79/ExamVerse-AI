"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Card, Alert, Badge } from "@/components/ui/Misc";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    setPwError(null);
    setPwSuccess(null);
    try {
      await api.patch("/users/change-password", { currentPassword, newPassword });
      setPwSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.patch("/users/me", { name });
      await refreshUser();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const copyId = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account details.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <Badge color="indigo">{user?.role}</Badge>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {error && <Alert>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" value={user?.email || ""} disabled />
          <Button type="submit" loading={saving} className="self-start">
            Save changes
          </Button>
        </form>
      </Card>

      <Card>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Your User ID</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Share this with your institute admin so they can link your teacher or student profile.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {user?.id}
          </code>
          <Button size="sm" variant="outline" onClick={copyId} type="button">
            {copied ? "Copied ✓" : "Copy"}
          </Button>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          Change password
        </p>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {pwError && <Alert>{pwError}</Alert>}
          {pwSuccess && <Alert variant="success">{pwSuccess}</Alert>}
          <Input
            label="Current password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" loading={pwSaving} className="self-start">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
