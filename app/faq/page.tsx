import Link from "next/link";

export const metadata = {
  title: "FAQ — GC Tracker",
};

const FAQS = [
  {
    q: "What is GC Tracker?",
    a: "A simple job tracker built for small general contractors. It gives you daily logs with photos, a punch list, budget tracking, and a link you can send clients so they can check progress themselves — all in one place.",
  },
  {
    q: "How much does it cost?",
    a: "$49/month per company, billed automatically through Stripe. There's no separate setup fee, and no limit on how many projects you can track.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Click \"Manage billing\" on your dashboard and cancel from there — you'll keep access through the end of the period you already paid for, and you won't be charged again after that.",
  },
  {
    q: "Do my clients need to create an account?",
    a: "No. Each project has its own shareable link that shows a read-only status page — budget summary, punch list, and recent updates. Your client just opens the link, no login required.",
  },
  {
    q: "Can my clients see everything in the project?",
    a: "They see the budget totals, the punch list (with which items are fixed vs. open), and your recent daily log updates with photos. They don't see internal notes you haven't added as a daily log, and they can't edit anything.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Only you can see your own company's projects when logged in. A project's client link is only visible to someone who has that exact link, so only share it with people you want to see that project.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes — GC Tracker is a website, not a separate app, so it automatically resizes to work on your phone, tablet, or computer with no extra setup.",
  },
  {
    q: "What if I run into a problem or have a question?",
    a: "Email info@amcmanagementcompany.com and we'll help you out.",
  },
  {
    q: "Do you offer refunds?",
    a: "Subscriptions are billed monthly and are generally non-refundable, but reach out if something's gone wrong — we'll take a look.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-base text-sky-300 underline mb-6 inline-block"
      >
        ← Back to GC Tracker
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {FAQS.map((item) => (
          <section
            key={item.q}
            className="bg-white border border-ink/10 rounded p-5 shadow-lg"
          >
            <h2 className="font-semibold text-ink mb-2">{item.q}</h2>
            <p className="text-sm text-ink/80">{item.a}</p>
          </section>
        ))}
      </div>

      <p className="text-white/60 text-sm mt-8">
        Still have a question? Email{" "}
        <a
          href="mailto:info@amcmanagementcompany.com"
          className="text-sky-300 underline"
        >
          info@amcmanagementcompany.com
        </a>
        .
      </p>
    </main>
  );
}
