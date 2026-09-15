import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — GC Tracker",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-base text-sky-300 underline mb-6 inline-block"
      >
        ← Back to GC Tracker
      </Link>

      <h1 className="text-3xl font-bold text-white mb-1">Privacy Policy</h1>
      <p className="text-white/60 text-sm mb-8">Last updated September 2026</p>

      <div className="bg-white border border-ink/10 rounded p-6 sm:p-8 shadow-lg space-y-6 text-ink">
        <section>
          <p className="text-sm text-ink/80">
            This policy explains what information GC Tracker (operated by
            Atlas Management Company LLC) collects, how we use it, and your
            choices. We built GC Tracker to be as simple as possible, and
            that includes how we handle your data — we don&apos;t sell it,
            and we only use it to run the Service for you.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">What we collect</h2>
          <p className="text-sm text-ink/80 mb-2">
            When you sign up and use GC Tracker, we collect:
          </p>
          <p className="text-sm text-ink/80">
            Account info — your email address and password (your password
            is never stored in readable form; it&apos;s handled securely by
            our authentication provider). Project data you enter —
            project names, addresses, contract values, daily log notes and
            photos, punch list items, and budget line items. Billing
            info — handled directly by Stripe, our payment processor; we
            don&apos;t store your card number ourselves.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">How we use it</h2>
          <p className="text-sm text-ink/80">
            We use your information only to operate GC Tracker: to run
            your account and dashboard, to display your project data back
            to you, to power the client link you choose to share, to
            process your subscription payment, and to contact you about
            your account if needed (for example, a billing issue). We
            don&apos;t use your data for advertising, and we don&apos;t sell
            or rent it to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Who we share it with</h2>
          <p className="text-sm text-ink/80">
            We use a small number of trusted service providers to run GC
            Tracker: Supabase (database, authentication, and photo
            storage), Stripe (payment processing), and Vercel (website
            hosting). Each only receives the data it needs to do its job,
            and none of them are permitted to use it for their own
            purposes. We don&apos;t share your data with anyone else,
            except if required by law.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Client links</h2>
          <p className="text-sm text-ink/80">
            When you generate a client link for a project, the budget
            summary, punch list, and daily log updates for that specific
            project become viewable to anyone who has that link. Client
            links don&apos;t require a login, so treat them like you would
            any link you share — only send them to people you intend to
            see that project&apos;s information.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Data retention & deletion</h2>
          <p className="text-sm text-ink/80">
            We keep your data for as long as your account is active. If
            you&apos;d like your account and data deleted, email us at{" "}
            <a
              href="mailto:info@amcmanagementcompany.com"
              className="text-accent underline"
            >
              info@amcmanagementcompany.com
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Security</h2>
          <p className="text-sm text-ink/80">
            We use industry-standard providers (Supabase, Stripe, Vercel)
            that encrypt data in transit and at rest. No system is
            perfectly secure, but we take reasonable steps to protect your
            information.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Children</h2>
          <p className="text-sm text-ink/80">
            GC Tracker is a business tool intended for adults running
            construction businesses. It isn&apos;t directed at, or knowingly
            used to collect information from, children.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Changes to this policy</h2>
          <p className="text-sm text-ink/80">
            If we make material changes to this policy, we&apos;ll update
            the date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">Contact</h2>
          <p className="text-sm text-ink/80">
            Questions about your data? Reach us at{" "}
            <a
              href="mailto:info@amcmanagementcompany.com"
              className="text-accent underline"
            >
              info@amcmanagementcompany.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
