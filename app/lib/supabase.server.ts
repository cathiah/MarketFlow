import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrlEnv = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKeyEnv = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const supabaseServiceKeyEnv = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrlEnv || !supabaseAnonKeyEnv) {
  throw new Error(
    "Supabase environment variables are not defined. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

if (!supabaseServiceKeyEnv) {
  throw new Error("Supabase service role key is not defined. Please set SUPABASE_SERVICE_ROLE_KEY.");
}

const supabaseUrl = supabaseUrlEnv as string;
const supabaseAnonKey = supabaseAnonKeyEnv as string;
const supabaseServiceKey = supabaseServiceKeyEnv as string;

type SupabaseCookie = { name: string; value: string };
type SupabaseCookieToSet = { name: string; value: string; options?: Record<string, unknown> };
type ClientResult = { supabase: SupabaseClient; headers: Headers };
const clientCache = new WeakMap<Request, ClientResult>();

async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = 3,
  delay = 300
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetch(input, init);
    } catch (error: any) {
      const isLast = attempt === retries - 1;
      if (isLast || error?.cause?.code !== "ETIMEDOUT") throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
  throw new Error("Supabase request failed after retries.");
}

export function createClient(request: Request): ClientResult {
  if (clientCache.has(request)) {
    return clientCache.get(request)!;
  }

  const headers = new Headers();
  const cookieHeader = request.headers.get("cookie") ?? "";

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: fetchWithRetry },
    cookies: {
      getAll(): SupabaseCookie[] {
        return parseCookieHeader(cookieHeader) as SupabaseCookie[];
      },
      setAll(cookiesToSet: SupabaseCookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookie = serializeCookieHeader(name, value, options ?? {});
          headers.append("Set-Cookie", cookie);
        });
      },
    },
  });

  const result: ClientResult = { supabase, headers };
  clientCache.set(request, result);
  return result;
}

export function createAdminClient(): SupabaseClient {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}