import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { currentUser } from "@/lib/session";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "Insta Lovon — Instagram Analytics",
  description:
    "Independent Instagram analytics. Built on top of Instaloader, Crawlee, Playwright and Gemini AI.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <html lang="en" className="dark">
      <body className="text-cream">
        <TopBar
          user={
            user
              ? {
                  name: user.name ?? user.email.split("@")[0]!,
                  email: user.email,
                }
              : null
          }
        />
        <main className="relative">{children}</main>
        <footer className="border-t border-white/[0.05] bg-ink-950/60 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-200/70">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-cream text-xs font-bold shadow-glow-sm">
                  IL
                </span>
                <div>
                  <div className="text-cream font-medium">Insta Lovon</div>
                  <div className="text-[12px] text-ink-300">
                    &copy; {new Date().getFullYear()} · Independent tool; not affiliated with Meta or Instagram.
                  </div>
                </div>
              </div>
              <div className="flex gap-5">
                <Link href="/terms" className="hover:text-cream transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-cream transition-colors">Privacy</Link>
                <Link href="/legal" className="hover:text-cream transition-colors">Legal & ToS</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
