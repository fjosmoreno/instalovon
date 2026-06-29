import type { AIReport, InstagramProfileSnapshot } from "@instalovon/shared";
import { ProfileCard } from "./ProfileCard";

interface Props {
  profiles: InstagramProfileSnapshot[];
  report: AIReport | null;
}

export function ReportView({ profiles, report }: Props) {
  return (
    <div className="mt-8 space-y-8">
      {report ? <AISummaryCard report={report} /> : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          The AI report could not be generated. Raw profile data is shown below.
        </div>
      )}

      {profiles.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-ink-900">Profile snapshots</h2>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
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
    <section className="rounded-3xl border border-ink-200 bg-gradient-to-br from-brand/5 to-brand-teal/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink-900">AI summary</h2>
        <span className="text-xs text-ink-500">model: {report.model}</span>
      </div>
      <p className="mt-3 text-base leading-7 text-ink-800">{report.summary}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ReportList title="Strengths" items={report.strengths} tone="emerald" />
        <ReportList title="Weaknesses" items={report.weaknesses} tone="rose" />
        <ReportList title="Opportunities" items={report.opportunities} tone="sky" />
        <ReportList title="Risk flags" items={report.riskFlags} tone="amber" />
        <ReportList title="Content pillars" items={report.contentPillars} tone="violet" />
        <ReportList title="Recommended actions" items={report.recommendedActions} tone="brand" />
      </div>
    </section>
  );
}

function ReportList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "emerald" | "rose" | "sky" | "amber" | "violet" | "brand";
}) {
  if (!items || items.length === 0) return null;
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-900 border-emerald-200",
    rose: "bg-rose-50 text-rose-900 border-rose-200",
    sky: "bg-sky-50 text-sky-900 border-sky-200",
    amber: "bg-amber-50 text-amber-900 border-amber-200",
    violet: "bg-violet-50 text-violet-900 border-violet-200",
    brand: "bg-brand/5 text-ink-900 border-brand/20",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="text-xs font-semibold uppercase tracking-wide">{title}</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {items.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

function ReportSections({ sections }: { sections: AIReport["sections"] }) {
  if (!sections?.length) return null;
  return (
    <section className="section space-y-3">
      <h2 className="text-lg font-semibold text-ink-900">Detailed analysis</h2>
      {sections.map((s, idx) => (
        <div key={idx} className="card">
          <h3>{s.title}</h3>
          <p className="mt-2 whitespace-pre-wrap">{s.body}</p>
        </div>
      ))}
    </section>
  );
}
