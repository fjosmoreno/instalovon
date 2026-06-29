import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { NewJobForm } from "@/components/NewJobForm";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-cream"
      >
        ← Dashboard
      </Link>
      <div className="mt-4">
        <span className="h-eyebrow">New analysis</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Analyze a public profile
        </h1>
        <p className="mt-2 text-sm text-ink-200">
          Paste the URL of a public Instagram profile. We will extract the
          public metadata and produce an AI report in seconds.
        </p>
      </div>
      <div className="mt-8">
        <NewJobForm />
      </div>
    </div>
  );
}
