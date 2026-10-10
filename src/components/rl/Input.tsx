import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

function Field({
  label,
  hint,
  error,
  id,
  className,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="ui-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-ink-soft/70">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="ui-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">) {
  const auto = React.useId();
  const id = props.id ?? auto;
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="ui-input"
        {...props}
      />
    </Field>
  );
}

export function Textarea({
  label,
  hint,
  error,
  className,
  ...props
}: FieldProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">) {
  const auto = React.useId();
  const id = props.id ?? auto;
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="ui-input min-h-28 resize-y"
        {...props}
      />
    </Field>
  );
}
