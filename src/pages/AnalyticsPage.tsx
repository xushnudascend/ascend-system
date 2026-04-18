import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart3, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";

const weekDays = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [thisWeek, setThisWeek] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [lastWeek, setLastWeek] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [strongHabits, setStrongHabits] = useState<string[]>([]);
  const [weakHabits, setWeakHabits] = useState<string[]>([]);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
      const [{ data: logs }, { data: habits }] = await Promise.all([
        supabase.from("habit_logs").select("log_date,xp_earned,habit_id").eq("user_id", user.id).gte("log_date", fourteenDaysAgo),
        supabase.from("habits").select("id,name,streak").eq("user_id", user.id),
      ]);

      // Calculate completion % per day for last 14 days
      const habitCount = Math.max(habits?.length || 1, 1);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const tw = Array(7).fill(0), lw = Array(7).fill(0);
      const counts: Record<string, number> = {};
      (logs || []).forEach(l => {
        counts[l.log_date] = (counts[l.log_date] || 0) + 1;
      });
      for (let i = 0; i < 7; i++) {
        const dayThis = new Date(today); dayThis.setDate(today.getDate() - (6 - i));
        const dayLast = new Date(today); dayLast.setDate(today.getDate() - (13 - i));
        tw[i] = Math.round(((counts[dayThis.toISOString().slice(0, 10)] || 0) / habitCount) * 100);
        lw[i] = Math.round(((counts[dayLast.toISOString().slice(0, 10)] || 0) / habitCount) * 100);
      }
      setThisWeek(tw); setLastWeek(lw);

      const sorted = (habits || []).sort((a, b) => (b.streak || 0) - (a.streak || 0));
      setStrongHabits(sorted.slice(0, 3).map(h => h.name));
      setWeakHabits(sorted.slice(-3).reverse().map(h => h.name));
      setLoading(false);
    })();
  }, [user]);

  const avgThis = Math.round(thisWeek.reduce((a, b) => a + b, 0) / 7);
  const avgLast = Math.round(lastWeek.reduce((a, b) => a + b, 0) / 7);
  const trend = avgThis - avgLast;
  const failureDays = weekDays.filter((_, i) => thisWeek[i] < 50);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Bu hafta</p>
            <p className="font-heading text-3xl font-bold text-primary">{avgThis}%</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">O'tgan hafta</p>
            <p className="font-heading text-3xl font-bold text-muted-foreground">{avgLast}%</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
          {trend >= 0 ? <TrendingUp className="w-5 h-5 text-success" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
          <p className="text-sm">
            {trend >= 0 ? `${trend}% yaxshilangan — davom eting!` : `${Math.abs(trend)}% pasaygan — sabab toping va tuzating.`}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Kunlik baholash</h3>
          <div className="space-y-3">
            {weekDays.map((d, i) => (
              <div key={d} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20">{d}</span>
                <div className="flex-1"><Progress value={thisWeek[i]} className="h-2" /></div>
                <span className={`text-xs font-medium w-10 text-right ${thisWeek[i] >= 80 ? "text-success" : thisWeek[i] >= 50 ? "text-warning" : "text-destructive"}`}>{thisWeek[i]}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-xl border border-success/20 bg-success/5">
            <h3 className="font-heading text-sm font-semibold text-success mb-3 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Kuchli tomonlar
            </h3>
            <ul className="space-y-2">
              {strongHabits.length ? strongHabits.map(h => <li key={h} className="text-sm">{h}</li>) : <li className="text-xs text-muted-foreground">Hali ma'lumot yo'q</li>}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="p-5 rounded-xl border border-destructive/20 bg-destructive/5">
            <h3 className="font-heading text-sm font-semibold text-destructive mb-3 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Zaif tomonlar
            </h3>
            <ul className="space-y-2">
              {weakHabits.length ? weakHabits.map(h => <li key={h} className="text-sm">{h}</li>) : <li className="text-xs text-muted-foreground">Hali ma'lumot yo'q</li>}
            </ul>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-warning/20 bg-warning/5 p-5">
          <h3 className="font-heading font-semibold text-warning mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Muvaffaqiyatsizlik naqshlari
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Eng zaif kunlar:</span> {failureDays.length ? failureDays.join(", ") : "Yo'q — zo'r!"}</p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              {trend < 0 ? "Sovuq haqiqat: bu hafta o'tgandan yomon. Reja yengillashtir, bahonalarni tashla." : "Davom eting — momentum sizniki."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
