import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { answers, scores, profile_type, language } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const lang = language || "uz";
    const sys = `You are an elite life-design coach. Build a 100% personalized self-development plan based on a 15-question assessment. Answer in ${lang === "uz" ? "Uzbek" : lang === "ru" ? "Russian" : "English"}. Be specific, brutally honest, actionable. No fluff.`;

    const user = `User profile: ${profile_type}\nScores: ${JSON.stringify(scores)}\nAnswers: ${JSON.stringify(answers)}\n\nReturn STRICTLY structured JSON via the build_plan tool. Routine = concrete time-blocks. Habits = 5-7 daily habits the user actually needs. 30-day roadmap = week-by-week milestones. Warnings = the user's biggest pitfall.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        tools: [{
          type: "function",
          function: {
            name: "build_plan",
            description: "Return a complete personalized plan",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string", description: "1-2 sentence diagnosis" },
                strengths: { type: "string" },
                weaknesses: { type: "string" },
                warnings: { type: "string", description: "Biggest pitfall to watch for" },
                daily_routine: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      time: { type: "string" },
                      block: { type: "string" },
                      why: { type: "string" }
                    },
                    required: ["time", "block", "why"],
                    additionalProperties: false
                  }
                },
                recommended_habits: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      frequency: { type: "string" },
                      reason: { type: "string" }
                    },
                    required: ["name", "frequency", "reason"],
                    additionalProperties: false
                  }
                },
                weekly_plan: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "string" },
                      focus: { type: "string" }
                    },
                    required: ["day", "focus"],
                    additionalProperties: false
                  }
                },
                thirty_day_roadmap: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      week: { type: "string" },
                      goal: { type: "string" },
                      milestone: { type: "string" }
                    },
                    required: ["week", "goal", "milestone"],
                    additionalProperties: false
                  }
                }
              },
              required: ["summary","strengths","weaknesses","warnings","daily_routine","recommended_habits","weekly_plan","thirty_day_roadmap"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "build_plan" } }
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      return new Response(JSON.stringify({ error: "AI error", detail: t }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return new Response(JSON.stringify({ error: "No plan returned" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const plan = JSON.parse(args);
    return new Response(JSON.stringify(plan), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "err" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});