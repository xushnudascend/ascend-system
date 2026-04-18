import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Shield, Flame, Zap, Brain, Target, TrendingUp,
  CheckCircle2, Circle, Plus, Dumbbell, Trash2,
  DollarSign, Heart, GraduationCap, ChevronRight,
  Calculator, MessageCircle, BarChart3, Loader2,
} from "lucide-react";
import { categories } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TopBar from "@/components/TopBar";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  difficulty: number;
  xp_reward: number;
  streak: number;
  last_completed_at: string | null;
}

interface Profile {
  xp: number;
  streak: number;
  discipline_score: number;
  rank: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  sport: <Dumbbell className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  mental: <Heart className="w-5 h-5" />,
  intellect: <Brain className="w-5 h-5" />,
  discipline: <Shield className="w-5 h-5" />,
  university: <GraduationCap className="w-5 h-5" />,
};

const seedHabits = [
  { name: "Ertalab 5:30 da turish", difficulty: 3, xp_reward: 30 },
  { name: "30 daqiqa sport", difficulty: 4, xp_reward: 40 },
  { name: "Kitob o'qish (30 min)", difficulty: 2, xp_reward: 20 },
  { name: "Ijtimoiy tarmoqsiz 2 soat", difficulty: 5, xp_reward: 50 },
  { name: "Sovuq dush", difficulty: 3, xp_reward: 30 },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [bmiWeight, setBmiWeight] = useState("");
  const [bmiHeight, setBmiHeight] = useState("");
  const [weekData, setWeekData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: hs }, { data: pf }, { data: logs }] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", user!.id).order("created_at"),
      supabase.from("profiles").select("xp,streak,discipline_score,rank").eq("user_id", user!.id).maybeSingle(),
      supabase.from("habit_logs").select("log_date,xp_earned").eq("user_id", user!.id)
        .gte("log_date", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)),
    ]);

    // Seed default habits if user has none
    if (!hs || hs.length === 0) {
      const inserted = await supabase.from("habits").insert(
        seedHabits.map(h => ({ ...h, user_id: user!.id }))
      ).select();
      setHabits((inserted.data as Habit[]) || []);
    } else {
      // mark "completed" if last_completed_at is today
      const today = new Date().toISOString().slice(0, 10);
      setHabits(hs.map(h => ({ ...h, completed: h.last_completed_at?.slice(0, 10) === today })));
    }

    setProfile(pf || { xp: 0, streak: 0, discipline_score: 50, rank: "Beginner" });

    // Build week data (last 7 days, today last)
    const week = Array(7).fill(0);
    const todayIdx = 6;
    (logs || []).forEach(l => {
      const daysAgo = Math.floor((Date.now() - new Date(l.log_date).getTime()) / 86400000);
      const idx = todayIdx - daysAgo;
      if (idx >= 0 && idx < 7) week[idx] += l.xp_earned;
    });
    setWeekData(week);
    setLoading(false);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const disciplineScore = Math.min(100, Math.round(
    completionRate * 0.5 + Math.min(streak, 30) * 3.33 * 0.3 + (xp / 50) * 0.2
  ));
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const rank = disciplineScore >= 85 ? "Apex" : disciplineScore >= 65 ? "Elite" : disciplineScore >= 40 ? "Disciplined" : "Beginner";
  const rankColor = rank === "Apex" ? "text-success" : rank === "Elite" ? "text-warning" : rank === "Disciplined" ? "text-primary" : "text-muted-foreground";

  const toggleHabit = async (h: Habit) => {
    if (h.completed) return; // No "untoggle" — keep streak honest
    const today = new Date().toISOString();
    const newStreak = h.streak + 1;

    // Optimistic UI
    setHabits(prev => prev.map(x => x.id === h.id ? { ...x, completed: true, streak: newStreak } : x));
    const newXp = xp + h.xp_reward;
    setProfile(p => p ? { ...p, xp: newXp, streak: Math.max(p.streak, newStreak), rank } : p);

    await Promise.all([
      supabase.from("habits").update({
        completed: true, last_completed_at: today, streak: newStreak,
      }).eq("id", h.id),
      supabase.from("habit_logs").insert({
        user_id: user!.id, habit_id: h.id, xp_earned: h.xp_reward,
      }),
      supabase.from("profiles").update({
        xp: newXp, streak: Math.max(streak, newStreak),
        discipline_score: disciplineScore, rank,
      }).eq("user_id", user!.id),
    ]);

    toast({ title: `+${h.xp_reward} XP`, description: `Streak: ${newStreak} kun 🔥` });
  };

  const addHabit = async () => {
    if (!newHabit.trim()) return;
    const { data } = await supabase.from("habits").insert({
      user_id: user!.id, name: newHabit.trim(), difficulty: 3, xp_reward: 30,
    }).select().single();
    if (data) setHabits(prev => [...prev, { ...data, completed: false } as Habit]);
    setNewHabit(""); setShowAddHabit(false);
  };

  const deleteHabit = async (id: string) => {
    await supabase.from("habits").delete().eq("id", id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const bmi = bmiWeight && bmiHeight ? (Number(bmiWeight) / ((Number(bmiHeight) / 100) ** 2)).toFixed(1) : null;
  const bmiCategory = bmi ? (Number(bmi) < 18.5 ? "Kam vazn" : Number(bmi) < 25 ? "Normal" : Number(bmi) < 30 ? "Ortiqcha vazn" : "Semizlik") : null;
  const bmiColor = bmiCategory === "Normal" ? "text-success" : bmiCategory === "Kam vazn" || bmiCategory === "Ortiqcha vazn" ? "text-warning" : "text-destructive";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const maxWeek = Math.max(...weekData, 50);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-2 p-6 rounded-2xl border border-border bg-card glow-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Shield className="w-4 h-4" /> Intizom balli</p>
              <span className={`font-heading text-sm font-bold ${rankColor}`}>{rank}</span>
            </div>
            <p className="font-heading text-5xl font-bold glow-text">{disciplineScore}</p>
            <Progress value={disciplineScore} className="h-2 mt-3" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Flame className="w-4 h-4" /> Streak</p>
            <p className={`font-heading text-4xl font-bold mt-1 ${streak < 3 ? "text-destructive" : "text-success"}`}>
              {streak}<span className="text-lg">kun</span>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Zap className="w-4 h-4" /> Level {level}</p>
            <p className="font-heading text-2xl font-bold text-xp mt-1">{xp} XP</p>
            <Progress value={(xpInLevel / 200) * 100} className="h-1.5 mt-2" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Bugungi vazifalar
            </h2>
            <span className="text-sm text-muted-foreground">{completedCount}/{habits.length}</span>
          </div>
          <div className="space-y-2">
            {habits.map(h => (
              <div key={h.id}
                className={`group w-full flex items-center gap-3 p-3 rounded-xl transition-all ${h.completed ? "bg-success/10 border border-success/20" : "bg-card border border-border hover:border-primary/30"}`}>
                <button onClick={() => toggleHabit(h)} disabled={h.completed} className="shrink-0">
                  {h.completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                </button>
                <span className={`text-sm flex-1 text-left ${h.completed ? "line-through text-muted-foreground" : ""}`}>{h.name}</span>
                {h.streak > 0 && <span className="text-xs text-warning flex items-center gap-0.5"><Flame className="w-3 h-3" />{h.streak}</span>}
                <span className="text-xs text-xp">+{h.xp_reward}</span>
                <button onClick={() => deleteHabit(h.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
          {showAddHabit ? (
            <div className="flex gap-2 mt-3">
              <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === "Enter" && addHabit()}
                placeholder="Yangi odat..." className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" autoFocus />
              <button onClick={addHabit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Qo'shish</button>
            </div>
          ) : (
            <button onClick={() => setShowAddHabit(true)}
              className="w-full mt-3 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-sm flex items-center justify-center gap-1 hover:border-primary/50 transition-colors">
              <Plus className="w-4 h-4" /> Odat qo'shish
            </button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" /> BMI Kalkulyator
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Vazn (kg)</label>
              <input value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} type="number" placeholder="70"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Bo'y (sm)</label>
              <input value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} type="number" placeholder="175"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          {bmi && (
            <div className="mt-4 p-4 rounded-xl bg-background border border-border text-center">
              <p className="text-sm text-muted-foreground">Sizning BMI</p>
              <p className={`font-heading text-3xl font-bold ${bmiColor}`}>{bmi}</p>
              <p className={`text-sm font-medium ${bmiColor}`}>{bmiCategory}</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-primary/30 bg-card p-6 glow-border">
          <Link to="/ai-mentor" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold">AI Mentor</h3>
                <p className="text-sm text-muted-foreground">Savol bering, maslahat oling</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </motion.div>

        <div>
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Bo'limlar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to={`/courses?category=${cat.id}`}
                  className="block p-5 rounded-xl border border-border bg-card card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    {categoryIcons[cat.id]}
                  </div>
                  <h3 className="font-heading font-semibold text-sm">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.subcategories.length} ta bo'lim</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Haftalik XP
            </h2>
            <Link to="/analytics" className="text-xs text-primary hover:underline">Batafsil →</Link>
          </div>
          <div className="flex items-end gap-2 h-32">
            {["Du", "Se", "Cho", "Pa", "Ju", "Sh", "Ya"].map((d, i) => {
              const val = (weekData[i] / maxWeek) * 100;
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-primary/20 relative" style={{ height: `${Math.max(val, 4)}%` }}>
                    <div className="absolute bottom-0 w-full rounded-t-lg bg-primary transition-all" style={{ height: "100%" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{d}</span>
                  <span className="text-[10px] text-xp">{weekData[i]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
