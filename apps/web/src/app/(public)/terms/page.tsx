import Link from "next/link";

export const metadata = {
  title: "Terms of Service · Insta Lovon",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 prose-sm">
      <Link href="/" className="text-sm text-ink-500 hover:text-ink-700">← Back</Link>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Terms of Service</h1>
      <p className="mt-4 text-sm text-ink-600">
        Last updated: {new Date().getFullYear()}.
      </p>
      <p className="mt-4 text-sm text-ink-700">
        Insta Lovon (the "Service") is an independent analytics tool. By creating an account you
        agree to the following:
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-700">
        <li>
          You will only submit Instagram usernames and URLs that you have a legitimate interest
          in analyzing (your own account, your brand, your clients with written permission, or
          research within fair-use limits).
        </li>
        <li>
          You understand the Service works with <strong>public</strong> Instagram profiles only.
          Submitting private profiles, attempting to bypass authentication or scraping data you
          are not authorized to access is a violation of these Terms.
        </li>
        <li>
          You will not use the Service to spam, harass, stalk, or infringe on the rights of any
          third party. The Instagram data you receive through the Service is for your internal
          use only.
        </li>
        <li>
          The Service is provided "as is" without warranty. We do not guarantee the availability,
          accuracy, or completeness of Instagram data. We are not affiliated with Meta or
          Instagram.
        </li>
        <li>
          We may suspend or terminate accounts that violate these Terms or that consume
          disproportionate resources.
        </li>
      </ol>
      <p className="mt-6 text-sm text-ink-700">
        See also: <Link href="/legal" className="underline">Legal & ToS compliance</Link>,{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
