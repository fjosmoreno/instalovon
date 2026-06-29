import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero-gradient">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="pill-brand">Independent · Open architecture</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
              Instagram analytics,
              <br />
              <span className="bg-gradient-to-r from-brand via-brand-deep to-brand-teal bg-clip-text text-transparent">
                without the API limits.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-ink-600">
              Paste a public profile, get a structured report in seconds. Built on{" "}
              <strong>Instaloader</strong>, <strong>Crawlee</strong>, <strong>Playwright</strong>{" "}
              and <strong>Gemini AI</strong> — open source, transparent, yours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Create a free account
              </Link>
              <Link href="/login" className="btn-ghost">
                I have an account
              </Link>
            </div>
            <p className="mt-6 text-xs text-ink-500">
              Public profiles only. We do not require login credentials and we do not download
              media. By using this service you agree to our{" "}
              <Link href="/terms" className="underline">Terms</Link> and{" "}
              <Link href="/legal" className="underline">Legal notice</Link>.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-ink-200 bg-white p-6 shadow-glow">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand via-brand-gold to-brand-teal" />
                <div>
                  <div className="font-semibold text-ink-900">@exemplo</div>
                  <div className="text-xs text-ink-500">123k followers · 480 posts</div>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-ink-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Strengths
                  </div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-700">
                    <li>High reels engagement vs industry baseline</li>
                    <li>Niche-aligned hashtag mix</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-ink-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Suggestions
                  </div>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-700">
                    <li>Post 3-4x/week between 18h-21h</li>
                    <li>Add captions longer than 80 chars</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-brand/5 to-brand-teal/5 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand">
                    AI Summary
                  </div>
                  <p className="mt-1 text-ink-700">
                    Growth is on a 12-week uptrend with strong reel velocity. Consider doubling down
                    on educational carousels…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold text-ink-900">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand">1</div>
            <h3 className="mt-2 text-lg font-semibold text-ink-900">Paste a public URL</h3>
            <p className="mt-2 text-sm text-ink-600">
              instagram.com/yourbrand — public profiles only, no login required.
            </p>
          </div>
          <div className="card">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand">2</div>
            <h3 className="mt-2 text-lg font-semibold text-ink-900">We extract the data</h3>
            <p className="mt-2 text-sm text-ink-600">
              Instaloader pulls public metadata. Crawlee + Playwright handle complex flows when
              needed.
            </p>
          </div>
          <div className="card">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand">3</div>
            <h3 className="mt-2 text-lg font-semibold text-ink-900">Get a report</h3>
            <p className="mt-2 text-sm text-ink-600">
              Gemini structures strengths, weaknesses, and concrete next steps. Exportable, shareable.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ink-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-bold text-ink-900">Built on proven tools</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Instaloader", "MIT", "Instagram metadata extraction"],
              ["Crawlee", "Apache 2.0", "Orchestration, queues, proxies"],
              ["Playwright", "Apache 2.0", "Browser automation for complex flows"],
              ["Gemini", "Commercial API", "Structured AI reports"],
            ].map(([name, license, desc]) => (
              <div key={name} className="rounded-2xl border border-ink-200 bg-white p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-brand">{license}</div>
                <div className="mt-1 text-lg font-semibold text-ink-900">{name}</div>
                <p className="mt-1 text-sm text-ink-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
