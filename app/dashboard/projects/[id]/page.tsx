import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createDailyLog,
  createPunchItem,
  closePunchItem,
  createBudgetLine,
  logSpend,
} from "./actions";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, address, contract_value")
    .eq("id", params.id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("id, notes, weather, crew_count, photo_url, created_at")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false });

  const { data: punchItems } = await supabase
    .from("punch_items")
    .select("id, description, status, photo_url, created_at, closed_at")
    .eq("project_id", params.id)
    .order("created_at", { ascending: false });

  const { data: budgetLines } = await supabase
    .from("budget_lines")
    .select("id, cost_code, budgeted, actual")
    .eq("project_id", params.id)
    .order("created_at", { ascending: true });

  const totalBudgeted = (budgetLines ?? []).reduce(
    (sum: number, l: { budgeted: number }) => sum + Number(l.budgeted),
    0
  );
  const totalActual = (budgetLines ?? []).reduce(
    (sum: number, l: { actual: number }) => sum + Number(l.actual),
    0
  );

  return (
    <main className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="text-sm text-accent underline mb-6 inline-block"
      >
        ← Back to projects
      </Link>

      <h1 className="text-2xl font-bold text-ink mb-1">{project.name}</h1>
      {project.address && (
        <p className="text-ink/60 mb-8">{project.address}</p>
      )}

      <section className="mb-10 bg-white border border-ink/10 rounded p-5">
        <h2 className="text-lg font-semibold text-ink mb-3">
          Add a daily log
        </h2>
        <form action={createDailyLog} className="space-y-3">
          <input type="hidden" name="project_id" value={project.id} />
          <textarea
            name="notes"
            placeholder="What happened on site today?"
            rows={3}
            className="w-full border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-3">
            <input
              type="text"
              name="weather"
              placeholder="Weather (optional)"
              className="flex-1 border border-ink/20 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="crew_count"
              placeholder="Crew count"
              className="w-32 border border-ink/20 rounded px-3 py-2 text-sm"
            />
          </div>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full text-sm"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded px-4 py-2 text-sm font-medium"
          >
            Add log
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-ink mb-3">Log history</h2>
        {!logs || logs.length === 0 ? (
          <p className="text-ink/60 text-sm">No entries yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map(
              (log: {
                id: string;
                notes: string | null;
                weather: string | null;
                crew_count: number | null;
                photo_url: string | null;
                created_at: string;
              }) => (
                <li
                  key={log.id}
                  className="bg-white border border-ink/10 rounded p-4"
                >
                  <p className="text-xs text-ink/50 mb-2">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                  {log.notes && <p className="text-ink mb-2">{log.notes}</p>}
                  <p className="text-sm text-ink/60">
                    {log.weather && <>Weather: {log.weather} · </>}
                    {log.crew_count != null && <>Crew: {log.crew_count}</>}
                  </p>
                  {log.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={log.photo_url}
                      alt="Site photo"
                      className="mt-3 rounded max-h-64 object-cover"
                    />
                  )}
                </li>
              )
            )}
          </ul>
        )}
      </section>

      <section className="mb-10 bg-white border border-ink/10 rounded p-5">
        <h2 className="text-lg font-semibold text-ink mb-3">
          Add a punch item
        </h2>
        <form action={createPunchItem} className="flex gap-3">
          <input type="hidden" name="project_id" value={project.id} />
          <input
            type="text"
            name="description"
            required
            placeholder="What needs to be fixed?"
            className="flex-1 border border-ink/20 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            Add item
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ink mb-3">Punch list</h2>
        {!punchItems || punchItems.length === 0 ? (
          <p className="text-ink/60 text-sm">No punch items yet.</p>
        ) : (
          <ul className="space-y-3">
            {punchItems.map(
              (item: {
                id: string;
                description: string;
                status: string;
                photo_url: string | null;
                created_at: string;
                closed_at: string | null;
              }) => (
                <li
                  key={item.id}
                  className="bg-white border border-ink/10 rounded p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={
                        item.status === "closed"
                          ? "text-ink/50 line-through"
                          : "text-ink"
                      }
                    >
                      {item.description}
                    </p>
                    <span
                      className={
                        item.status === "closed"
                          ? "text-xs font-mono text-green-700 whitespace-nowrap"
                          : "text-xs font-mono text-accent whitespace-nowrap"
                      }
                    >
                      {item.status === "closed" ? "FIXED" : "OPEN"}
                    </span>
                  </div>

                  {item.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photo_url}
                      alt="Fix photo"
                      className="mt-3 rounded max-h-48 object-cover"
                    />
                  )}

                  {item.status !== "closed" && (
                    <form
                      action={closePunchItem}
                      className="mt-3 flex items-center gap-3"
                    >
                      <input type="hidden" name="project_id" value={project.id} />
                      <input
                        type="hidden"
                        name="punch_item_id"
                        value={item.id}
                      />
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        className="text-xs flex-1"
                      />
                      <button
                        type="submit"
                        className="text-xs underline text-ink/60 whitespace-nowrap"
                      >
                        Mark fixed
                      </button>
                    </form>
                  )}
                </li>
              )
            )}
          </ul>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-ink mb-3">Budget</h2>

        <div className="bg-white border border-ink/10 rounded p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink/50 uppercase tracking-wide">
              Budgeted
            </p>
            <p className="font-mono text-ink">
              ${totalBudgeted.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/50 uppercase tracking-wide">
              Spent
            </p>
            <p className="font-mono text-ink">
              ${totalActual.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink/50 uppercase tracking-wide">
              Remaining
            </p>
            <p
              className={
                totalBudgeted - totalActual < 0
                  ? "font-mono text-red-600"
                  : "font-mono text-ink"
              }
            >
              ${(totalBudgeted - totalActual).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded p-5 mb-4">
          <h3 className="text-sm font-semibold text-ink mb-3">
            Add a budget line
          </h3>
          <form action={createBudgetLine} className="flex gap-3">
            <input type="hidden" name="project_id" value={project.id} />
            <input
              type="text"
              name="cost_code"
              required
              placeholder="Cost code (e.g. Framing)"
              className="flex-1 border border-ink/20 rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              name="budgeted"
              step="0.01"
              placeholder="Budgeted $"
              className="w-32 border border-ink/20 rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-accent text-white rounded px-4 py-2 text-sm font-medium whitespace-nowrap"
            >
              Add line
            </button>
          </form>
        </div>

        {!budgetLines || budgetLines.length === 0 ? (
          <p className="text-ink/60 text-sm">No budget lines yet.</p>
        ) : (
          <ul className="space-y-2">
            {budgetLines.map(
              (line: {
                id: string;
                cost_code: string;
                budgeted: number;
                actual: number;
              }) => (
                <li
                  key={line.id}
                  className="bg-white border border-ink/10 rounded p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-ink">{line.cost_code}</p>
                    <p className="text-sm font-mono text-ink/70">
                      ${Number(line.actual).toLocaleString()} / $
                      {Number(line.budgeted).toLocaleString()}
                    </p>
                  </div>
                  <form
                    action={logSpend}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="project_id" value={project.id} />
                    <input
                      type="hidden"
                      name="budget_line_id"
                      value={line.id}
                    />
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      placeholder="Log spend $"
                      className="w-32 border border-ink/20 rounded px-2 py-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="text-xs underline text-ink/60 whitespace-nowrap"
                    >
                      Add spend
                    </button>
                  </form>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </main>
  );
}
