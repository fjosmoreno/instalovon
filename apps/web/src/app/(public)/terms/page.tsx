import Link from "next/link";

export const metadata = {
  title: "Terms of Service · Insta Lovon",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-cream"
      >
        ← Back
      </Link>
      <div className="mt-6">
        <span className="h-eyebrow">Legal</span>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-1 text-sm text-ink-300">
          Last updated: {new Date().getFullYear()}.
        </p>
      </div>
      <div className="card mt-8 space-y-4 text-sm leading-7 text-ink-100">
        <p>
          Insta Lovon (the "Service") is an independent analytics tool. By
          creating an account you agree to the following:
        </p>
        <ol className="ml-1 list-decimal space-y-3 pl-5">
          <li>
            You will only submit Instagram usernames and URLs that you have a
            legitimate interest in analyzing — your own account, your brand,
            your clients with written permission, or research within fair-use
            limits.
          </li>
          <li>
            You understand the Service works with{" "}
            <strong className="text-cream">public</strong> Instagram profiles only.
            Submitting private profiles, attempting to bypass authentication, or
            scraping data you are not authorized to access is a violation of
            these Terms.
          </li>
          <li>
            You will not use the Service to spam, harass, stalk, or infringe on
            the rights of any third party. The Instagram data you receive
            through the Service is for your internal use only.
          </li>
          <li>
            The Service is provided "as is" without warranty. We do not
            guarantee the availability, accuracy, or completeness of
            Instagram data. We are not affiliated with Meta or Instagram.
          </li>
          <li>
            We may suspend or terminate accounts that violate these Terms or
            that consume disproportionate resources.
          </li>
        </ol>
        <p className="pt-2 text-ink-300">
          See also:{" "}
          <Link href="/legal" className="text-cream-soft underline">
            Legal & ToS
          </Link>
          ,{" "}
          <Link href="/privacy" className="text-cream-soft underline">
            Privacy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
