import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createDailyLog } from "./actions";

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

      <section>
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
    </main>
  );
}
