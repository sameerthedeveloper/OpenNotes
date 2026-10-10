import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "hero";

/**
 * `hero` = the full-width pill (.ui-primary, 48px) used under panel headers.
 * Other variants are dialog buttons (.ui-btn).
 */
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        variant === "hero" ? "ui-primary" : "ui-btn",
        variant === "primary" && "ui-btn-primary",
        variant === "secondary" && "ui-btn-secondary",
        variant === "danger" && "ui-btn-danger",
        className,
      )}
      {...props}
    />
  );
});

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function IconButton({ label, className, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn("ui-icon-btn", className)}
      {...props}
    />
  );
});

/** Segmented group (.ui-seg): list/grid toggle, Modern|Classic, etc. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode; aria?: string }[];
  label: string;
}) {
  return (
    <div className="ui-seg p-0.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          aria-label={o.aria}
          className="ui-seg-item"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("ui-chip", className)} {...props} />;
}

export function Tile({ children }: { children: React.ReactNode }) {
  return <span className="ui-tile">{children}</span>;
}

export function NavItem({
  active,
  icon,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="ui-nav"
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
