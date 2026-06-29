import Link from "next/link";

export const metadata = {
  title: "Legal & ToS compliance · Insta Lovon",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-cream"
      >
        ← Back
      </Link>
      <div className="mt-6">
        <span className="h-eyebrow">Compliance</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Legal &amp; Terms of Service compliance
        </h1>
      </div>

      <div className="card mt-8 space-y-5 text-sm leading-7 text-ink-100">
        <p>
          <strong className="text-cream">Insta Lovon is an independent tool.</strong>{" "}
          We are not affiliated with, endorsed by, or partnered with Meta or
          Instagram. "Instagram", "Meta", and related marks are trademarks of
          their respective owners.
        </p>

        <h2 className="pt-4 font-display text-lg font-semibold text-cream">
          How we interact with Instagram
        </h2>
        <ul className="ml-1 list-disc space-y-2 pl-5">
          <li>
            We only access <strong className="text-cream">public</strong> profile
            data. Private profiles return an error to the user.
          </li>
          <li>
            We never ask for, accept, store, or transmit Instagram credentials.
            The Service does not log in.
          </li>
          <li>
            We do not download media (photos, videos, stories, reels). We only
            extract metadata: counts, captions, hashtags, timestamps.
          </li>
          <li>
            We respect polite rate limiting: a small delay between requests,
            headless browsers in stealth mode, optional proxy rotation.
          </li>
        </ul>

        <h2 className="pt-2 font-display text-lg font-semibold text-cream">
          On Instagram's Terms of Service
        </h2>
        <p>
          Instagram's Terms of Service prohibit unauthorized automated access
          to the platform. The open-source libraries Insta Lovon relies on —
          including Instaloader — explicitly warn users about this. Insta
          Lovon is built for{" "}
          <em>legitimate analysis of public profiles</em>: your own brand, your
          clients' accounts, market research on public data.
        </p>
        <p>
          Operators and end users are responsible for ensuring their use of
          this Service complies with applicable law and with Instagram's Terms
          of Service. If Instagram asks us to stop a specific kind of access,
          we will.
        </p>

        <h2 className="pt-2 font-display text-lg font-semibold text-cream">
          Disclaimer of warranty
        </h2>
        <p>
          The Service is provided "as is". We make no warranty that it will
          operate uninterrupted or that the data returned will be accurate,
          complete, or current. We are not liable for damages arising from use
          of the Service.
        </p>
      </div>
    </div>
  );
}
