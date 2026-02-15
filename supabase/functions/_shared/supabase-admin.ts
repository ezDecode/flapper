import { createClient, type User } from "npm:@supabase/supabase-js@2.43.4";
import type { Database } from "./database.types.ts";

const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn("[flapr] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const admin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export function getBearerToken(req: Request) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice("Bearer ".length);
}

export function isServiceRoleRequest(req: Request) {
  return getBearerToken(req) === serviceRoleKey;
}

export async function getUserFromRequest(req: Request): Promise<User> {
  const token = getBearerToken(req);
  if (!token) {
    throw new Error("Missing Authorization header");
  }
  const {
    data: { user },
    error
  } = await admin.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return user;
}
