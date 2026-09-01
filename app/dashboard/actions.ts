"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user.id)
    .single();

  const companyId = (profile as { company_id?: string } | null)?.company_id;

  if (!companyId) return;

  const name = formData.get("name")?.toString().trim();
  if (!name) return;

  const address = formData.get("address")?.toString().trim() || null;
  const contractValueRaw = formData.get("contract_value")?.toString().trim();
  const contract_value = contractValueRaw ? Number(contractValueRaw) : null;

  await supabase.from("projects").insert({
    company_id: companyId,
    name,
    address,
    contract_value,
  });

  revalidatePath("/dashboard");
}
