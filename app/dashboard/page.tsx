import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProject, startCheckout, openBillingPortal } from "./actions";

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
    .select("company_id, companies(name, subscription_status)")
    .eq("id", user.id)
    .single();

  const company = (
    profile as {
      companies?: { name?: string; subscription_status?: string } | null;
    } | null
  )?.companies;

  const companyName = company?.name ?? "your company";
  const subscriptionStatus = company?.subscription_status ?? "trialing";
  const isActive = subscriptionStatus === "active";

  const companyId =
    (profile as { company_id?: string } | null)?.company_id ?? "";

  if (!isActive) {
    return (
      <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-white">{companyName}</h1>
          <form action="/auth/signout" method="post">
            <button className="text-base underline text-white/70">
              Sign out
            </button>
          </form>
        </div>

        <section className="bg-white border border-ink/10 rounded p-8 shadow-lg text-center">
          <span className="block text-xs font-mono text-sky-500 uppercase tracking-wide mb-3">
            Subscription required
          </span>
          <h2 className="text-xl font-semibold text-ink mb-2">
            Subscribe to start using GC Tracker
          </h2>
          <p className="text-ink/60 text-sm mb-6">
            $49/month gets you daily logs, a punch list, budget tracking, and
            a shareable client link for every project.
          </p>
          <form action={startCheckout}>
            <button
              type="submit"
              className="bg-accent text-white rounded px-6 py-3 text-base font-medium"
            >
              Subscribe now
            </button>
          </form>
        </section>

        <div className="mt-8 flex gap-4 text-sm text-white/50">
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

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, address, contract_value, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-white">{companyName}</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="block text-xs font-mono text-emerald-400">
              ACTIVE
            </span>
            <form action={openBillingPortal}>
              <button className="text-base underline text-white/70">
                Manage billing
              </button>
            </form>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-base underline text-white/70">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <section className="mb-10 bg-white border border-ink/10 rounded p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-ink mb-3">Add a project</h2>
        <form action={createProject} className="space-y-3">
          <input
            type="text"
            name="name"
            required
            placeholder="Project name (e.g. 123 Main St Remodel)"
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            name="address"
            placeholder="Address (optional)"
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="contract_value"
            step="0.01"
            placeholder="Contract value in dollars (optional)"
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded px-5 py-3 text-base font-medium"
          >
            Add project
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">
          Your projects
        </h2>
        {!projects || projects.length === 0 ? (
          <p className="text-white/70 text-sm">
            No projects yet — add your first one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {projects.map(
              (p: {
                id: string;
                name: string;
                address: string | null;
                contract_value: number | string | null;
              }) => (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="bg-white border border-ink/10 rounded p-4 flex items-center justify-between hover:border-accent transition-colors shadow-lg"
                  >
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      {p.address && (
                        <p className="text-sm text-ink/60">{p.address}</p>
                      )}
                    </div>
                    {p.contract_value != null && (
                      <p className="font-mono text-sm text-ink/80">
                        ${Number(p.contract_value).toLocaleString()}
                      </p>
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </section>

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
