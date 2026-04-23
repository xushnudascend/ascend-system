import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, tone = "hard", context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ctxLine = context ? `\nUSER CONTEXT (use it):\n${JSON.stringify(context).slice(0, 1500)}` : "";
    const hardPrompt = `You are ASCEND's AI Mentor — direct, calm, and brutally honest. Reply in the user's language.
RULES:
- No motivational fluff. Specific actions only.
- Counter excuses with the real cause and one shrunk task.
- If discipline_score < 50: do NOT say "good job".
- Always end with 3 numbered actions for the next 24 hours.
- Use the USER CONTEXT to be specific (habits done, fails, time leaks, outputs).
- 6–10 sentences max.${ctxLine}`;
    const softPrompt = `You are ASCEND's AI Mentor — warm, encouraging, but still honest. Reply in the user's language.
RULES:
- Acknowledge effort, then point to the next small step.
- Reframe failures kindly; offer one easier alternative.
- Always end with 3 small, doable actions for today.
- Use the USER CONTEXT to be specific.
- 6–10 sentences max.${ctxLine}`;
    const systemPrompt = tone === "soft" ? softPrompt : hardPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Juda ko'p so'rov — biroz kuting." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit tugagan." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI xatolik" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-mentor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Noma'lum xato" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
