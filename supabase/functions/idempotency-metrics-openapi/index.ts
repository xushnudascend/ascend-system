// Serves the OpenAPI 3.1 spec for the idempotency-metrics endpoint.
// Public (no auth) so docs viewers and Swagger UI can fetch it.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import spec from "../idempotency-metrics/openapi.json" with { type: "json" };

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(JSON.stringify(spec, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});