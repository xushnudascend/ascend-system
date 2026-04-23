import { useEffect, useState } from "react";
import { LineChart as LCIcon, TrendingUp } from "lucide-react";
import TopBar from "@/components/TopBar";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function TrajectoryPage() {
  const { user } = useAuth();
  const [score, setScore] = useState(50);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("discipline_score,streak").eq("user_id", user.id).maybeSingle();
      if (data) { setScore(data.discipline_score || 50); setStreak(data.streak || 0); }
    })();
  }, [user]);

  // Trajectory: linear improvement at current pace vs current state
  const months = [1, 3, 6, 9, 12];
  const pace = Math.max(0.5, score / 50); // multiplier
  const data = months.map(m => ({
    month: `${m}m`,
    you: Math.min(100, score + m * 2 * pace),
    average: Math.min(100, 50 + m * 0.5),
    elite: Math.min(100, 80 + m * 1),
  }));

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><LCIcon className="w-7 h-7 text-emerald-400" /> Long-term Trajectory</h1>
          <p className="text-muted-foreground text-sm mt-1">30 / 90 / 365 kunda kim bo'lasiz?</p>
        </header>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4"><div className="text-xs text-muted-foreground">Hozirgi ball</div><div className="font-heading text-3xl font-bold text-primary">{score}</div></div>
          <div className="bg-card border border-border rounded-xl p-4"><div className="text-xs text-muted-foreground">Streak</div><div className="font-heading text-3xl font-bold">{streak}d</div></div>
          <div className="bg-card border border-border rounded-xl p-4"><div className="text-xs text-muted-foreground">1 yil prognozi</div><div className="font-heading text-3xl font-bold text-emerald-400">{Math.round(data[4].you)}</div></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Yo'lingiz vs O'rtacha vs Elite</div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={data}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="you" stroke="hsl(var(--primary))" strokeWidth={3} />
                <Line type="monotone" dataKey="average" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="elite" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[{m:30,t:"30 kun"},{m:90,t:"90 kun"},{m:365,t:"1 yil"}].map(p => (
            <div key={p.m} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground">{p.t} keyin kim bo'lasiz</div>
              <div className="font-heading text-xl font-bold mt-1">{Math.round(score + (p.m / 30) * 2 * pace)} ball</div>
              <div className="text-xs text-muted-foreground mt-1">{Math.round(score + (p.m / 30) * 2 * pace) > 80 ? "Elite zonasi" : Math.round(score + (p.m / 30) * 2 * pace) > 60 ? "Yuqori daraja" : "O'sishda"}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}