import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { withIdempotency } from "../_shared/idempotency.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return withIdempotency(req, corsHeaders, async () => {
   try {
    const { image } = await req.json();
    if (!image) return new Response(JSON.stringify({ error: "image required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const sys = `You are a wellness vision assistant (NOT a doctor). From a face/selfie photo give VISUAL wellness signals only.
Return STRICT JSON: {"skin":"good|tired|inflamed","eyes":"clear|tired|red","posture":"good|slouched|unknown","stress_estimate":1-10,"energy_estimate":1-10,"sleep_quality_guess":"good|poor|unknown","tips":[string,string,string],"disclaimer":"Not medical advice"}.
Keep tips actionable & in Uzbek if possible.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: [
            { type: "text", text: "Analyze wellness signals." },
            { type: "image_url", image_url: { url: image } },
          ]},
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      return new Response(JSON.stringify({ error: "AI error", detail: t }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any; try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
   } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
   }
  });
});
