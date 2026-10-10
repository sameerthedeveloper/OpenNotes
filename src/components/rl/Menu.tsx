"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useEscapeStack } from "./use-escape-stack";

type Item = {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  danger?: boolean;
};

/**
 * Portal'd dropdown. Closes on outside click, Esc, scroll and resize.
 * `trigger` receives props to spread on the button that opens it.
 */
export function Menu({
  items,
  label,
  trigger,
  align = "end",
}: {
  items: Item[];
  label: string;
  align?: "start" | "end";
  trigger: (p: {
    ref: React.Ref<HTMLButtonElement>;
    onClick: () => void;
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
  }) => React.ReactNode;
}) {
  const btn = React.useRef<HTMLButtonElement>(null);
  const list = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const open = pos !== null;

  const close = React.useCallback(() => {
    setPos(null);
    btn.current?.focus();
  }, []);
  useEscapeStack(open, close);

  const toggle = () => {
    if (open) return close();
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const w = 208;
    const left = align === "end" ? r.right - w : r.left;
    setPos({
      top: r.bottom + 8,
      left: Math.max(8, Math.min(left, window.innerWidth - w - 8)),
    });
  };

  React.useEffect(() => {
    if (!open) return;
    const dismiss = () => setPos(null);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!list.current?.contains(t) && !btn.current?.contains(t)) dismiss();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    list.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const els = Array.from(list.current?.querySelectorAll<HTMLElement>("button") ?? []);
    const i = els.indexOf(document.activeElement as HTMLElement);
    const n = e.key === "ArrowDown" ? i + 1 : i - 1;
    els[(n + els.length) % els.length]?.focus();
  };

  return (
    <>
      {trigger({
        ref: btn,
        onClick: toggle,
        "aria-haspopup": "menu",
        "aria-expanded": open,
      })}
      {open &&
        createPortal(
          <div
            ref={list}
            role="menu"
            aria-label={label}
            onKeyDown={onKey}
            style={{ top: pos.top, left: pos.left }}
            className={cn("ui-menu fixed z-[60] w-52 p-1.5")}
          >
            {items.map((it) => (
              <button
                key={it.label}
                role="menuitem"
                type="button"
                data-danger={it.danger || undefined}
                className="ui-menu-item"
                onClick={() => {
                  setPos(null);
                  it.onSelect();
                }}
              >
                {it.icon}
                {it.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
