import Link from "next/link";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { LogoutButton } from "@/components/LogoutButton";
import { JobStatusPill } from "@/components/JobStatusPill";
import { formatRelative } from "@/lib/format";
import { ArrowRight } from "@/components/icons";

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
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <span className="h-eyebrow">Signed in</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-gradient-cream">{user.name ?? user.email.split("@")[0]}</span>
          </h1>
          <p className="mt-2 text-sm text-ink-200">
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/jobs/new" className="btn-primary">
            New analysis <ArrowRight className="h-4 w-4" />
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10">
        {jobs.length === 0 ? (
          <div className="card flex flex-col items-center text-center">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft/15 text-cream-soft">
              <ArrowRight className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">No analyses yet</h3>
            <p className="mt-2 max-w-md text-sm text-ink-200">
              Start by pasting a public Instagram profile URL.
              We will extract the public metadata and prepare an AI report.
            </p>
            <Link href="/jobs/new" className="btn-primary mt-5">
              Create your first analysis
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] glass">
            <div className="grid grid-cols-[1.5fr,auto,auto,auto] items-center gap-4 border-b border-white/[0.05] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300">
              <div>Profiles</div>
              <div>Status</div>
              <div>Created</div>
              <div></div>
            </div>
            <ul className="divide-y divide-white/[0.05]">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="grid grid-cols-[1.5fr,auto,auto,auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.025]"
                >
                  <div className="font-display text-base font-medium text-cream">
                    {job.usernames.map((u) => "@" + u).join(", ")}
                  </div>
                  <div>
                    <JobStatusPill status={job.status} />
                  </div>
                  <div className="text-sm text-ink-200">{formatRelative(job.createdAt)}</div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-cream-soft hover:text-cream inline-flex items-center gap-1"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
