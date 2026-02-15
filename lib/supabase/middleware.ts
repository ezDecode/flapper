import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key-placeholder";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => request.cookies.get(name)?.value,
      set: (name: string, value: string, options: Record<string, unknown>) => {
        request.cookies.set(name, value);
        response = NextResponse.next({ request });
        response.cookies.set(name, value, options);
      },
      remove: (name: string, options: Record<string, unknown>) => {
        request.cookies.set(name, "");
        response = NextResponse.next({ request });
        response.cookies.set(name, "", { ...options, maxAge: 0 });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { response, user };
}
