"use client";

import * as React from "react";
import { Segmented } from "./Button";

export type InterfaceStyle = "modern" | "classic";
export const UI_STYLE_KEY = "opennotes-ui";

/**
 * Inline script for <head>: sets <html data-ui> from localStorage before first paint.
 * Render with dangerouslySetInnerHTML in the root layout.
 */
export const interfaceStyleScript = `try{var u=localStorage.getItem("${UI_STYLE_KEY}");document.documentElement.dataset.ui=u==="classic"?"classic":"modern"}catch(e){document.documentElement.dataset.ui="modern"}`;

/**
 * `persist` is the hook point for saving to the user's account
 * (e.g. an updateDoc on users/{uid}.interfaceStyle).
 */
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};
const read = (): InterfaceStyle =>
  document.documentElement.dataset.ui === "classic" ? "classic" : "modern";

export function useInterfaceStyle(persist?: (v: InterfaceStyle) => void) {
  const style = React.useSyncExternalStore<InterfaceStyle>(subscribe, read, () => "modern");

  const update = React.useCallback(
    (v: InterfaceStyle) => {
      document.documentElement.dataset.ui = v;
      try {
        localStorage.setItem(UI_STYLE_KEY, v);
      } catch {}
      listeners.forEach((l) => l());
      persist?.(v);
    },
    [persist],
  );

  return [style, update] as const;
}

export function InterfaceStyleSetting({
  persist,
}: {
  persist?: (v: InterfaceStyle) => void;
}) {
  const [style, setStyle] = useInterfaceStyle(persist);
  return (
    <Segmented<InterfaceStyle>
      label="Interface style"
      value={style}
      onChange={setStyle}
      options={[
        { value: "modern", label: "Modern" },
        { value: "classic", label: "Classic" },
      ]}
    />
  );
}
