"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PenLine,
  ShieldCheck,
  CloudCheck,
  Share2,
  LayoutGrid,
  Zap,
  ArrowRight,
  LayoutDashboard,
  Notebook,
  Compass,
  Bookmark,
  Globe,
  Pin,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/rl";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    icon: PenLine,
    title: "TipTap Rich Text Editor",
    description:
      "Complete formatting toolbar with support for headings, tables, task lists, code blocks, images, and embedded video.",
  },
  {
    icon: ShieldCheck,
    title: "DOMPurify XSS Protection",
    description:
      "Strict HTML sanitization ensures your shared notes remain secure, removing malicious scripts and unsafe tags.",
  },
  {
    icon: CloudCheck,
    title: "Real-Time Cloud Sync",
    description:
      "Instant Firestore synchronization with auto-save and continuous viewer tracking.",
  },
  {
    icon: Share2,
    title: "Seamless Sharing & Export",
    description:
      "Share notes via public links or export notes to PDF, DOCX (Word), HTML, and direct Print.",
  },
  {
    icon: LayoutGrid,
    title: "Calm Interface",
    description:
      "A clean, editorial reading and writing experience on warm paper tones.",
  },
  {
    icon: Zap,
    title: "HTML Search & Highlighting",
    description:
      "Search deep inside raw HTML content with automated match highlighting and tag filters.",
  },
];

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const deviceRef = useRef(null);

  // Product screenshot tilts back, then flattens as it scrolls into view.
  useEffect(() => {
    const el = deviceRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotateX: 16, scale: 0.94 },
        {
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="app-canvas min-h-screen">
      <header className="sticky top-4 z-40 mx-auto mt-4 w-[min(64rem,calc(100%-2rem))]">
        <nav
          aria-label="Site"
          className="ui-panel flex items-center justify-between !rounded-full py-2 pr-2 pl-5"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-lg" />
            <span className="ui-title text-[19px]">OpenNotes</span>
          </Link>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-4 pt-16 text-center md:pt-24">
          <span className="ui-chip mb-6">Version 2.0 · Modernization released</span>

          <h1 className="ui-title mb-6 text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
            Create, collaborate &amp; share notes{" "}
            <span className="text-brand">effortlessly</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Secure HTML-based rich text note taking, automated Markdown
            migration, real-time viewer tracking, and export options.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {currentUser ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Product screenshot in a dark device frame */}
        <section className="mx-auto mt-16 max-w-4xl px-4 [perspective:1400px]">
          <div
            ref={deviceRef}
            className="rounded-[2rem] bg-ink p-3 shadow-modal [transform-origin:50%_0]"
          >
            <div className="overflow-hidden rounded-[1.5rem] bg-paper">
              <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-black/15" />
                <span className="size-2.5 rounded-full bg-black/15" />
                <span className="size-2.5 rounded-full bg-black/15" />
                <span className="ui-chip ml-3 !py-1 text-[11px]">opennotes.app/dashboard</span>
              </div>
              <div className="work-surface flex text-left">
                <div className="hidden w-48 shrink-0 flex-col gap-1 border-r border-black/[0.06] p-3 sm:flex">
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                    { icon: Notebook, label: "My Notes" },
                    { icon: Compass, label: "Discover" },
                    { icon: Bookmark, label: "Bookmarks" },
                  ].map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className="ui-nav pointer-events-none !min-h-9 text-xs"
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-3.5" />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                  {[
                    { title: "Theory of Computation", tag: "TOC", pinned: true },
                    { title: "A* Search Algorithm", tag: "AI", pinned: false },
                  ].map(({ title, tag, pinned }) => (
                    <div key={title} className="ui-card flex flex-col gap-2 p-4">
                      <div className="flex items-center justify-between">
                        <p className="ui-title text-[15px]">{title}</p>
                        {pinned ? (
                          <Pin className="size-3.5 text-brand" />
                        ) : (
                          <Globe className="size-3.5 text-ink-soft" />
                        )}
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-black/[0.05]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-black/[0.05]" />
                      <Badge variant="secondary" className="w-fit text-[10px]">
                        #{tag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <h2 className="ui-title mb-3 text-center text-3xl md:text-5xl">
            Everything you need in a note platform
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-ink-soft">
            Designed with state-of-the-art security, performance, and
            accessibility.
          </p>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="ui-card h-full p-6">
                <span className="ui-tile mb-4 size-10">
                  <Icon className="size-5" />
                </span>
                <h3 className="ui-title mb-1.5 text-[17px]">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
              </article>
            ))}
          </Reveal>
        </section>

        {/* Dark rounded closing panel */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-[2rem] bg-ink px-6 py-16 text-center shadow-modal md:py-20">
            <h2 className="mx-auto mb-4 max-w-2xl font-display text-3xl font-bold tracking-[-0.02em] text-paper text-balance md:text-5xl">
              Start writing something worth sharing
            </h2>
            <p className="mx-auto mb-8 max-w-md text-paper/70">
              Free forever. No credit card required.
            </p>
            <Button size="lg" asChild>
              <Link href={currentUser ? "/dashboard" : "/signup"}>
                {currentUser ? "Open dashboard" : "Create your account"}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
