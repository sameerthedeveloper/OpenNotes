"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false during SSR/hydration, true afterwards — gate for portals. */
export function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}
