import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import TopBar from "@/components/TopBar";
import { Trophy, Loader2, Flame, Zap } from "lucide-react";

interface LBRow { user_id: string; display_name: string | null; xp: number; streak: number; discipline_score: number; rank: string; }

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LBRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"xp" | "streak" | "discipline">("discipline");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const col = tab === "xp" ? "xp" : tab === "streak" ? "streak" : "discipline_score";
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, xp, streak, discipline_score, rank")
        .order(col, { ascending: false })
        .limit(50);
      setRows(data ?? []);
      setLoading(false);
    })();
  }, [tab]);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-xl font-bold">Reyting</h1>
        </div>

        <div className="flex gap-2">
          {([["discipline", "Intizom"], ["xp", "XP"], ["streak", "Streak"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === k ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <motion.div key={r.user_id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${i < 3 ? "border-primary/30 bg-card glow-border" : "border-border bg-card"}`}>
                <span className="font-heading font-bold w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                  {(r.display_name ?? "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.display_name ?? "Anonim"}</p>
                  <p className="text-xs text-muted-foreground">{r.rank}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-primary">
                    {tab === "xp" ? `${r.xp}` : tab === "streak" ? `${r.streak}` : `${r.discipline_score}`}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-0.5 justify-end">
                    {tab === "xp" ? <><Zap className="w-3 h-3" /> XP</> : tab === "streak" ? <><Flame className="w-3 h-3" /> kun</> : "ball"}
                  </p>
                </div>
              </motion.div>
            ))}
            {rows.length === 0 && <p className="text-center text-muted-foreground py-8">Hali foydalanuvchilar yo'q</p>}
          </div>
        )}
      </div>
    </div>
  );
}
