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
    <html lang="en">
      <body>
        <TopBar
          user={user ? { name: user.name ?? user.email.split("@")[0]!, email: user.email } : null}
        />
        <main>{children}</main>
        <footer className="border-t border-ink-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink-500">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                &copy; {new Date().getFullYear()} Insta Lovon. Independent tool; not affiliated
                with Meta or Instagram.
              </div>
              <div className="flex gap-4">
                <Link href="/terms" className="hover:text-ink-700">Terms</Link>
                <Link href="/privacy" className="hover:text-ink-700">Privacy</Link>
                <Link href="/legal" className="hover:text-ink-700">Legal & ToS</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
