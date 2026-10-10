"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEscapeStack } from "./use-escape-stack";
import { IconButton } from "./Button";

const DISMISS_PX = 110;

/**
 * Portal'd dialog. Esc closes top-most only, backdrop click closes, focus is
 * restored on close. Below `sm` it is a bottom sheet; the grabber drags down to dismiss.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const titleId = React.useId();
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  useEscapeStack(open, onClose);

  // focus in / restore, lock body scroll
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open]);

  // keep Tab inside the dialog
  const trap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const items = sheetRef.current.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const setOffset = (y: number) => {
    sheetRef.current?.style.setProperty("transform", y ? `translateY(${y}px)` : "");
  };
  const onDown = (e: React.PointerEvent) => {
    drag.current = { y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    sheetRef.current?.style.setProperty("transition", "none");
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag.current) setOffset(Math.max(0, e.clientY - drag.current.y));
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    drag.current = null;
    sheetRef.current?.style.removeProperty("transition");
    setOffset(0);
    if (dy > DISMISS_PX) onClose();
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div className="ui-modal-backdrop absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={trap}
        className={cn(
          "ui-modal relative flex max-h-[92dvh] w-full flex-col outline-none transition-transform duration-200 sm:max-w-lg",
          className,
        )}
      >
        <div
          className="flex cursor-grab touch-none justify-center pb-1 pt-3 sm:hidden"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden
        >
          <span className="h-1.5 w-10 rounded-full bg-black/15" />
        </div>
        <header className="flex items-center gap-3 px-6 pb-2 pt-3 sm:pt-6">
          <h2 id={titleId} className="ui-title flex-1 text-[22px]">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-3">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-black/[0.06] px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
