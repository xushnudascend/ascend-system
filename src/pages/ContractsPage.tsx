import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileSignature, Plus, Loader2, Check, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Contract {
  id: string; title: string; target: string; duration_days: number;
  stake_xp: number; status: string; started_at: string; ends_at: string | null;
  completed_days: number;
}

export default function ContractsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [list, setList] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", target: "", duration_days: 7, stake_xp: 50 });

  useEffect(() => { if (user) load(); }, [user]);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("contracts").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setList((data as Contract[]) || []);
    setLoading(false);
  }
  async function create() {
    if (!form.title.trim() || !form.target.trim() || !user) return;
    const ends = new Date(Date.now() + form.duration_days * 86400000).toISOString();
    const { error } = await supabase.from("contracts").insert({ ...form, user_id: user.id, ends_at: ends });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Contract signed", description: `${form.duration_days} days. Stake: ${form.stake_xp} XP.` }); setOpen(false); setForm({ title: "", target: "", duration_days: 7, stake_xp: 50 }); load(); }
  }
  async function complete(c: Contract, won: boolean) {
    await supabase.from("contracts").update({ status: won ? "won" : "lost" }).eq("id", c.id);
    if (!won) {
      await supabase.from("fail_log").insert({ user_id: user!.id, what_failed: `Contract failed: ${c.title}`, xp_lost: c.stake_xp });
    }
    toast({ title: won ? "Won" : "Lost", description: won ? `+${c.stake_xp * 2} XP karma` : `-${c.stake_xp} XP, logged` });
    load();
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
              <FileSignature className="w-7 h-7 text-primary" /> Contracts
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Stake XP. Bind your future self.</p>
          </div>
          <button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> New
          </button>
        </header>

        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Contract title (e.g. Daily 6 AM wake)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <input value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="What proves it (e.g. screenshot of alarm)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                <span className="text-muted-foreground">Days</span>
                <input type="number" min={1} max={90} value={form.duration_days} onChange={e => setForm({ ...form, duration_days: +e.target.value })}
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <label className="text-xs">
                <span className="text-muted-foreground">Stake XP</span>
                <input type="number" min={10} max={500} value={form.stake_xp} onChange={e => setForm({ ...form, stake_xp: +e.target.value })}
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={create} className="px-3 py-2 rounded-lg text-sm bg-primary text-primary-foreground">Sign contract</button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : list.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 text-sm">No contracts yet. Bind a commitment.</div>
        ) : (
          <div className="space-y-3">
            {list.map(c => {
              const ends = c.ends_at ? new Date(c.ends_at) : null;
              const expired = ends && ends.getTime() < Date.now();
              const dayPct = Math.min(100, Math.round(((c.completed_days || 0) / c.duration_days) * 100));
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-4">
                  <Link to={`/contracts/${c.id}`} className="flex items-start justify-between gap-3 group">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold group-hover:text-primary transition-colors">{c.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Proof: {c.target}</div>
                      <div className="flex gap-3 text-[11px] text-muted-foreground mt-2 flex-wrap">
                        <span>{c.completed_days || 0}/{c.duration_days} kun</span>
                        <span className="text-primary">Stake: {c.stake_xp} XP</span>
                        <span className={`uppercase font-semibold ${c.status === "active" ? "text-amber-400" : c.status === "won" ? "text-emerald-400" : "text-rose-400"}`}>{c.status}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${dayPct}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </Link>
                  {c.status === "active" && (
                    <div className="flex gap-1 mt-3 justify-end">
                      <button onClick={() => complete(c, true)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><Check className="w-4 h-4" /></button>
                      <button onClick={() => complete(c, false)} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
