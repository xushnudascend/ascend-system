// Shared idempotency helper: dedupes POST requests by `Idempotency-Key`.
// - In-process inflight map: parallel duplicates share one execution.
// - Persistent store (Supabase): later retries (even from a new instance) replay
//   the cached JSON response for ~24h.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const TTL_MS = 24 * 60 * 60 * 1000;

export interface IdempotencyStore {
  get(key: string): Promise<{ status: number; response: unknown } | null>;
  set(key: string, status: number, response: unknown): Promise<void>;
}

function supabaseStore(): IdempotencyStore {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  return {
    async get(key) {
      const { data } = await db
        .from("idempotency_keys")
        .select("status,response,created_at")
        .eq("key", key)
        .maybeSingle();
      if (!data) return null;
      if (Date.now() - new Date(data.created_at).getTime() > TTL_MS) return null;
      return { status: data.status, response: data.response };
    },
    async set(key, status, response) {
      await db.from("idempotency_keys").upsert({ key, status, response }, { onConflict: "key" });
    },
  };
}

// In-memory store useful for tests.
export function memoryStore(): IdempotencyStore {
  const m = new Map<string, { status: number; response: unknown; at: number }>();
  return {
    async get(key) {
      const v = m.get(key);
      if (!v) return null;
      if (Date.now() - v.at > TTL_MS) return null;
      return { status: v.status, response: v.response };
    },
    async set(key, status, response) {
      m.set(key, { status, response, at: Date.now() });
    },
  };
}

const inflight = new Map<string, Promise<{ status: number; body: unknown }>>();

/** Wrap a handler so identical POSTs sharing `Idempotency-Key` execute once. */
export async function withIdempotency(
  req: Request,
  corsHeaders: Record<string, string>,
  run: () => Promise<Response>,
  store: IdempotencyStore = supabaseStore(),
): Promise<Response> {
  if (req.method !== "POST") return run();
  const key = req.headers.get("Idempotency-Key") || "";
  if (!key) return run();

  const replay = (status: number, body: unknown, replayed: boolean) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        ...(replayed ? { "Idempotent-Replay": "true" } : {}),
      },
    });

  // 1. Parallel duplicate? wait for the in-flight execution.
  const pending = inflight.get(key);
  if (pending) {
    const { status, body } = await pending;
    return replay(status, body, true);
  }

  // 2. Already cached in store?
  const cached = await store.get(key);
  if (cached) return replay(cached.status, cached.response, true);

  // 3. Execute exactly once and share the promise with concurrent callers.
  const promise = (async () => {
    const res = await run();
    const ct = res.headers.get("content-type") || "";
    let body: unknown = null;
    if (ct.includes("application/json")) {
      try { body = await res.clone().json(); } catch { body = null; }
    }
    if (body !== null) await store.set(key, res.status, body);
    return { status: res.status, body };
  })();
  inflight.set(key, promise);
  try {
    const { status, body } = await promise;
    return replay(status, body, false);
  } finally {
    inflight.delete(key);
  }
}