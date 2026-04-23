import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, AlertTriangle } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CATS = ["Social media", "YouTube", "Games", "TV/Netflix", "Aimless scroll", "Gossip", "Worry", "Other"];

export default function TimeLeakPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [cat, setCat] = useState(CATS[0]);
  const [label, setLabel] = useState("");
  const [mins, setMins] = useState(30);

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("time_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    setLogs(data || []);
  }
  useEffect(() => { load(); }, [user]);

  async function add() {
    if (!user) return;
    const { error } = await supabase.from("time_logs").insert({ user_id: user.id, category: cat, label: label || null, minutes: mins });
    if (error) return toast.error(error.message);
    setLabel(""); load();
  }
  async function del(id: string) {
    await supabase.from("time_logs").delete().eq("id", id); load();
  }

  const totals: Record<string, number> = {};
  logs.forEach(l => { totals[l.category] = (totals[l.category] || 0) + l.minutes; });
  const top3 = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const totalMin = Object.values(totals).reduce((a, b) => a + b, 0);
  const yearHrs = Math.round((totalMin / 7) * 365 / 60);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Clock className="w-7 h-7 text-amber-400" /> Time Leak Detector</h1>
          <p className="text-muted-foreground text-sm mt-1">Vaqtingiz qayerga ketyapti? Yashirin isrofni toping.</p>
        </header>

        {top3.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-amber-400" /><span className="font-heading font-bold text-amber-400">TOP 3 YASHIRIN ISROF</span></div>
            <div className="space-y-2">
              {top3.map(([c, m], i) => (
                <div key={c} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c}</div>
                    <div className="h-1.5 rounded-full bg-amber-500/10 mt-1"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${(m / top3[0][1]) * 100}%` }} /></div>
                  </div>
                  <div className="text-sm font-bold tabular-nums">{Math.floor(m / 60)}h {m % 60}m</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-amber-300/90">
              Bu sur'atda 1 yilda <span className="font-bold">{yearHrs} soat</span> yo'qotasiz. Bu {Math.round(yearHrs / 24)} kun.
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-3">Yangi isrof yozish</div>
          <div className="grid md:grid-cols-4 gap-3">
            <select value={cat} onChange={e => setCat(e.target.value)} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Izoh (ixtiyoriy)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm md:col-span-2" />
            <input type="number" value={mins} onChange={e => setMins(Number(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={add} className="mt-3 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Qo'shish</button>
        </div>

        <div className="space-y-2">
          {logs.map(l => (
            <div key={l.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-semibold">{l.category} {l.label && <span className="text-muted-foreground font-normal">— {l.label}</span>}</div>
                <div className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm font-bold text-amber-400">{l.minutes} min</div>
              <button onClick={() => del(l.id)} className="p-1.5 text-muted-foreground hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}