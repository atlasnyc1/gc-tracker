import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";

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
    .select("status")
    .eq("project_id", params.id);

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
      <span className="font-mono text-xs tracking-widest uppercase text-accent block mb-2">
        Project Status
      </span>
      <h1 className="text-3xl font-bold text-ink mb-1">{project.name}</h1>
      {project.address && (
        <p className="text-ink/60 mb-8">{project.address}</p>
      )}

      <section className="bg-white border border-ink/10 rounded p-5 mb-6">
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

      <section className="bg-white border border-ink/10 rounded p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink/70 uppercase tracking-wide mb-3">
          Punch List
        </h2>
        <p className="text-ink">
          {closedCount} fixed, {openCount} open
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink/70 uppercase tracking-wide mb-3">
          Recent Updates
        </h2>
        {!logs || logs.length === 0 ? (
          <p className="text-ink/60 text-sm">No updates yet.</p>
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
                  className="bg-white border border-ink/10 rounded p-4"
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
