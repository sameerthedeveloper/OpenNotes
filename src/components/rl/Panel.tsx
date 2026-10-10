import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("ui-panel flex min-h-0 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

/** Sticky frosted header: serif title, mono subtitle, icon buttons, one full-width primary pill. */
export function PanelHeader({
  title,
  subtitle,
  actions,
  primary,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  primary?: React.ReactNode;
}) {
  return (
    <header className="ui-panel-header sticky top-0 flex flex-col gap-3 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="ui-title truncate text-[22px]">{title}</h2>
          {subtitle && <p className="ui-label mt-0.5 truncate">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {primary}
    </header>
  );
}

export function PanelRail({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="ui-rail sticky top-0 z-20 flex gap-1 overflow-x-auto px-3" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          className="ui-tab"
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Scrolling surface (graph-grid) holding .ui-card sections. */
export function PanelBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "work-surface flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4",
        className,
      )}
      {...props}
    />
  );
}
