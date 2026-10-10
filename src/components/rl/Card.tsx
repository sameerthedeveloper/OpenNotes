import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Section card: serif title, optional mono index, green check when complete. */
export function Card({
  title,
  index,
  complete,
  actions,
  className,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title?: string;
  index?: string;
  complete?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <section className={cn("ui-card p-5", className)} {...props}>
      {(title || index) && (
        <header className="mb-4 flex items-center gap-3">
          {index && <span className="ui-label">{index}</span>}
          {title && <h3 className="ui-title text-[17px]">{title}</h3>}
          {complete && (
            <span
              role="img"
              aria-label="Complete"
              className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white"
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
          )}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
