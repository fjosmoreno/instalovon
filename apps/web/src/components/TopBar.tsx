"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  user: { name: string; email: string } | null;
}

export function TopBar({ user }: Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-xl"
          : "border-b border-transparent bg-ink-950/10 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display tracking-tight text-cream"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-cream text-sm font-bold shadow-glow-sm">
            IL
            <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-primary-soft/30 to-cream/20 opacity-60 blur-md" />
          </span>
          <span className="text-lg">
            Insta <span className="text-gradient-cream font-semibold">Lovon</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-ink-200 hover:text-cream transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/jobs/new" className="btn-primary">
                New analysis
                <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-ink-200 hover:text-cream transition-colors"
              >
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary">
                Get started
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
