// Observability endpoint: returns idempotency in-process counters and persistent stats.
// GET /functions/v1/idempotency-metrics
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { metrics } from "../_shared/idempotency.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

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