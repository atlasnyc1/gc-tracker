import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, companies(name)")
    .eq("id", user.id)
    .single();

  const companyName =
    (profile as { companies?: { name?: string } | null } | null)?.companies
      ?.name ?? "your company";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs tracking-widest uppercase text-accent mb-4">
        Milestone 2 — Signed In
      </span>
      <h1 className="text-3xl font-bold text-ink mb-2">
        Welcome, {companyName}
      </h1>
      <p className="text-ink/70 max-w-md mb-6">
        You&apos;re logged in, and this space is private to you. Nobody else
        can see it. Projects are coming next.
      </p>
      <form action="/auth/signout" method="post">
        <button className="text-sm underline text-ink/60">Sign out</button>
      </form>
    </main>
  );
}
