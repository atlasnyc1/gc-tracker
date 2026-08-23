export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
        Milestone 1 — It&apos;s Alive
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-3">
        GC Tracker
      </h1>
      <p className="text-ink/70 max-w-md">
        The job tracker built for how small GCs actually work. Sign-up,
        daily logs, and budgets are coming next.
      </p>
    </main>
  );
}
