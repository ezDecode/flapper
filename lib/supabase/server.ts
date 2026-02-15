import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key-placeholder";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: Record<string, unknown>) => {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Ignore server component cookie mutation errors.
        }
      },
      remove: (name: string, options: Record<string, unknown>) => {
        try {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        } catch {
          // Ignore server component cookie mutation errors.
        }
      }
    }
  });
};
