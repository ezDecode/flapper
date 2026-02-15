export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

export const handleCors = (req: Request) => (req.method === "OPTIONS" ? new Response("ok", { headers: corsHeaders }) : null);

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });

export const err = (message: string, status = 400) => json({ error: message }, status);
