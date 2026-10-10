"use client";

import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UI_STYLE_KEY } from "@/components/rl/interface-style";

/** On sign-in, applies the interface style saved on the user's account. */
export default function InterfaceStyleSync() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    getDoc(doc(db, "users", uid))
      .then((snap) => {
        const v = snap.data()?.interfaceStyle;
        if (cancelled || (v !== "modern" && v !== "classic")) return;
        document.documentElement.dataset.ui = v;
        try {
          localStorage.setItem(UI_STYLE_KEY, v);
        } catch {}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return null;
}
