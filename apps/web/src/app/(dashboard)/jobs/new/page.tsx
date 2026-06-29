import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { NewJobForm } from "@/components/NewJobForm";

export const dynamic = "force-dynamic";

export default async function NewJobPage() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-ink-900">New analysis</h1>
      <p className="mt-1 text-sm text-ink-600">
        Paste the public URL of an Instagram profile. We will extract metadata and generate an AI
        report.
      </p>
      <div className="mt-6">
        <NewJobForm />
      </div>
    </div>
  );
}
