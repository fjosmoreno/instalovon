import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { JobStatusPill } from "@/components/JobStatusPill";
import { ReportView } from "@/components/ReportView";
import { formatRelative } from "@/lib/format";
import { AutoRefresh } from "@/components/AutoRefresh";
import { ArrowRight } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  const { id } = await params;
  const job = await prisma.job.findFirst({
    where: { id, userId: user.id },
  });
  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Job not found</h1>
        <p className="mt-2 text-sm text-ink-200">
          The job you are looking for does not exist or you do not have access.
        </p>
      </div>
    );
  }

  const isTerminal = job.status === "succeeded" || job.status === "failed";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-cream"
      >
        ← Dashboard
      </Link>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="h-eyebrow">Report</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {job.usernames.map((u) => "@" + u).join(", ")}
          </h1>
          <p className="mt-2 text-sm text-ink-200">
            Created {formatRelative(job.createdAt)} · mode {job.mode} · {job.locale}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <JobStatusPill status={job.status} />
          <Link
            href="/jobs/new"
            className="btn-secondary text-sm"
          >
            New analysis <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {!isTerminal ? (
        <div className="mt-8 card relative overflow-hidden">
          <div className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-primary-soft/30 to-primary/20 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="shimmer h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="shimmer h-3 w-1/3 rounded" />
              <div className="shimmer h-3 w-1/2 rounded" />
            </div>
          </div>
          <p className="mt-5 text-sm text-ink-200">
            We are extracting data from Instagram and generating your report.
            This page refreshes automatically.
          </p>
          <AutoRefresh intervalMs={5000} />
        </div>
      ) : job.status === "failed" ? (
        <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          <strong>Job failed.</strong>
          <p className="mt-2 whitespace-pre-wrap text-rose-200/90">
            {job.errorMessage ?? "Unknown error"}
          </p>
        </div>
      ) : (
        <ReportView
          profiles={(job.profileData as any) ?? []}
          report={(job.report as any) ?? null}
        />
      )}
    </div>
  );
}
