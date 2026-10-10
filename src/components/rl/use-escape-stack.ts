"use client";

import { useEffect } from "react";

/** Module-level stack so Esc only closes the top-most layer (modal over menu, etc.). */
const stack: symbol[] = [];

export function useEscapeStack(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const id = Symbol("layer");
    stack.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === id) {
        e.stopPropagation();
        onEscape();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      const i = stack.indexOf(id);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [active, onEscape]);
}
