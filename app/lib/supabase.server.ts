import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type ClientResult = { supabase: SupabaseClient; headers: Headers };
const clientCache = new WeakMap<Request, ClientResult>();

async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = 3,
  delay = 300
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(input, init);
    } catch (e: any) {
      const isLast = i === retries - 1;
      if (isLast || e?.cause?.code !== "ETIMEDOUT") throw e;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  throw new Error("Unreachable");
}

export function createClient(request: Request): ClientResult {
  if (clientCache.has(request)) return clientCache.get(request)!;

  const headers = new Headers();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: fetchWithRetry },
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
          name: string;
          value: string;
        }[];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append("Set-Cookie", serializeCookieHeader(name, value, options))
        );
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