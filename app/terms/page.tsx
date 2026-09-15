import Link from "next/link";

export const metadata = {
  title: "Terms of Service — GC Tracker",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-base text-sky-300 underline mb-6 inline-block"
      >
        ← Back to GC Tracker
      </Link>

      <h1 className="text-3xl font-bold text-white mb-1">Terms of Service</h1>
      <p className="text-white/60 text-sm mb-8">Last updated September 2026</p>

      <div className="bg-white border border-ink/10 rounded p-6 sm:p-8 shadow-lg space-y-6 text-ink">
        <section>
          <h2 className="font-semibold mb-2">1. Who this agreement is with</h2>
          <p className="text-sm text-ink/80">
            GC Tracker is operated by Atlas Management Company LLC ("we,"
            "us," "our"). By creating an account or using GC Tracker (the
            "Service"), you agree to these Terms of Service. If you don&apos;t
            agree, please don&apos;t use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">2. What GC Tracker is</h2>
          <p className="text-sm text-ink/80">
            GC Tracker is a subscription tool that helps general contractors
            track daily logs, punch lists, and budgets for construction
            projects, and share a read-only status link with clients. It is
            a record-keeping and communication tool, not a substitute for
            your own contracts, insurance, permits, or professional
            judgment on any project.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">3. Your account</h2>
          <p className="text-sm text-ink/80">
            You must provide accurate information when signing up and are
            responsible for keeping your login credentials confidential.
            You&apos;re responsible for all activity that happens under your
            account. Each account is intended for one company; please
            don&apos;t share logins across unrelated businesses.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">4. Subscription & billing</h2>
          <p className="text-sm text-ink/80">
            GC Tracker is billed monthly through Stripe, our payment
            processor. Your subscription renews automatically each month
            until you cancel. You can cancel anytime from the "Manage
            billing" link in your dashboard — you&apos;ll keep access
            through the end of the billing period you already paid for.
            Payments are non-refundable except where required by law or at
            our discretion.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">5. Your content</h2>
          <p className="text-sm text-ink/80">
            You retain ownership of the daily logs, photos, punch list
            items, budget data, and other content you upload ("Your
            Content"). You&apos;re solely responsible for Your Content and
            for having the right to share any photos or information you
            upload. We only use Your Content to operate the Service for
            you — for example, displaying it on your projects and on the
            client link you choose to share.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">6. Client links</h2>
          <p className="text-sm text-ink/80">
            GC Tracker lets you generate a shareable link for each project
            so your clients can view its status without logging in. Anyone
            with that link can view that project&apos;s information, so
            you&apos;re responsible for only sharing it with people you
            intend to see it.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">7. Acceptable use</h2>
          <p className="text-sm text-ink/80">
            Please don&apos;t use GC Tracker to upload unlawful, infringing,
            or harmful content, to interfere with the Service, or to try to
            access another company&apos;s data. We may suspend or terminate
            accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">8. Service "as is"</h2>
          <p className="text-sm text-ink/80">
            GC Tracker is provided "as is" and "as available," without
            warranties of any kind, express or implied. We don&apos;t
            guarantee the Service will be uninterrupted, error-free, or
            available at all times. You&apos;re responsible for keeping
            your own backups of anything critical to your business.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">9. Limitation of liability</h2>
          <p className="text-sm text-ink/80">
            To the fullest extent permitted by law, Atlas Management
            Company LLC will not be liable for any indirect, incidental, or
            consequential damages arising from your use of the Service. Our
            total liability for any claim relating to the Service is
            limited to the amount you paid us in the 3 months before the
            claim arose.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">10. Termination</h2>
          <p className="text-sm text-ink/80">
            You may stop using the Service and cancel your subscription at
            any time. We may suspend or terminate your access if you
            violate these Terms or if your subscription payment fails.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">11. Changes to these terms</h2>
          <p className="text-sm text-ink/80">
            We may update these Terms from time to time. If we make
            material changes, we&apos;ll update the date at the top of this
            page. Continuing to use the Service after changes means you
            accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">12. Governing law</h2>
          <p className="text-sm text-ink/80">
            These Terms are governed by the laws of the State of New
            Jersey, without regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">13. Contact</h2>
          <p className="text-sm text-ink/80">
            Questions about these Terms? Reach us at{" "}
            
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