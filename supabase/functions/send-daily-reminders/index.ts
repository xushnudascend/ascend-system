import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const currentHour = new Date().getUTCHours();

    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id,telegram_chat_id,email_reminders,telegram_reminders,reminder_hour")
      .eq("reminder_hour", currentHour);

    if (!prefs || prefs.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No users at this hour" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const GATEWAY = "https://connector-gateway.lovable.dev/telegram";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    let sent = 0;
    for (const p of prefs) {
      // Build motivational message based on streak
      const { data: profile } = await supabase
        .from("profiles").select("display_name,streak,discipline_score,rank")
        .eq("user_id", p.user_id).maybeSingle();

      const { data: habits } = await supabase
        .from("habits").select("name,last_completed_at").eq("user_id", p.user_id);

      const today = new Date().toISOString().slice(0, 10);
      const pending = (habits || []).filter(h => h.last_completed_at?.slice(0, 10) !== today);

      const name = profile?.display_name || "Disciple";
      const streak = profile?.streak || 0;
      const message = `🔥 ${name}, ${streak} kunlik streak.\n\n` +
        `Bugun ${pending.length} ta vazifa qoldi:\n${pending.slice(0, 5).map(h => `• ${h.name}`).join("\n")}\n\n` +
        `Bahona yo'q. Hoziroq boshla.`;

      // Telegram
      if (p.telegram_reminders && p.telegram_chat_id && TELEGRAM_API_KEY && LOVABLE_API_KEY) {
        try {
          await fetch(`${GATEWAY}/sendMessage`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TELEGRAM_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id: p.telegram_chat_id, text: message }),
          });
          sent++;
        } catch (e) { console.error("Telegram failed:", e); }
      }
      // Email (logged for now — wire to Resend/Lovable Emails later)
      if (p.email_reminders) {
        console.log(`Would email user ${p.user_id}: ${message}`);
      }
    }

    return new Response(JSON.stringify({ sent, total: prefs.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-daily-reminders error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
