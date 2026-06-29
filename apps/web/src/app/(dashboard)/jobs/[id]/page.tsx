import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { JobStatusPill } from "@/components/JobStatusPill";
import { ReportView } from "@/components/ReportView";
import { formatRelative } from "@/lib/format";
import { AutoRefresh } from "@/components/AutoRefresh";

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
        <h1 className="text-2xl font-bold text-ink-900">Job not found</h1>
        <p className="mt-2 text-sm text-ink-600">
          The job you are looking for does not exist or you do not have access.
        </p>
      </div>
    );
  }

  const isTerminal = job.status === "succeeded" || job.status === "failed";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <a href="/dashboard" className="hover:text-ink-700">← Dashboard</a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              {job.usernames.map((u) => "@" + u).join(", ")}
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              Created {formatRelative(job.createdAt)} · mode: {job.mode}
            </p>
          </div>
          <JobStatusPill status={job.status} />
        </div>
      </div>

      {!isTerminal ? (
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="shimmer h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="shimmer h-3 w-1/3 rounded" />
              <div className="shimmer h-3 w-1/2 rounded" />
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-600">
            We are extracting data from Instagram and generating your report. This page refreshes
            automatically.
          </p>
          <AutoRefresh intervalMs={5000} />
        </div>
      ) : job.status === "failed" ? (
        <div className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-800">
          <strong>Job failed.</strong>
          <p className="mt-2 whitespace-pre-wrap">{job.errorMessage ?? "Unknown error"}</p>
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
