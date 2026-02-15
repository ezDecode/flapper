import DodoPayments from "npm:dodopayments";
import { admin, getUserFromRequest } from "../_shared/supabase-admin.ts";
import { err, handleCors, json } from "../_shared/cors.ts";

const client = new DodoPayments({
  bearerToken: Deno.env.get("DODO_PAYMENTS_API_KEY") ?? "",
  environment: "live_mode"
});

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;

  try {
    const user = await getUserFromRequest(req);
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:3000";

    const { data: profile } = await admin
      .from("users")
      .select("dodo_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.dodo_customer_id) {
      return err("No Dodo Payments customer for user", 400);
    }

    const session = await client.customers.customerPortal.create(
      profile.dodo_customer_id,
      { send_email: false }
    );

    return json({ url: session.link });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Portal creation failed", 500);
  }
});
