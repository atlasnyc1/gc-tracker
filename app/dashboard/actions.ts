"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

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

async function getOrigin() {
  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function startCheckout() {
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

  const origin = await getOrigin();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${origin}/dashboard?subscribed=1`,
    cancel_url: `${origin}/dashboard`,
    client_reference_id: companyId,
    metadata: { company_id: companyId },
  });

  if (session.url) {
    redirect(session.url);
  }
}

export async function openBillingPortal() {
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

  const { data: company } = await supabase
    .from("companies")
    .select("stripe_customer_id")
    .eq("id", companyId)
    .single();

  const customerId = (company as { stripe_customer_id?: string } | null)
    ?.stripe_customer_id;
  if (!customerId) return;

  const origin = await getOrigin();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/dashboard`,
  });

  redirect(portalSession.url);
}
