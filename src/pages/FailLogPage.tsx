import { useEffect, useState } from "react";
import { AlertOctagon, Plus, Skull } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function FailLogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [text, setText] = useState(""); const [xp, setXp] = useState(20);

  async function load() {
    const { data } = await supabase.from("fail_log").select("*").order("created_at", { ascending: false }).limit(50);
    setItems(data || []);
    const ids = Array.from(new Set((data || []).map(d => d.user_id)));
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("user_id,display_name").in("user_id", ids);
      const m: Record<string, any> = {}; (ps || []).forEach(p => { m[p.user_id] = p; }); setProfiles(m);
    }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!user || !text.trim()) return;
    const { error } = await supabase.from("fail_log").insert({ user_id: user.id, what_failed: text, xp_lost: xp });
    if (error) return toast.error(error.message);
    // Subtract XP from profile
    const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user.id).maybeSingle();
    if (prof) await supabase.from("profiles").update({ xp: Math.max(0, (prof.xp || 0) - xp) }).eq("user_id", user.id);
    setText(""); toast.error(`-${xp} XP. Hamma ko'radi.`); load();
  }

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Skull className="w-7 h-7 text-rose-400" /> Public Fail Log</h1>
          <p className="text-muted-foreground text-sm mt-1">Bajarmaganingiz hammaga ko'rinadi. Bu — Consequence System.</p>
        </header>
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5">
          <div className="font-heading text-base font-bold mb-3 text-rose-400 flex items-center gap-2"><AlertOctagon className="w-5 h-5" /> Bugun nimani bajarmadingiz?</div>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Masalan: 30 min sport o'tkazib yubordim"
            className="w-full bg-background border border-rose-500/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500" />
          <div className="flex items-center gap-3 mt-3">
            <label className="text-xs text-muted-foreground">XP penalty:</label>
            <input type="range" min={5} max={100} step={5} value={xp} onChange={e => setXp(Number(e.target.value))} className="flex-1 accent-rose-500" />
            <span className="text-sm font-bold text-rose-400 tabular-nums">-{xp}</span>
          </div>
          <button onClick={add} className="mt-3 px-5 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Tan olish (public)</button>
        </div>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <Skull className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm">{i.what_failed}</div>
                <div className="text-xs text-muted-foreground">{profiles[i.user_id]?.display_name || "Anon"} · {new Date(i.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm font-bold text-rose-400">-{i.xp_lost} XP</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}