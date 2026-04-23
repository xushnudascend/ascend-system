import { useEffect, useState } from "react";
import { Swords, Plus, Trophy } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function DuelsPage() {
  const { user } = useAuth();
  const [duels, setDuels] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [oppId, setOppId] = useState(""); const [target, setTarget] = useState(""); const [days, setDays] = useState(7);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("duels").select("*").or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`).order("started_at", { ascending: false });
    setDuels(data || []);
    const { data: ps } = await supabase.from("profiles").select("user_id,display_name,xp").neq("user_id", user.id).limit(50);
    setProfiles(ps || []);
  }
  useEffect(() => { load(); }, [user]);

  async function create() {
    if (!user || !oppId || !target.trim()) return;
    const ends = new Date(); ends.setDate(ends.getDate() + days);
    const { error } = await supabase.from("duels").insert({ challenger_id: user.id, opponent_id: oppId, target, duration_days: days, ends_at: ends.toISOString() });
    if (error) return toast.error(error.message);
    toast.success("Duel chaqirig'i yuborildi"); setTarget(""); load();
  }

  async function score(d: any, who: "ch" | "op", inc: number) {
    const field = who === "ch" ? "challenger_score" : "opponent_score";
    await supabase.from("duels").update({ [field]: (d[field] || 0) + inc }).eq("id", d.id); load();
  }

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Swords className="w-7 h-7 text-amber-400" /> 1v1 Discipline Duels</h1>
          <p className="text-muted-foreground text-sm mt-1">Do'stingizni chaqiring — kim ko'proq disciplinali?</p>
        </header>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-3">Yangi duel</div>
          <select value={oppId} onChange={e => setOppId(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm mb-2">
            <option value="">Raqib tanlang...</option>
            {profiles.map(p => <option key={p.user_id} value={p.user_id}>{p.display_name || "Anon"} (XP: {p.xp})</option>)}
          </select>
          <input value={target} onChange={e => setTarget(e.target.value)} placeholder="Maqsad: 7 kun erta turish" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm mb-2" />
          <div className="flex items-center gap-3 mb-3"><label className="text-xs text-muted-foreground">Kun:</label><input type="number" value={days} min={1} max={90} onChange={e => setDays(Number(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm w-24" /></div>
          <button onClick={create} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Chaqirish</button>
        </div>
        <div className="space-y-3">
          {duels.map(d => {
            const isCh = d.challenger_id === user?.id;
            return (
              <div key={d.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Swords className="w-5 h-5 text-amber-400" />
                  <div className="flex-1"><div className="font-semibold text-sm">{d.target}</div><div className="text-xs text-muted-foreground">{d.duration_days} kun · {d.status}</div></div>
                  {d.winner_id && <Trophy className="w-5 h-5 text-amber-400" />}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isCh ? "bg-primary/15" : "bg-muted"}`}>
                    <div className="text-xs text-muted-foreground">{isCh ? "Siz" : "Raqib"} (Ch)</div>
                    <div className="font-heading text-2xl font-bold">{d.challenger_score}</div>
                    {isCh && <button onClick={() => score(d, "ch", 1)} className="mt-1 text-xs px-2 py-1 rounded bg-primary text-primary-foreground">+1</button>}
                  </div>
                  <div className={`p-3 rounded-lg ${!isCh ? "bg-primary/15" : "bg-muted"}`}>
                    <div className="text-xs text-muted-foreground">{!isCh ? "Siz" : "Raqib"} (Op)</div>
                    <div className="font-heading text-2xl font-bold">{d.opponent_score}</div>
                    {!isCh && <button onClick={() => score(d, "op", 1)} className="mt-1 text-xs px-2 py-1 rounded bg-primary text-primary-foreground">+1</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}