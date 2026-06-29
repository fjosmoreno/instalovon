import Link from "next/link";

interface Props {
  user: { name: string; email: string } | null;
}

export function TopBar({ user }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand via-brand-deep to-brand-teal text-white">
            IL
          </span>
          <span className="text-lg tracking-tight">Insta Lovon</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/dashboard" className="text-ink-700 hover:text-ink-900">
                Dashboard
              </Link>
              <Link href="/jobs/new" className="btn-primary">
                New analysis
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink-700 hover:text-ink-900">
                Sign in
              </Link>
              <Link href="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
