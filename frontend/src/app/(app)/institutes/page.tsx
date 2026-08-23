"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, Spinner, Alert } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Field";

interface Institute {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | string;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export default function InstitutesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [allInstitutes, setAllInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Filter: "ALL" | "PENDING" | "APPROVED" | "SUSPENDED"
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const institutes = useMemo(() => {
    return allInstitutes.filter((inst) => {
      const matchesStatus =
        selectedStatus === "ALL"
          ? true
          : selectedStatus === "PENDING"
          ? !inst.isApproved || inst.status === "PENDING"
          : selectedStatus === "APPROVED"
          ? inst.isApproved && !inst.isSuspended
          : selectedStatus === "SUSPENDED"
          ? inst.isSuspended || inst.status === "SUSPENDED"
          : true;

      const matchesSearch =
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.code.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [allInstitutes, selectedStatus, search]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Institute | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  const loadInstitutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ institutes: Institute[] } | Institute[]>("/institutes?limit=100");

      const list = Array.isArray(res) ? res : res.institutes || [];
      setAllInstitutes(list);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load institutes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstitutes();
  }, [loadInstitutes]);

  const openCreateModal = () => {
    setEditing(null);
    setName("");
    setCode("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setAddress("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (inst: Institute) => {
    setEditing(inst);
    setName(inst.name);
    setCode(inst.code);
    setEmail(inst.email || "");
    setPhone(inst.phone || "");
    setWebsite(inst.website || "");
    setAddress(inst.address || "");
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name,
        code,
        email: email || undefined,
        phone: phone || undefined,
        website: website || undefined,
        address: address || undefined,
      };

      if (editing) {
        await api.patch(`/institutes/${editing.id}`, payload);
      } else {
        await api.post("/institutes", payload);
      }
      setModalOpen(false);
      await loadInstitutes();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Failed to save institute.");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/institutes/${id}/approve`);
      await loadInstitutes();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to approve institute.");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Are you sure you want to suspend this institute? Users of this institute will not be able to log in.")) return;
    try {
      await api.patch(`/institutes/${id}/suspend`);
      await loadInstitutes();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to suspend institute.");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await api.patch(`/institutes/${id}/reactivate`);
      await loadInstitutes();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to reactivate institute.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this institute? All associated data will be unlinked or deleted.")) return;
    try {
      await api.delete(`/institutes/${id}`);
      await loadInstitutes();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to delete institute.");
    }
  };

  const renderStatusBadge = (status: string, isApproved: boolean, isSuspended: boolean) => {
    if (isSuspended || status === "SUSPENDED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          🚫 Suspended
        </span>
      );
    }
    if (!isApproved || status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          ⏳ Pending Approval
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
        ✅ Approved
      </span>
    );
  };

  const pendingCount = allInstitutes.filter(i => !i.isApproved || i.status === "PENDING").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            🏛️ Institute Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? "Review, approve, suspend, edit, or remove registered institutes on the platform."
              : "View and manage your institute details."}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreateModal} className="shrink-0">
            + Add New Institute
          </Button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      {isAdmin && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: "ALL", label: "All Institutes" },
              { id: "PENDING", label: `Pending Approval (${pendingCount})` },
              { id: "APPROVED", label: "Approved" },
              { id: "SUSPENDED", label: "Suspended" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedStatus === tab.id
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && <Alert>{error}</Alert>}

      {/* Table / Cards */}
      {loading ? (
        <Spinner />
      ) : institutes.length === 0 ? (
        <EmptyState
          title="No institutes found"
          description={
            selectedStatus === "PENDING"
              ? "There are no pending institute registration requests right now."
              : "No institutes match your current search or filter."
          }
          action={
            isAdmin ? (
              <Button size="sm" onClick={openCreateModal}>
                + Add Institute
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Institute</th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Contact Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {institutes.map((inst) => {
                const isPending = !inst.isApproved || inst.status === "PENDING";
                const isSuspended = inst.isSuspended || inst.status === "SUSPENDED";

                return (
                  <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{inst.name}</div>
                      {inst.address && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{inst.address}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {inst.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {inst.email || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(inst.status, inst.isApproved, inst.isSuspended)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {isAdmin && isPending && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApprove(inst.id)}
                          >
                            Approve
                          </Button>
                        )}

                        {isAdmin && !isPending && !isSuspended && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            onClick={() => handleSuspend(inst.id)}
                          >
                            Suspend
                          </Button>
                        )}

                        {isAdmin && isSuspended && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleReactivate(inst.id)}
                          >
                            Reactivate
                          </Button>
                        )}

                        <Button size="sm" variant="outline" onClick={() => openEditModal(inst)}>
                          Edit
                        </Button>

                        {isAdmin && (
                          <Button size="sm" variant="danger" onClick={() => handleDelete(inst.id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Modal for Add / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Institute" : "Add New Institute"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <Input
            label="Institute Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Springfield Institute of Technology"
          />
          <Input
            label="Institute Code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SIT-2026"
            hint="Unique code for institute identification."
          />
          <Input
            label="Contact Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@institute.edu"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
          />
          <Input
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://institute.edu"
          />
          <Textarea
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Academic Way, City"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save Changes" : "Create Institute"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
