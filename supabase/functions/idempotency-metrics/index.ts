// Observability endpoint: returns idempotency in-process counters and persistent stats.
// GET /functions/v1/idempotency-metrics
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { metrics } from "../_shared/idempotency.ts";

export type AuthDeps = {
  serviceKey: string;
  getClaims: (token: string) => Promise<{ sub: string } | null>;
  isAdmin: (userId: string) => Promise<boolean>;
};

export type AuthResult = { ok: true } | { ok: false; status: 401 | 403; error: string };

/** Authorize the metrics endpoint: allow service role key OR admin user. */
export async function authorize(req: Request, deps: AuthDeps): Promise<AuthResult> {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return { ok: false, status: 401, error: "Authorization required" };
  if (token === deps.serviceKey) return { ok: true };
  const claims = await deps.getClaims(token);
  if (!claims?.sub) return { ok: false, status: 401, error: "Invalid token" };
  const admin = await deps.isAdmin(claims.sub);
  if (!admin) return { ok: false, status: 403, error: "Admin only" };
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  const result = await authorize(req, {
    serviceKey,
    getClaims: async (token) => {
      const userClient = createClient(url, anonKey, {
        auth: { persistSession: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data, error } = await userClient.auth.getClaims(token);
      if (error || !data?.claims?.sub) return null;
      return { sub: data.claims.sub as string };
    },
    isAdmin: async (uid) => {
      const { data } = await adminClient.rpc("has_role", { _user_id: uid, _role: "admin" });
      return !!data;
    },
  });
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: result.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const db = adminClient;

  // Persistent counters from the store
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [{ count: totalKeys }, { count: keys24h }] = await Promise.all([
    db.from("idempotency_keys").select("*", { count: "exact", head: true }),
    db.from("idempotency_keys").select("*", { count: "exact", head: true }).gte("created_at", dayAgo),
  ]);

  const total = metrics.requests || 1;
  const body = {
    instance: { ...metrics, hit_rate: +(((metrics.store_hits + metrics.inflight_hits) / total) * 100).toFixed(2) },
    store: { total_keys: totalKeys ?? 0, keys_last_24h: keys24h ?? 0 },
    now: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});