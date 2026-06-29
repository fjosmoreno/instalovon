import Link from "next/link";
import { Logo3D } from "@/components/Logo3D";
import { MockReport } from "@/components/MockReport";
import { GitFork, ScanEye, WandSparkles } from "@/components/icons";

const features = [
  {
    icon: ScanEye,
    title: "Public-only data extraction",
    body:
      "No login, no credentials, no media downloads. We pull public metadata only — the way the developer community recommended Instaloader to be used.",
  },
  {
    icon: GitFork,
    title: "Distributed by design",
    body:
      "A polling worker, idempotent job claims via Postgres SKIP LOCKED, optional Crawlee + Playwright flows for hard cases, and free-proxy fallback that degrades gracefully.",
  },
  {
    icon: WandSparkles,
    title: "AI report that actually helps",
    body:
      "Gemini reads the snapshot and produces a structured report: strengths, weaknesses, opportunities, content pillars, and concrete next steps.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-[-10%] h-[480px] w-[480px] rounded-full bg-primary-soft/20 blur-3xl animate-pulse-glow" />
          <div className="absolute right-[-20%] top-[10%] h-[520px] w-[520px] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[20%] h-[360px] w-[360px] rounded-full bg-cream-soft/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr,1fr] lg:pb-28 lg:pt-28">
          <div className="flex flex-col justify-center animate-fade-up">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-cream-soft backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cream-soft animate-pulse" />
              Independent · Open architecture
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Instagram analytics,
              <br />
              <span className="text-gradient-dusk">
                without the API limits.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-ink-200">
              Paste a public profile URL. We extract the public metadata,
              distill it with AI, and hand you a report that reads like a
              strategist wrote it. Built on{" "}
              <span className="text-cream">Instaloader</span>,{" "}
              <span className="text-cream">Crawlee</span>,{" "}
              <span className="text-cream">Playwright</span> and{" "}
              <span className="text-cream">Gemini</span> — open source,
              transparent, yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary">
                Create a free account
                <span aria-hidden>→</span>
              </Link>
              <Link href="/login" className="btn-secondary">
                I already have one
              </Link>
            </div>
            <p className="mt-6 text-xs text-ink-300">
              Public profiles only. We never require Instagram credentials
              and we do not download media. By using this service you agree
              to our{" "}
              <Link href="/terms" className="underline hover:text-cream">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal" className="underline hover:text-cream">
                Legal notice
              </Link>
              .
            </p>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <Logo3D />
          </div>
        </div>
      </section>

      {/* Report preview */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="card gradient-border relative overflow-hidden p-0">
          <MockReport />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="h-eyebrow">Why Insta Lovon</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Built like a tool, not like a toy.
            </h2>
          </div>
          <Link
            href="/signup"
            className="hidden text-sm text-cream-soft hover:text-cream md:inline-flex"
          >
            Start analyzing →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card group">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft/30 to-primary/30 text-cream-soft">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-200">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="relative pb-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 pt-20">
          <span className="h-eyebrow">Stack</span>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Built on proven, auditable tools.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Instaloader",
                license: "MIT",
                desc: "Instagram public metadata extraction",
              },
              {
                name: "Crawlee",
                license: "Apache 2.0",
                desc: "Orchestration, queues, proxy rotation",
              },
              {
                name: "Playwright",
                license: "Apache 2.0",
                desc: "Browser automation for complex flows",
              },
              {
                name: "Gemini",
                license: "Google API",
                desc: "Structured AI reports (Headroom-ready)",
              },
            ].map((s) => (
              <div key={s.name} className="card group">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream-soft/70">
                  {s.license}
                </div>
                <div className="mt-1 font-display text-xl font-semibold tracking-tight">
                  {s.name}
                </div>
                <p className="mt-2 text-sm text-ink-200">{s.desc}</p>
                <div className="mt-5 h-px bg-gradient-to-r from-primary-soft/40 via-transparent to-transparent" />
                <div className="mt-3 text-[11px] text-ink-300 group-hover:text-cream-soft transition-colors">
                  Open & auditable
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
