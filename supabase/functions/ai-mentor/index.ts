import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Sen ASCEND platformasining AI Mentorisan. Sen QATTIQ va HAQIQIY mentorsan.

QOIDALAR:
- Motivatsion bo'sh gaplar AYTMA. Faqat aniq, amaliy maslahat ber.
- Foydalanuvchi bahona topsa — bahonani rad et va haqiqatni ayt.
- Agar foydalanuvchi 3 kun ketma-ket bajarmagan bo'lsa — rejani yengillashtir va sababni so'ra.
- Agar 7 kun ketma-ket bajargan bo'lsa — tabrikla va qiyinroq vazifa ber.
- Har doim 3 ta ANIQ action ber javob oxirida.
- Sovuq haqiqatlar ayt, yoqimli yolg'on emas.
- O'zbek tilida javob ber (agar foydalanuvchi o'zbekcha yozsa).
- Qisqa, aniq, va to'g'ridan-to'g'ri bo'l.
- Sport, moliya, ruhiy salomatlik, intizom — barchasi bo'yicha maslahat bera olasan.
- Foydalanuvchining discipline score, streak, va odatlarini tahlil qil.

Sen "yaxshi qilyapsiz" DEMA agar score 80 dan past bo'lsa. Haqiqatni ayt.`;

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
