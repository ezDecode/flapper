import Stripe from "npm:stripe@15.12.0";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

type Payload = {
  plan?: "PRO" | "AGENCY";
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2024-04-10" });

function resolvePriceId(plan: "PRO" | "AGENCY") {
  return plan === "AGENCY" ? Deno.env.get("STRIPE_AGENCY_PRICE_ID") : Deno.env.get("STRIPE_PRO_PRICE_ID");
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const user = await getUserFromRequest(req);
    const body = (await req.json().catch(() => ({}))) as Payload;
    const plan = body.plan ?? "PRO";
    const priceId = resolvePriceId(plan);
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    if (!priceId) {
      return err(`Missing Stripe price for ${plan}`, 500);
    }

    const { data: profile } = await admin
      .from("users")
      .select("email, stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      await admin.from("users").update({ stripe_customer_id: customer.id }).eq("id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/settings?billing=success`,
      cancel_url: `${siteUrl}/settings?billing=cancelled`,
      metadata: { user_id: user.id, plan }
    });

    return json({ url: session.url });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Checkout creation failed", 500);
  }
});
