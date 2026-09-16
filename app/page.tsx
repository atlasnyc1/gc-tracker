import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
        GC Tracker
      </h1>
      <p className="text-white/80 max-w-md mb-2">
        The simple job tracker built for how small GCs actually work.
      </p>
      <p className="text-white/60 max-w-md text-sm mb-6">
        Daily logs with photos, a punch list, budget tracking, and a link
        you can send clients so they can check progress themselves — all
        in one place, nothing extra to learn.
      </p>
      <Link
        href="/login"
        className="bg-accent text-white rounded px-6 py-3 text-base font-medium shadow-lg"
      >
        Sign up / Sign in
      </Link>

      <Link
        href="/portal/22222222-2222-4222-8222-222222222222"
        className="mt-4 text-sm text-sky-300 underline"
      >
        See a live demo — no login needed
      </Link>

      <div className="mt-10 flex gap-4 text-sm text-white/50">
        <Link href="/faq" className="underline">
          FAQ
        </Link>
        <Link href="/terms" className="underline">
          Terms
        </Link>
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
      </div>
    </main>
  );
}
