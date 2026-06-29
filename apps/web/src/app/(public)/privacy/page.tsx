import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · Insta Lovon",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-cream"
      >
        ← Back
      </Link>
      <div className="mt-6">
        <span className="h-eyebrow">Privacy</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
      </div>
      <div className="card mt-8 space-y-4 text-sm leading-7 text-ink-100">
        <p>We collect the minimum data needed to run the Service:</p>
        <ul className="ml-1 list-disc space-y-3 pl-5">
          <li>
            <strong className="text-cream">Account data</strong>: email, name,
            and a password hash. We never see your Instagram password — we do
            not store Instagram credentials because we never log in.
          </li>
          <li>
            <strong className="text-cream">Job metadata</strong>: the Instagram
            usernames/URLs you submit, the resulting analysis snapshots, and
            reports we generate for you.
          </li>
          <li>
            <strong className="text-cream">Logs</strong>: server access logs
            with request metadata (IP, user agent) for security and abuse
            prevention.
          </li>
        </ul>
        <p>
          We do not sell or share your data with third parties. We do not
          download Instagram media. The Service is funded by you, the user,
          not by selling data.
        </p>
        <p>
          You can delete your account at any time; doing so removes your
          account and all jobs.
        </p>
      </div>
    </div>
  );
}
