import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Insta Lovon",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-ink-500 hover:text-ink-700">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink-700">
        We collect the minimum data needed to run the Service:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-700">
        <li>
          <strong>Account data</strong>: email, name and a password hash. We never see your
          Instagram password — we do not store Instagram credentials because we never log in.
        </li>
        <li>
          <strong>Job metadata</strong>: the Instagram usernames/URLs you submit, the resulting
          analysis snapshots, and reports we generate for you.
        </li>
        <li>
          <strong>Logs</strong>: server access logs with request metadata (IP, user agent) for
          security and abuse prevention.
        </li>
      </ul>
      <p className="mt-4 text-sm text-ink-700">
        We do not sell or share your data with third parties. We do not download Instagram
        media. The Service is funded by you, the user, not by selling data.
      </p>
      <p className="mt-4 text-sm text-ink-700">
        You can delete your account at any time; doing so removes your account and all jobs.
      </p>
    </div>
  );
}
