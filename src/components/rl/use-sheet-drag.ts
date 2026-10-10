"use client";

import * as React from "react";

const DISMISS_PX = 110;

/**
 * Drag-down-to-dismiss for bottom sheets. Spread the result on the grabber;
 * `onDismiss` fires once the sheet is dragged past the threshold.
 */
export function useSheetDrag(
  sheet: React.RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const start = React.useRef<number | null>(null);
  const set = (y: number) =>
    sheet.current?.style.setProperty("transform", y ? `translateY(${y}px)` : "");

  return {
    onPointerDown(e: React.PointerEvent) {
      start.current = e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
      sheet.current?.style.setProperty("transition", "none");
    },
    onPointerMove(e: React.PointerEvent) {
      if (start.current !== null) set(Math.max(0, e.clientY - start.current));
    },
    onPointerUp(e: React.PointerEvent) {
      if (start.current === null) return;
      const dy = e.clientY - start.current;
      start.current = null;
      sheet.current?.style.removeProperty("transition");
      set(0);
      if (dy > DISMISS_PX) onDismiss();
    },
    onPointerCancel() {
      start.current = null;
      set(0);
    },
  };
}
