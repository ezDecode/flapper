import { err, handleCors, json } from "../_shared/cors.ts";
import { isServiceRoleRequest } from "../_shared/supabase-admin.ts";

type Payload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;
  if (!isServiceRoleRequest(req)) return err("Service role authorization required", 401);

  try {
    const { to, subject, html, text } = (await req.json()) as Payload;
    if (!to || !subject || !html || !text) {
      return err("Missing required fields");
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return err("Missing RESEND_API_KEY", 500);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Flapr <noreply@flapr.app>",
        to: [to],
        subject,
        html,
        text
      })
    });

    if (!response.ok) {
      const payload = await response.text();
      return err(`Resend failed: ${payload}`, response.status);
    }

    return json({ success: true });
  } catch (error) {
    return err(error instanceof Error ? error.message : "Email send failed", 500);
  }
});
