import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CATS = ["sleep", "stress", "environment", "energy", "skill", "identity"];

export default function RootCausePage() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState("");
  const [cause, setCause] = useState("");
  const [cat, setCat] = useState("sleep");

  useEffect(() => { if (user) load(); }, [user]);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("root_causes").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(40);
    setList(data || []); setLoading(false);
  }
  async function add() {
    if (!failure.trim() || !cause.trim() || !user) return;
    await supabase.from("root_causes").insert({ user_id: user.id, failure, cause, category: cat });
    setFailure(""); setCause(""); load();
  }

  const top = CATS.map(c => ({ c, n: list.filter(x => x.category === c).length })).sort((a, b) => b.n - a.n);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Search className="w-7 h-7 text-primary" /> Root Cause Engine
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Not "what failed" — "why".</p>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {top.map(t => (
            <div key={t.c} className="bg-card border border-border rounded-lg p-2 text-center">
              <div className="text-xs text-muted-foreground capitalize">{t.c}</div>
              <div className="font-heading text-lg font-bold text-primary">{t.n}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-2">
          <input value={failure} onChange={e => setFailure(e.target.value)} placeholder="What failed today?"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
          <input value={cause} onChange={e => setCause(e.target.value)} placeholder="Real reason (be honest)"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-2.5 py-1 rounded-full text-xs capitalize ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{c}</button>
            ))}
          </div>
          <button onClick={add} className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Log root cause
          </button>
        </div>

        {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" /> : (
          <div className="space-y-2">
            {list.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                className="bg-card border border-border rounded-lg p-3">
                <div className="text-sm font-medium">{r.failure}</div>
                <div className="text-xs text-muted-foreground mt-1">→ <span className="text-primary">{r.cause}</span> · <span className="capitalize">{r.category}</span></div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
