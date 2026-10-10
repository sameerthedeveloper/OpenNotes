"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Type,
  Search,
  Bookmark,
  Share2,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FullscreenLoader from "@/components/FullscreenLoader";

const FEATURES = [
  { icon: BookOpen, label: "Beautiful HTML Notes", desc: "Write stunning notes with rich formatting" },
  { icon: Type, label: "Rich Text Editor", desc: "TipTap-powered block editor experience" },
  { icon: FolderOpen, label: "Collections", desc: "Organize notes into themed collections" },
  { icon: Search, label: "Instant Search", desc: "Find anything across all your notes" },
  { icon: Bookmark, label: "Bookmarks", desc: "Save important notes for quick access" },
  { icon: Share2, label: "Share Anywhere", desc: "Public links and exports in one click" },
];

const BrandPanel = () => (
  <section className="ui-panel hidden w-[45%] max-w-xl shrink-0 flex-col justify-center overflow-hidden p-10 md:flex lg:p-14">
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="OpenNotes" width={44} height={44} className="rounded-[14px]" />
        <span className="ui-title text-[22px]">OpenNotes</span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="ui-title text-[2.25rem] leading-[1.1] lg:text-[2.75rem]">
          Organize knowledge.
          <br />
          Share ideas.
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
          A calm workspace for creating, organizing, and collaborating on
          beautiful notes.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FEATURES.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="ui-tile size-9">
              <Icon className="size-4" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">{label}</span>
              <span className="text-xs text-ink-soft">{desc}</span>
            </div>
          </div>
        ))}
      </div>

      <span className="ui-chip w-fit">
        <span className="size-2 rounded-full bg-emerald-600" />
        Free forever · No credit card required
      </span>
    </div>
  </section>
);

const FormPanel = ({ children }) => (
  <section className="ui-panel work-surface relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10 sm:px-8 md:px-10">
    <div className="mb-8 flex items-center gap-2.5 md:hidden">
      <Image src="/logo.svg" alt="OpenNotes" width={40} height={40} className="rounded-xl" />
      <span className="ui-title text-[22px]">OpenNotes</span>
    </div>

    <div className="ui-card w-full max-w-md p-6 sm:p-8">{children}</div>

    <p className="ui-label mt-8 text-center normal-case tracking-normal">
      By continuing, you agree to our <span className="font-semibold text-ink">Terms</span>{" "}
      &amp; <span className="font-semibold text-ink">Privacy Policy</span>
    </p>
  </section>
);

const AuthLayout = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  useEffect(() => {
    if (!loading && currentUser) {
      router.replace(from);
    }
  }, [loading, currentUser, from, router]);

  if (loading || currentUser) {
    return <FullscreenLoader />;
  }

  return (
    <div className="app-canvas flex min-h-dvh gap-4 p-4 md:h-dvh">
      <BrandPanel />
      <FormPanel>{children}</FormPanel>
    </div>
  );
};

export default AuthLayout;
