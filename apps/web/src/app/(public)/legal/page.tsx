import Link from "next/link";

export const metadata = {
  title: "Legal & ToS compliance · Insta Lovon",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-ink-500 hover:text-ink-700">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Legal & Terms of Service compliance</h1>

      <p className="mt-4 text-sm text-ink-700">
        <strong>Insta Lovon is an independent tool.</strong> We are not affiliated with, endorsed
        by, or partnered with Meta or Instagram. "Instagram", "Meta" and related marks are
        trademarks of their respective owners.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-ink-900">How we interact with Instagram</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-ink-700">
        <li>
          We only access <strong>public</strong> profile data. Private profiles return an error to
          the user.
        </li>
        <li>
          We never ask for, accept, store or transmit Instagram credentials. The Service does
          not log in.
        </li>
        <li>
          We do not download media (photos, videos, stories, reels). We only extract metadata:
          counts, captions, hashtags, timestamps.
        </li>
        <li>
          We respect polite rate limiting: a small delay between requests, headless browsers in
          stealth mode, optional proxy rotation.
        </li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold text-ink-900">On Instagram's Terms of Service</h2>
      <p className="mt-2 text-sm text-ink-700">
        Instagram's Terms of Service prohibit unauthorized automated access to the platform. The
        open-source libraries Insta Lovon relies on — including Instaloader — explicitly warn
        users about this. Insta Lovon is built for <em>legitimate analysis of public profiles</em>
        : your own brand, your clients' accounts, market research on public data.
      </p>
      <p className="mt-2 text-sm text-ink-700">
        Operators and end users are responsible for ensuring their use of this Service complies
        with applicable law and with Instagram's Terms of Service. If Instagram asks us to stop
        a specific kind of access, we will.
      </p>

      <h2 className="mt-8 text-lg font-semibold text-ink-900">Disclaimer of warranty</h2>
      <p className="mt-2 text-sm text-ink-700">
        The Service is provided "as is". We make no warranty that it will operate uninterrupted
        or that the data returned will be accurate, complete or current. We are not liable for
        damages arising from use of the Service.
      </p>
    </div>
  );
}
