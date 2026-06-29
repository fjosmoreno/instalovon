import type { AIReport, InstagramProfileSnapshot } from "@instalovon/shared";
import { ProfileCard } from "./ProfileCard";
import { Check, ScanEye } from "@/components/icons";

interface Props {
  profiles: InstagramProfileSnapshot[];
  report: AIReport | null;
}

export function ReportView({ profiles, report }: Props) {
  return (
    <div className="mt-8 space-y-8">
      {report ? <AISummaryCard report={report} /> : (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">
          The AI report could not be generated. Raw profile data is shown below.
        </div>
      )}

      {profiles.length > 0 ? (
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Profile snapshots
            </h2>
            <span className="text-xs text-ink-300">
              {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {profiles.map((p) => (
              <ProfileCard key={p.username} profile={p} />
            ))}
          </div>
        </section>
      ) : null}

      {report ? <ReportSections sections={report.sections} /> : null}
    </div>
  );
}

function AISummaryCard({ report }: { report: AIReport }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] p-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 60% at 0% 0%, rgba(147, 80, 115, 0.30), transparent 60%), radial-gradient(80% 70% at 100% 0%, rgba(80, 45, 85, 0.35), transparent 60%), linear-gradient(180deg, rgba(31,23,38,0.6), rgba(20,16,26,0.4))",
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="pill-brand">AI summary</span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
          model: {report.model}
        </span>
      </div>
      <p className="mt-4 max-w-3xl font-display text-lg leading-8 text-cream">
        {report.summary}
      </p>
      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ReportList
          title="Strengths"
          items={report.strengths}
          tone="emerald"
          icon={<Check className="h-4 w-4" />}
        />
        <ReportList
          title="Weaknesses"
          items={report.weaknesses}
          tone="rose"
        />
        <ReportList
          title="Opportunities"
          items={report.opportunities}
          tone="cream"
        />
        <ReportList
          title="Risk flags"
          items={report.riskFlags}
          tone="amber"
        />
        <ReportList
          title="Content pillars"
          items={report.contentPillars}
          tone="violet"
        />
        <ReportList
          title="Recommended actions"
          items={report.recommendedActions}
          tone="brand"
          icon={<ScanEye className="h-4 w-4" />}
        />
      </div>
    </section>
  );
}

type Tone =
  | "emerald"
  | "rose"
  | "sky"
  | "amber"
  | "violet"
  | "brand"
  | "cream";

function toneClass(tone: Tone): string {
  switch (tone) {
    case "emerald":
      return "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-100";
    case "rose":
      return "border-rose-400/25 bg-rose-400/[0.06] text-rose-100";
    case "sky":
      return "border-sky-400/25 bg-sky-400/[0.06] text-sky-100";
    case "amber":
      return "border-amber-400/25 bg-amber-400/[0.06] text-amber-100";
    case "violet":
      return "border-primary-soft/30 bg-primary-soft/10 text-primary-soft";
    case "brand":
      return "border-primary/30 bg-primary/10 text-cream";
    case "cream":
      return "border-cream-soft/25 bg-cream-soft/[0.06] text-cream";
  }
}

function ReportList({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: string[];
  tone: Tone;
  icon?: React.ReactNode;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`rounded-2xl border p-5 ${toneClass(tone)}`}>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]">
        {icon ? <span className="opacity-80">{icon}</span> : null}
        {title}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-2 leading-6">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportSections({ sections }: { sections: AIReport["sections"] }) {
  if (!sections?.length) return null;
  return (
    <section className="section space-y-4">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        Detailed analysis
      </h2>
      {sections.map((s, idx) => (
        <div key={idx} className="card">
          <h3>{s.title}</h3>
          <p className="mt-2 whitespace-pre-wrap">{s.body}</p>
        </div>
      ))}
    </section>
  );
}
