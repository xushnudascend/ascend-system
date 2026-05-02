import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileSignature, Loader2, Check, X, Clock, CheckCircle2, XCircle, Trophy } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Contract {
  id: string; title: string; target: string; duration_days: number;
  stake_xp: number; status: string; started_at: string; ends_at: string | null;
  completed_days: number;
}

function fmtRemaining(ms: number) {
  if (ms <= 0) return "Tugagan";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d}k ${h}s ${m}d`;
  return `${h}s ${m}d ${s}son`;
}

export default function ContractDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [c, setC] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [marking, setMarking] = useState(false);

  useEffect(() => { if (user && id) load(); }, [user, id]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("contracts").select("*").eq("id", id!).maybeSingle();
    setC(data as Contract);
    setLoading(false);
    if (data) await maybeAutoSettle(data as Contract);
  }

  async function maybeAutoSettle(con: Contract) {
    if (con.status !== "active" || !con.ends_at) return;
    const ended = new Date(con.ends_at).getTime() <= Date.now();
    if (!ended) return;
    // Auto outcome based on completed_days vs target days
    const won = (con.completed_days || 0) >= con.duration_days;
    await settle(con, won, true);
  }

  async function settle(con: Contract, won: boolean, auto = false) {
    await supabase.from("contracts").update({ status: won ? "won" : "lost" }).eq("id", con.id);
    if (won) {
      const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user!.id).maybeSingle();
      const reward = con.stake_xp * 2;
      if (prof) await supabase.from("profiles").update({ xp: (prof.xp || 0) + reward }).eq("user_id", user!.id);
      toast.success(`Won — +${reward} XP karma${auto ? " (auto)" : ""}`);
    } else {
      await supabase.from("fail_log").insert({ user_id: user!.id, what_failed: `Contract failed: ${con.title}`, xp_lost: con.stake_xp });
      const { data: prof } = await supabase.from("profiles").select("xp").eq("user_id", user!.id).maybeSingle();
      if (prof) await supabase.from("profiles").update({ xp: Math.max(0, (prof.xp || 0) - con.stake_xp) }).eq("user_id", user!.id);
      toast.error(`Lost — -${con.stake_xp} XP${auto ? " (auto)" : ""}`);
    }
    load();
  }

  async function markDay() {
    if (!c || c.status !== "active") return;
    setMarking(true);
    const next = (c.completed_days || 0) + 1;
    await supabase.from("contracts").update({ completed_days: next }).eq("id", c.id);
    setMarking(false);
    if (next >= c.duration_days) {
      await settle({ ...c, completed_days: next }, true);
    } else {
      toast.success(`+1 kun · ${next}/${c.duration_days}`);
      load();
    }
  }

  if (loading) return <div className="min-h-screen bg-background"><TopBar /><div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div></div>;
  if (!c) return <div className="min-h-screen bg-background"><TopBar /><div className="text-center py-20 text-muted-foreground">Topilmadi</div></div>;

  const ends = c.ends_at ? new Date(c.ends_at).getTime() : 0;
  const remaining = ends - now;
  const totalMs = c.duration_days * 86400000;
  const elapsedPct = Math.min(100, Math.max(0, ((totalMs - remaining) / totalMs) * 100));
  const dayPct = Math.min(100, Math.round(((c.completed_days || 0) / c.duration_days) * 100));

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link to="/contracts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Contracts
        </Link>

        <Card className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground"><FileSignature className="w-4 h-4" /> Contract</div>
              <h1 className="text-2xl font-heading font-bold mt-1">{c.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Proof: {c.target}</p>
            </div>
            <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-bold uppercase ${c.status === "active" ? "bg-amber-500/10 text-amber-400" : c.status === "won" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
              {c.status}
            </span>
          </div>

          {/* Countdown */}
          <div className="mt-5 p-4 rounded-xl bg-muted/30">
            <div className="text-xs uppercase text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4" /> Qolgan vaqt</div>
            <div className="font-heading text-3xl font-bold text-primary mt-1 tabular-nums">{fmtRemaining(remaining)}</div>
            <div className="h-1.5 bg-background rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${elapsedPct}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>Boshlangan: {new Date(c.started_at).toLocaleDateString()}</span>
              {c.ends_at && <span>Tugaydi: {new Date(c.ends_at).toLocaleDateString()}</span>}
            </div>
          </div>

          {/* Day tracker */}
          <div className="mt-4 p-4 rounded-xl bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Bajarilgan kunlar</div>
                <div className="font-heading text-3xl font-bold mt-1">{c.completed_days || 0} <span className="text-base text-muted-foreground">/ {c.duration_days}</span></div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase text-muted-foreground">Stake</div>
                <div className="font-heading text-xl font-bold text-primary">{c.stake_xp} XP</div>
              </div>
            </div>
            <div className="h-2 bg-background rounded-full mt-3 overflow-hidden">
              <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${dayPct}%` }} />
            </div>
            <div className="grid grid-cols-7 gap-1 mt-3">
              {Array.from({ length: c.duration_days }).map((_, i) => (
                <div key={i} className={`h-6 rounded ${i < (c.completed_days || 0) ? "bg-emerald-500/70" : "bg-background border border-border"}`} />
              ))}
            </div>
          </div>

          {/* Outcomes */}
          {c.status === "active" ? (
            <div className="mt-5 space-y-2">
              <Button onClick={markDay} disabled={marking} className="w-full">
                {marking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                Bugungi kunni belgilash
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => settle(c, true)}><CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" /> Won</Button>
                <Button variant="outline" onClick={() => settle(c, false)}><XCircle className="w-4 h-4 mr-1 text-rose-400" /> Lost</Button>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">Vaqt tugaganida kunlar bajarilganiga qarab avto-natija beriladi.</p>
            </div>
          ) : c.status === "won" ? (
            <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <Trophy className="w-7 h-7 text-emerald-400 mx-auto" />
              <div className="font-heading font-bold text-emerald-400 mt-1">Won — +{c.stake_xp * 2} XP unlock</div>
            </div>
          ) : (
            <div className="mt-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <X className="w-7 h-7 text-rose-400 mx-auto" />
              <div className="font-heading font-bold text-rose-400 mt-1">Lost — -{c.stake_xp} XP penalty (logged publicly)</div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}