"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type ToastItem = { id: number; message: string };
const Ctx = React.createContext<(message: string) => void>(() => {});

export const useToast = () => React.useContext(Ctx);

/** Bottom pill toasts, auto-dismiss after 4s. Wrap the app once. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const seq = React.useRef(0);
  React.useEffect(() => setMounted(true), []);

  const push = React.useCallback((message: string) => {
    const id = ++seq.current;
    setItems((cur) => [...cur, { id, message }]);
    window.setTimeout(() => setItems((cur) => cur.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4"
          >
            {items.map((t) => (
              <div key={t.id} role="status" className="ui-toast">
                {t.message}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}
