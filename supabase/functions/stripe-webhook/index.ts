import Stripe from "npm:stripe@15.12.0";
import { admin } from "../_shared/supabase-admin.ts";
import { corsHeaders, err, handleCors, json } from "../_shared/cors.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2024-04-10" });

function planFromPrice(priceId?: string | null) {
  if (!priceId) return "FREE";
  if (priceId === Deno.env.get("STRIPE_AGENCY_PRICE_ID")) return "AGENCY";
  if (priceId === Deno.env.get("STRIPE_PRO_PRICE_ID")) return "PRO";
  return "FREE";
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!signature || !webhookSecret) {
      return err("Missing Stripe signature or webhook secret", 400);
    }

    const raw = await req.text();
    const event = await stripe.webhooks.constructEventAsync(raw, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const plan = (session.metadata?.plan as "PRO" | "AGENCY" | undefined) ?? "PRO";

        await admin
          .from("users")
          .update({
            plan,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null
          })
          .eq("id", session.metadata?.user_id ?? "");
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const plan = planFromPrice(priceId);
        await admin
          .from("users")
          .update({
            plan,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : null
          })
          .eq("stripe_customer_id", typeof subscription.customer === "string" ? subscription.customer : "");
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await admin
          .from("users")
          .update({
            plan: "FREE",
            stripe_subscription_id: null
          })
          .eq("stripe_customer_id", typeof subscription.customer === "string" ? subscription.customer : "");
        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Webhook error", 400);
  }
});
