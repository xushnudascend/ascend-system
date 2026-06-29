// Shared idempotency helper for edge functions.
// Stores response by `Idempotency-Key` header for ~24h so identical POSTs
// (retries, parallel duplicates) return the cached result instead of re-running.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const url = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TTL_MS = 24 * 60 * 60 * 1000;

function admin() {
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function getCached(key: string): Promise<{ status: number; response: unknown } | null> {
  if (!key) return null;
  const db = admin();
  const { data } = await db
    .from("idempotency_keys")
    .select("status,response,created_at")
    .eq("key", key)
    .maybeSingle();
  if (!data) return null;
  if (Date.now() - new Date(data.created_at).getTime() > TTL_MS) return null;
  return { status: data.status, response: data.response };
}

export async function saveCached(key: string, status: number, response: unknown) {
  if (!key) return;
  const db = admin();
  await db.from("idempotency_keys").upsert({ key, status, response }, { onConflict: "key" });
}

/** Wrap a handler so identical POSTs sharing an Idempotency-Key are deduped. */
export async function withIdempotency(
  req: Request,
  corsHeaders: Record<string, string>,
  run: () => Promise<Response>,
): Promise<Response> {
  if (req.method !== "POST") return run();
  const key = req.headers.get("Idempotency-Key") || "";
  if (!key) return run();

  const cached = await getCached(key);
  if (cached) {
    return new Response(JSON.stringify(cached.response), {
      status: cached.status,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Idempotent-Replay": "true" },
    });
  }

  const res = await run();
  // Only cache JSON responses we can safely replay.
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      const body = await res.clone().json();
      await saveCached(key, res.status, body);
    } catch { /* skip caching on parse error */ }
  }
  return res;
}