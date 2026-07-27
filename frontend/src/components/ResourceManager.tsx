"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, Spinner, Alert } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Field";

export type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "date";

export interface ResourceField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  hint?: string;
}

export interface ResourceColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface ResourceManagerProps<T extends { id: string }> {
  title: string;
  description?: string;
  endpoint: string;
  columns: ResourceColumn<T>[];
  fields: ResourceField[];
  canDelete?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  defaultValues?: Record<string, unknown>;
  transformSubmit?: (values: Record<string, unknown>) => Record<string, unknown>;
}

function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

export function ResourceManager<T extends { id: string; [k: string]: unknown }>({
  title,
  description,
  endpoint,
  columns,
  fields,
  canDelete = true,
  canCreate = true,
  canEdit = true,
  defaultValues,
  transformSubmit,
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>(endpoint);
      setItems(extractList<T>(res));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...(defaultValues || {}) });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    const initial: Record<string, unknown> = {};
    fields.forEach((f) => {
      initial[f.name] = row[f.name] ?? "";
    });
    setForm(initial);
    setFormError(null);
    setModalOpen(true);
  };

  const handleChange = (name: string, value: unknown) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload: Record<string, unknown> = {};
      fields.forEach((f) => {
        const val = form[f.name];
        if (f.type === "number") {
          payload[f.name] = val === "" || val === undefined ? undefined : Number(val);
        } else if (f.type === "checkbox") {
          payload[f.name] = Boolean(val);
        } else {
          payload[f.name] = val === "" ? undefined : val;
        }
      });
      const finalPayload = transformSubmit ? transformSubmit({ ...payload, ...defaultValues }) : { ...payload, ...defaultValues };

      if (editing) {
        await api.patch(`${endpoint}/${editing.id}`, finalPayload);
      } else {
        await api.post(endpoint, finalPayload);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: T) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`${endpoint}/${row.id}`);
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Failed to delete.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
        {canCreate && (
          <Button onClick={openCreate} className="shrink-0">
            + Add {title.replace(/s$/, "")}
          </Button>
        )}
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          description="Get started by adding your first entry."
          action={
            canCreate ? (
              <Button size="sm" onClick={openCreate}>
                + Add {title.replace(/s$/, "")}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-x-auto p-0 md:block">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {canEdit && (
                          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {items.map((row) => (
              <Card key={row.id}>
                <div className="flex flex-col gap-1.5">
                  {columns.map((c) => (
                    <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{c.label}</span>
                      <span className="text-right font-medium text-slate-800 dark:text-slate-200">
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {canEdit && (
                    <Button size="sm" variant="outline" fullWidth onClick={() => openEdit(row)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button size="sm" variant="danger" fullWidth onClick={() => handleDelete(row)}>
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          {fields.map((f) => {
            const value = (form[f.name] as string | number | boolean | undefined) ?? "";
            if (f.type === "textarea") {
              return (
                <Textarea
                  key={f.name}
                  label={f.label}
                  required={f.required}
                  placeholder={f.placeholder}
                  hint={f.hint}
                  value={value as string}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              );
            }
            if (f.type === "select") {
              return (
                <Select
                  key={f.name}
                  label={f.label}
                  required={f.required}
                  hint={f.hint}
                  value={value as string}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  <option value="">Select {f.label.toLowerCase()}...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              );
            }
            if (f.type === "checkbox") {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.name])}
                    onChange={(e) => handleChange(f.name, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  {f.label}
                </label>
              );
            }
            return (
              <Input
                key={f.name}
                type={f.type}
                label={f.label}
                required={f.required}
                placeholder={f.placeholder}
                hint={f.hint}
                value={value as string}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            );
          })}
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
