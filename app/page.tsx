import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-3">
        GC Tracker
      </h1>
      <p className="text-ink/70 max-w-md mb-2">
        The simple job tracker built for how small GCs actually work.
      </p>
      <p className="text-ink/60 max-w-md text-sm mb-6">
        Daily logs with photos, a punch list, budget tracking, and a link
        you can send clients so they can check progress themselves — all
        in one place, nothing extra to learn.
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
