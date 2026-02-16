import { admin } from "../_shared/supabase-admin.ts";
import { corsHeaders, err, handleCors } from "../_shared/cors.ts";

const WEBHOOK_SECRET = Deno.env.get("DODO_WEBHOOK_SECRET") ?? "";

function planFromProduct(productId?: string | null): "FREE" | "PRO" | "AGENCY" {
    if (!productId) return "FREE";
    if (productId === Deno.env.get("DODO_AGENCY_PRODUCT_ID")) return "AGENCY";
    if (productId === Deno.env.get("DODO_PRO_PRODUCT_ID")) return "PRO";
    return "FREE";
}

async function verifyWebhook(body: string, signature: string | null): Promise<boolean> {
    if (!signature || !WEBHOOK_SECRET) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );

    // Parse the incoming hex signature back to bytes
    const match = signature.match(/../g);
    if (!match) return false;
    
    const sigBytes = new Uint8Array(
        match.map((h) => parseInt(h, 16))
    );

    // crypto.subtle.verify is constant-time — no timing leak
    const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        sigBytes,
        encoder.encode(body)
    );
    return isValid;
}

Deno.serve(async (req) => {
    const preflight = handleCors(req);
    if (preflight) return preflight;

    try {
        const raw = await req.text();
        const signature = req.headers.get("webhook-signature") ?? req.headers.get("x-dodo-signature");

        const valid = await verifyWebhook(raw, signature);
        if (!valid) {
            return err("Invalid webhook signature", 401);
        }

        const event = JSON.parse(raw) as {
            type: string;
            data: {
                subscription_id?: string;
                customer?: { customer_id?: string };
                product_id?: string;
                metadata?: Record<string, string>;
                status?: string;
            };
        };

        const { type, data } = event;
        const customerId = data.customer?.customer_id ?? null;
        const subscriptionId = data.subscription_id ?? null;
        const userId = data.metadata?.user_id;

        switch (type) {
            case "subscription.active":
            case "subscription.renewed": {
                const plan = planFromProduct(data.product_id);

                if (userId) {
                    await admin
                        .from("users")
                        .update({
                            plan,
                            dodo_customer_id: customerId,
                            dodo_subscription_id: subscriptionId
                        })
                        .eq("id", userId);
                } else if (customerId) {
                    await admin
                        .from("users")
                        .update({
                            plan,
                            dodo_subscription_id: subscriptionId
                        })
                        .eq("dodo_customer_id", customerId);
                }
                break;
            }

            case "subscription.plan_changed": {
                const plan = planFromProduct(data.product_id);

                if (customerId) {
                    await admin
                        .from("users")
                        .update({ plan })
                        .eq("dodo_customer_id", customerId);
                } else if (userId) {
                    await admin
                        .from("users")
                        .update({ plan })
                        .eq("id", userId);
                }
                break;
            }

            case "subscription.cancelled":
            case "subscription.expired": {
                if (customerId) {
                    await admin
                        .from("users")
                        .update({
                            plan: "FREE",
                            dodo_subscription_id: null
                        })
                        .eq("dodo_customer_id", customerId);
                } else if (userId) {
                    await admin
                        .from("users")
                        .update({
                            plan: "FREE",
                            dodo_subscription_id: null
                        })
                        .eq("id", userId);
                }
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
