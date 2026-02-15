import Stripe from "npm:stripe@15.12.0";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2024-04-10" });

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const user = await getUserFromRequest(req);
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    const { data: profile } = await admin.from("users").select("stripe_customer_id").eq("id", user.id).single();
    if (!profile?.stripe_customer_id) {
      return err("No Stripe customer for user", 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/settings`
    });

    return json({ url: session.url });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Portal creation failed", 500);
  }
});
