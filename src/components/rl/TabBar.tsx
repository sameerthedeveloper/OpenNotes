"use client";

import * as React from "react";

type Tab = { value: string; label: string; icon: React.ReactNode };

/**
 * Floating liquid-glass capsule (3 tabs). The lens slides via --tab-index.
 * Sits at home-indicator inset minus 14px (min 6px); hides while a field is focused.
 */
export function TabBar({
  tabs,
  value,
  onChange,
}: {
  tabs: [Tab, Tab, Tab];
  value: string;
  onChange: (v: string) => void;
}) {
  const [typing, setTyping] = React.useState(false);

  React.useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    const on = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const off = () => setTyping(false);
    document.addEventListener("focusin", on);
    document.addEventListener("focusout", off);
    return () => {
      document.removeEventListener("focusin", on);
      document.removeEventListener("focusout", off);
    };
  }, []);

  const index = tabs.findIndex((t) => t.value === value);

  return (
    <nav
      aria-label="Primary"
      hidden={typing}
      className="fixed inset-x-0 bottom-[max(6px,calc(env(safe-area-inset-bottom)-14px))] z-40 mx-auto w-[min(22rem,calc(100%-2rem))] md:hidden"
    >
      <div className="ui-tabbar" style={{ "--tab-index": Math.max(0, index) } as React.CSSProperties}>
        {index >= 0 && <span className="ui-tabbar-lens" aria-hidden />}
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            className="ui-tabbar-item"
            aria-current={t.value === value ? "page" : undefined}
            onClick={() => onChange(t.value)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
