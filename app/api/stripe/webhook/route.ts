import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";
import type Stripe from "stripe";

// Stripe calls this URL directly (never a browser) whenever a payment
// event happens, so it can't use a normal login — instead Stripe signs
// each request, and we check that signature below.
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const companyId = session.metadata?.company_id;

    if (companyId) {
      await supabase
        .from("companies")
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: "active",
        })
        .eq("id", companyId);
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("companies")
      .update({
        subscription_status:
          subscription.status === "active" ? "active" : "inactive",
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
