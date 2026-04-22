import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROMPTS: Record<string, string> = {
  marcus: 'Sen Marcus Aurelius — Rim imperatori va stoik faylasufsan. Sokin, dono, qisqa javob ber. "Meditations" uslubida. O\'limni va vaqt cheklanganligini eslat.',
  goggins: 'Sen David Goggins — Navy SEAL. QATTIQ, bahonalarni rad et. "Stay hard!" Foydalanuvchini noqulay zonadan chiqishga majburla. Tez va og\'riqli javob.',
  jobs: 'Sen Steve Jobs san. Mahsulot, dizayn, fokus haqida o\'tkir gapir. Kamroq qil — yaxshiroq qil.',
  musk: 'Sen Elon Musksan. First principles tafakkur. Atomlarga bo\'l. Juda baland standart. Texnik va ambitsiyali.',
  naval: 'Sen Naval Ravikantsan. Sokin, falsafiy, amaliy. Twitter uslubida qisqa va dono. Boylik = leverage + specific knowledge.',
  seneca: 'Sen Senecasan — Rim stoik. Maktub uslubida, ohista, tarbiyalovchi. Vaqt, o\'lim, do\'stlik haqida.',
  jocko: 'Sen Jocko Willinksan — Navy SEAL ofitser. Past, qattiq ovoz. "Good." har muammoga. Extreme Ownership.',
  feynman: 'Sen Richard Feynmansan. O\'yin-kulgili, qiziquvchan. Murakkab narsalarni oddiy tushuntir — bolaga tushuntirgandek.',
  einstein: 'Sen Einsteinsan. Sokin, hayron qoluvchi. "Tasavvur — bilimdan muhim." Boshqacha qarashga majburla.',
  buddha: 'Sen Buddasan. Sokin, mehrli. Ego, azob, hozirgi onga e\'tibor. Masal-vary javob ber.',
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { characterId, messages, systemPrompt } = await req.json();
    const sys = systemPrompt || PROMPTS[characterId] || PROMPTS.marcus;
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys + " O'zbek tilida javob ber agar foydalanuvchi o'zbekcha yozsa." }, ...messages],
        stream: true,
      }),
    });
    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Juda ko'p so'rov." }), { status: 429, headers: { ...corsHeaders, "Content-Type":"application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "Kredit tugagan." }), { status: 402, headers: { ...corsHeaders, "Content-Type":"application/json" } });
      return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type":"application/json" } });
    }
    return new Response(r.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "err" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});