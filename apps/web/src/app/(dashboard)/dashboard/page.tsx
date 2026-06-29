import Link from "next/link";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/LogoutButton";
import { JobStatusPill } from "@/components/JobStatusPill";
import { formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-600">
            Signed in as <strong>{user.name ?? user.email}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/jobs/new" className="btn-primary">
            New analysis
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8">
        {jobs.length === 0 ? (
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-ink-900">No analyses yet</h3>
            <p className="mt-2 text-sm text-ink-600">
              Start by pasting a public Instagram profile URL.
            </p>
            <div className="mt-4">
              <Link href="/jobs/new" className="btn-primary">
                Create your first analysis
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <table className="min-w-full divide-y divide-ink-200 text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-ink-600">Profiles</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-600">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      {job.usernames.map((u) => "@" + u).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <JobStatusPill status={job.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-600">{formatRelative(job.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-brand">
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
