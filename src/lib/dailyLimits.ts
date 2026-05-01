import { supabase } from "@/integrations/supabase/client";

const LIMITS: Record<string, number> = {
  habit_complete: 50,
  output: 30,
  fail: 15,
  excuse: 30,
  workout: 20,
  nutrition: 10,
  ai_message: 80,
};

export async function checkAndIncrement(userId: string, action: keyof typeof LIMITS | string): Promise<{ ok: boolean; remaining: number }> {
  const today = new Date().toISOString().slice(0, 10);
  const limit = LIMITS[action] ?? 50;
  const { data } = await supabase.from("daily_action_limits")
    .select("*").eq("user_id", userId).eq("log_date", today).eq("action_type", action).maybeSingle();
  const current = data?.count ?? 0;
  if (current >= limit) return { ok: false, remaining: 0 };
  const next = current + 1;
  await supabase.from("daily_action_limits").upsert(
    { user_id: userId, log_date: today, action_type: action, count: next },
    { onConflict: "user_id,log_date,action_type" }
  );
  return { ok: true, remaining: limit - next };
}