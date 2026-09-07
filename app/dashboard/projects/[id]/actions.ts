"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

// Guards against accidental double-submits (e.g. a fast double-click, or a
// slow connection replaying a form) by checking whether an identical row
// was just inserted a few seconds ago before inserting another one.
async function wasJustSubmitted(
  supabase: SupabaseClient,
  table: string,
  match: Record<string, string | number | null>
) {
  const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();

  let query = supabase
    .from(table)
    .select("id")
    .gte("created_at", tenSecondsAgo)
    .limit(1);

  for (const [key, value] of Object.entries(match)) {
    query = query.eq(key, value as string | number);
  }

  const { data } = await query;
  return !!data && data.length > 0;
}

export async function createDailyLog(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = formData.get("project_id")?.toString();
  if (!projectId) return;

  const notes = formData.get("notes")?.toString().trim() || null;
  const weather = formData.get("weather")?.toString().trim() || null;
  const crewCountRaw = formData.get("crew_count")?.toString().trim();
  const crew_count = crewCountRaw ? Number(crewCountRaw) : null;

  let photo_url: string | null = null;
  const photo = formData.get("photo");

  if (photo instanceof File && photo.size > 0) {
    const fileExt = photo.name.split(".").pop() || "jpg";
    const filePath = `${projectId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("daily-log-photos")
      .upload(filePath, photo);

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("daily-log-photos")
        .getPublicUrl(filePath);
      photo_url = publicUrlData.publicUrl;
    }
  }

  const isDuplicate = await wasJustSubmitted(supabase, "daily_logs", {
    project_id: projectId,
    notes,
    weather,
    crew_count,
  });

  if (!isDuplicate) {
    await supabase.from("daily_logs").insert({
      project_id: projectId,
      notes,
      weather,
      crew_count,
      photo_url,
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createPunchItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = formData.get("project_id")?.toString();
  const description = formData.get("description")?.toString().trim();

  if (!projectId || !description) return;

  const isDuplicate = await wasJustSubmitted(supabase, "punch_items", {
    project_id: projectId,
    description,
  });

  if (!isDuplicate) {
    await supabase.from("punch_items").insert({
      project_id: projectId,
      description,
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function closePunchItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = formData.get("project_id")?.toString();
  const punchItemId = formData.get("punch_item_id")?.toString();

  if (!projectId || !punchItemId) return;

  let photo_url: string | null = null;
  const photo = formData.get("photo");

  if (photo instanceof File && photo.size > 0) {
    const fileExt = photo.name.split(".").pop() || "jpg";
    const filePath = `punch/${projectId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("daily-log-photos")
      .upload(filePath, photo);

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("daily-log-photos")
        .getPublicUrl(filePath);
      photo_url = publicUrlData.publicUrl;
    }
  }

  await supabase
    .from("punch_items")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      ...(photo_url ? { photo_url } : {}),
    })
    .eq("id", punchItemId);

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function createBudgetLine(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = formData.get("project_id")?.toString();
  const costCode = formData.get("cost_code")?.toString().trim();
  const budgetedRaw = formData.get("budgeted")?.toString().trim();

  if (!projectId || !costCode) return;

  const budgeted = budgetedRaw ? Number(budgetedRaw) : 0;

  const isDuplicate = await wasJustSubmitted(supabase, "budget_lines", {
    project_id: projectId,
    cost_code: costCode,
    budgeted,
  });

  if (!isDuplicate) {
    await supabase.from("budget_lines").insert({
      project_id: projectId,
      cost_code: costCode,
      budgeted,
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function logSpend(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectId = formData.get("project_id")?.toString();
  const budgetLineId = formData.get("budget_line_id")?.toString();
  const amountRaw = formData.get("amount")?.toString().trim();

  if (!projectId || !budgetLineId || !amountRaw) return;

  const amount = Number(amountRaw);
  if (!amount) return;

  // logSpend doesn't insert a new row (it updates a running total), so a
  // double-submit here would double-count the spend amount instead of
  // creating a visible duplicate row. Track recent spend "events" in a
  // lightweight way by re-checking the line's updated_at as a proxy.
  const { data: line } = await supabase
    .from("budget_lines")
    .select("actual, updated_at")
    .eq("id", budgetLineId)
    .single();

  const currentActual = (line as { actual?: number } | null)?.actual ?? 0;
  const updatedAt = (line as { updated_at?: string } | null)?.updated_at;

  const updatedVeryRecently =
    updatedAt && Date.now() - new Date(updatedAt).getTime() < 3_000;

  if (!updatedVeryRecently) {
    await supabase
      .from("budget_lines")
      .update({
        actual: Number(currentActual) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", budgetLineId);
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
}
