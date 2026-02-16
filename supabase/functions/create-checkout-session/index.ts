import DodoPayments from "npm:dodopayments";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

type Payload = {
  plan?: "PRO";
};

const client = new DodoPayments({
  bearerToken: Deno.env.get("DODO_PAYMENTS_API_KEY") ?? "",
  environment: "live_mode"
});

function resolveProductId(_plan: "PRO") {
  return Deno.env.get("DODO_PRO_PRODUCT_ID");
}

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const user = await getUserFromRequest(req);
    const body = (await req.json().catch(() => ({}))) as Payload;
    const plan = body.plan ?? "PRO";
    const productId = resolveProductId(plan);
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    if (!productId) {
      return err(`Missing Dodo Payments product ID for ${plan}`, 500);
    }

    const { data: profile } = await admin
      .from("users")
      .select("email, dodo_customer_id")
      .eq("id", user.id)
      .single();

    const session = await client.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email: profile?.email ?? user.email ?? "" },
      payment_link: true,
      success_url: `${siteUrl}/settings?billing=success`,
      metadata: { user_id: user.id, plan }
    });

    return json({ url: session.url });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Checkout creation failed", 500);
  }
});
