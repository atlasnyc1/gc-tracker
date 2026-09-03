"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  await supabase.from("daily_logs").insert({
    project_id: projectId,
    notes,
    weather,
    crew_count,
    photo_url,
  });

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

  await supabase.from("punch_items").insert({
    project_id: projectId,
    description,
  });

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

  await supabase.from("budget_lines").insert({
    project_id: projectId,
    cost_code: costCode,
    budgeted,
  });

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

  const { data: line } = await supabase
    .from("budget_lines")
    .select("actual")
    .eq("id", budgetLineId)
    .single();

  const currentActual = (line as { actual?: number } | null)?.actual ?? 0;

  await supabase
    .from("budget_lines")
    .update({ actual: Number(currentActual) + amount })
    .eq("id", budgetLineId);

  revalidatePath(`/dashboard/projects/${projectId}`);
}
