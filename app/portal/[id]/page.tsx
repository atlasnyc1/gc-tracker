import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";

// Forces this page to fetch fresh data on every visit, so a client always
// sees the latest budget, punch list, and daily logs instead of a cached
// snapshot from an earlier visit.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ClientPortalPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, address")
    .eq("id", params.id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: budgetLines } = await supabase
    .from("budget_lines")
    .select("budgeted, actual")
    .eq("project_id", params.id);

  const totalBudgeted = (budgetLines ?? []).reduce(
    (sum: number, l: { budgeted: number }) => sum + Number(l.budgeted),
    0
  );
  const totalActual = (budgetLines ?? []).reduce(
    (sum: number, l: { actual: number }) => sum + Number(l.actual),
    0
  );

  const { data: punchItems } = await supabase
    .from("punch_items")
    .select("id, description, status")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false });

  const openCount = (punchItems ?? []).filter(
    (p: { status: string }) => p.status !== "closed"
  ).length;
  const closedCount = (punchItems ?? []).filter(
    (p: { status: string }) => p.status === "closed"
  ).length;

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("id, notes, photo_url, created_at")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <span className="font-mono text-xs tracking-widest uppercase text-sky-300 block mb-2">
        Project Status
      </span>
      <h1 className="text-3xl font-bold text-white mb-1">{project.name}</h1>
      {project.address && (
        <p className="text-white/70 mb-8">{project.address}</p>
      )}

      <section className="bg-white border border-ink/10 rounded p-5 mb-6 shadow-lg">
        <h2 className="text-sm font-semibold text-ink/70 uppercase tracking-wide mb-3">
          Budget
        </h2>
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-ink/50">Budgeted</p>
            <p className="font-mono text-lg text-ink">
              ${totalBudgeted.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/50">Spent</p>
            <p className="font-mono text-lg text-ink">
              ${totalActual.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-ink/10 rounded p-5 mb-6 shadow-lg">
        <h2 className="text-sm font-semibold text-ink/70 uppercase tracking-wide mb-3">
          Punch List
        </h2>
        <p className="text-ink mb-4">
          {closedCount} fixed, {openCount} open
        </p>
        {!punchItems || punchItems.length === 0 ? (
          <p className="text-ink/50 text-sm">No punch items yet.</p>
        ) : (
          <ul className="space-y-2">
            {punchItems.map(
              (item: { id: string; description: string; status: string }) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span
                    className={
                      item.status === "closed"
                        ? "text-ink/50 line-through text-sm"
                        : "text-ink text-sm"
                    }
                  >
                    {item.description}
                  </span>
                  <span
                    className={
                      item.status === "closed"
                        ? "text-xs font-mono text-green-700 whitespace-nowrap"
                        : "text-xs font-mono text-accent whitespace-nowrap"
                    }
                  >
                    {item.status === "closed" ? "FIXED" : "OPEN"}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">
          Recent Updates
        </h2>
        {!logs || logs.length === 0 ? (
          <p className="text-white/70 text-sm">No updates yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map(
              (log: {
                id: string;
                notes: string | null;
                photo_url: string | null;
                created_at: string;
              }) => (
                <li
                  key={log.id}
                  className="bg-white border border-ink/10 rounded p-4 shadow-lg"
                >
                  <p className="text-xs text-ink/50 mb-2">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                  {log.notes && <p className="text-ink mb-2">{log.notes}</p>}
                  {log.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={log.photo_url}
                      alt="Site photo"
                      className="rounded max-h-64 object-cover"
                    />
                  )}
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </main>
  );
}
