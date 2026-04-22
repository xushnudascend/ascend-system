import { useEffect, useState } from "react";
import { Beaker, Plus, CheckCircle2, X } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const presets = [
  "7 kun: shakar yo'q",
  "14 kun: 5:00 da turish",
  "30 kun: kuniga 30 min kitob",
  "7 kun: ijtimoiy media yo'q",
  "21 kun: kuniga 10000 qadam",
  "30 kun: meditatsiya 10 min",
  "7 kun: sovuq dush",
];

interface Exp { id: string; title: string; duration_days: number; status: string; started_at: string; before_score: number | null; after_score: number | null; notes: string | null; }

export default function ExperimentLabPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [list, setList] = useState<Exp[]>([]);
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(7);
  const [before, setBefore] = useState(50);

  useEffect(() => { load(); }, [user]);
  async function load() {
    if (!user) return;
    const { data } = await supabase.from("experiments").select("*").eq("user_id", user.id).order("started_at", { ascending: false });
    setList((data as Exp[]) || []);
  }

  async function create() {
    if (!user || !title.trim()) return;
    await supabase.from("experiments").insert({ user_id: user.id, title, duration_days: days, before_score: before });
    setTitle(""); load();
    toast({ title: "Eksperiment boshlandi", description: title });
  }

  async function complete(e: Exp, after: number) {
    await supabase.from("experiments").update({ status: "completed", after_score: after }).eq("id", e.id);
    load();
  }
  async function abandon(e: Exp) {
    await supabase.from("experiments").update({ status: "abandoned" }).eq("id", e.id);
    load();
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Beaker className="w-7 h-7 text-primary" /> Personal Experiment Lab
          </h1>
          <p className="text-muted-foreground text-sm mt-1">O'zingiz ustingizda test qiling. Before/After natija.</p>
        </header>

        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Eksperiment nomi..."
              className="sm:col-span-2 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <select value={days} onChange={e => setDays(Number(e.target.value))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option value={7}>7 kun</option><option value={14}>14 kun</option><option value={21}>21 kun</option><option value={30}>30 kun</option>
            </select>
          </div>
          <label className="block text-xs text-muted-foreground mb-1">Hozirgi ball (0-100): {before}</label>
          <input type="range" min={0} max={100} value={before} onChange={e => setBefore(Number(e.target.value))} className="w-full accent-primary mb-3" />
          <div className="flex gap-2 mb-3 flex-wrap">
            {presets.map(p => <button key={p} onClick={() => setTitle(p)} className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-primary/10">{p}</button>)}
          </div>
          <button onClick={create} className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Eksperiment boshlash
          </button>
        </div>

        <div className="space-y-3">
          {list.length === 0 && <div className="text-center text-muted-foreground py-8 bg-card border border-border rounded-xl">Hali eksperiment yo'q.</div>}
          {list.map(e => {
            const elapsed = Math.floor((Date.now() - new Date(e.started_at).getTime()) / 86400000);
            const pct = Math.min(100, (elapsed / e.duration_days) * 100);
            return (
              <div key={e.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{elapsed} / {e.duration_days} kun · {e.status}</div>
                  </div>
                  {e.status === "active" && (
                    <div className="flex gap-1">
                      <button onClick={() => complete(e, prompt("After ball (0-100)") ? Number(prompt("After ball (0-100)")) : 50)} className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><CheckCircle2 className="w-4 h-4" /></button>
                      <button onClick={() => abandon(e)} className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${e.status === "completed" ? "bg-emerald-400" : e.status === "abandoned" ? "bg-rose-400" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
                {e.status === "completed" && e.after_score != null && e.before_score != null && (
                  <div className="mt-2 text-xs">
                    Natija: {e.before_score} → {e.after_score} ({e.after_score - e.before_score >= 0 ? "+" : ""}{e.after_score - e.before_score})
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}