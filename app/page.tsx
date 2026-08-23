import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
        Milestone 2 — Sign Up &amp; Log In
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-3">
        GC Tracker
      </h1>
      <p className="text-ink/70 max-w-md mb-6">
        The job tracker built for how small GCs actually work. Daily logs
        and budgets are coming next.
      </p>
      <Link
        href="/login"
        className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
      >
        Sign up / Sign in
      </Link>
    </main>
  );
}
