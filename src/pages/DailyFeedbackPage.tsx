import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function DailyFeedbackPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<any>(null);
  const [building, setBuilding] = useState(false);

  useEffect(() => { if (user) load(); }, [user]);
  async function load() {
    setLoading(true);
    const date = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from("daily_feedback").select("*").eq("user_id", user!.id).eq("log_date", date).maybeSingle();
    setToday(data); setLoading(false);
  }
  async function build() {
    setBuilding(true);
    const date = new Date().toISOString().slice(0, 10);
    const [{ count: habits }, { count: outputs }, { count: fails }, { data: time }] = await Promise.all([
      supabase.from("habit_logs").select("id", { count: "exact", head: true }).eq("user_id", user!.id).eq("log_date", date),
      supabase.from("outputs").select("id", { count: "exact", head: true }).eq("user_id", user!.id).eq("log_date", date),
      supabase.from("fail_log").select("id", { count: "exact", head: true }).eq("user_id", user!.id).gte("created_at", date),
      supabase.from("time_logs").select("category, minutes").eq("user_id", user!.id).eq("log_date", date),
    ]);
    const wasted = (time || []).filter(t => ["scroll", "tv", "idle"].includes(t.category)).reduce((a, b) => a + (b.minutes || 0), 0);
    const score = Math.max(0, Math.min(100, (habits || 0) * 10 + (outputs || 0) * 15 - (fails || 0) * 8 - Math.floor(wasted / 10)));
    const inputSummary = `${habits || 0} habits done · ${outputs || 0} outputs · ${fails || 0} fails · ${wasted} min wasted`;
    const analysis = score > 70 ? "Strong day. Output-driven." : score > 40 ? "Average. You stayed busy but produced little." : "Weak day. Mostly inputs, no outputs.";
    let adaptation = "Plan unchanged.";
    if (score < 40) {
      await supabase.from("plan_adaptations").insert({ user_id: user!.id, direction: "simplify", reason: "low score", details: "Reduce habits to 3 essentials." });
      adaptation = "Plan simplified: 3 essential habits only.";
    } else if (score > 80) {
      await supabase.from("plan_adaptations").insert({ user_id: user!.id, direction: "harden", reason: "high score", details: "Difficulty +1 next week." });
      adaptation = "Plan hardened: difficulty increased for next week.";
    }
    const feedback = score > 60 ? "Identity confirmed. Keep going." : "Identity threatened. Tomorrow, win the morning.";
    await supabase.from("daily_feedback").upsert({ user_id: user!.id, log_date: date, input_summary: inputSummary, analysis, adaptation, feedback, score }, { onConflict: "user_id,log_date" });
    setBuilding(false); load();
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-primary" /> Daily Feedback
          </h1>
          <p className="text-muted-foreground text-sm mt-1">INPUT → ANALYSIS → ADAPTATION → FEEDBACK</p>
        </header>

        {loading ? <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /> : today ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="text-xs text-muted-foreground">Today's score</div>
              <div className="font-heading text-5xl font-bold text-primary mt-1">{today.score}</div>
            </div>
            {[
              { k: "INPUT", v: today.input_summary, c: "text-cyan-400" },
              { k: "ANALYSIS", v: today.analysis, c: "text-amber-400" },
              { k: "ADAPTATION", v: today.adaptation, c: "text-violet-400" },
              { k: "FEEDBACK", v: today.feedback, c: "text-emerald-400" },
            ].map(s => (
              <motion.div key={s.k} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="bg-card border border-border rounded-xl p-4">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${s.c}`}>{s.k}</div>
                <div className="text-sm mt-1">{s.v}</div>
              </motion.div>
            ))}
            <button onClick={build} className="w-full text-xs text-muted-foreground hover:text-foreground py-2">Recompute</button>
          </motion.div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">No feedback for today yet.</p>
            <button onClick={build} disabled={building} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
              {building ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Generate today's feedback"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
