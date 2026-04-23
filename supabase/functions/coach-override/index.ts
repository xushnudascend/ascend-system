import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { excuse, originalTask, tone = "hard" } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const systemPrompt = `You are a Coach Override engine. The user is trying to skip a task because of an excuse.
You NEVER let them skip. You SHRINK the task to the smallest possible version that still moves the identity forward, and return JSON.
Tone: ${tone === "soft" ? "warm, kind, supportive" : "direct, no-nonsense, brief"}.
Reply ONLY as JSON: {"counter":"...", "shrunk_task":"...", "min_time_min": number}.
- "counter": one short sentence calling out the excuse honestly (in the user's language).
- "shrunk_task": a tiny version of the original (5–10 minutes max).
- "min_time_min": a small integer (2–10).`;

    const userMsg = `Original task: ${originalTask}\nUser excuse: ${excuse}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMsg }],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "credits" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(await r.text());
    }
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(text); } catch { parsed = { counter: text, shrunk_task: originalTask, min_time_min: 5 }; }
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
