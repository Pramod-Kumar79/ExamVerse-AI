"use client";

import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const base =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950";

export function FieldWrap({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Input(
  props: InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    hint?: string;
  },
) {
  const { label, error, hint, className = "", id, required, ...rest } = props;
  return (
    <FieldWrap label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input id={id} className={`${base} ${className}`} {...rest} />
    </FieldWrap>
  );
}

export function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    hint?: string;
  },
) {
  const { label, error, hint, className = "", id, required, ...rest } = props;
  return (
    <FieldWrap label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea id={id} className={`${base} min-h-[90px] ${className}`} {...rest} />
    </FieldWrap>
  );
}

export function Select(
  props: SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    hint?: string;
  },
) {
  const { label, error, hint, className = "", id, required, children, ...rest } = props;
  return (
    <FieldWrap label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select id={id} className={`${base} ${className}`} {...rest}>
        {children}
      </select>
    </FieldWrap>
  );
}
