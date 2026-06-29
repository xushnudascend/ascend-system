// Observability endpoint: returns idempotency in-process counters and persistent stats.
// GET /functions/v1/idempotency-metrics
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { metrics } from "../_shared/idempotency.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  const unauth = (msg: string, status = 401) =>
    new Response(JSON.stringify({ error: msg }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  // --- Authorize: service role key OR admin user ---
  const auth = req.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return unauth("Authorization required");

  if (token !== serviceKey) {
    const userClient = createClient(url, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: auth } },
    });
    const { data: claims, error } = await userClient.auth.getClaims(token);
    if (error || !claims?.claims?.sub) return unauth("Invalid token");
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: claims.claims.sub, _role: "admin",
    });
    if (!isAdmin) return unauth("Admin only", 403);
  }

  const db = createClient(url, serviceKey, { auth: { persistSession: false } });

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