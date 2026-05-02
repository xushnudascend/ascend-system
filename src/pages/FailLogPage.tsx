import { useEffect, useState } from "react";
import { AlertOctagon, Plus, Skull, Search, ChevronDown, ChevronUp, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CATS = ["sleep", "stress", "environment", "energy", "skill", "identity"] as const;

export default function FailLogPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [causes, setCauses] = useState<Record<string, any>>({}); // by fail_id
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ cause: "", category: "sleep" as typeof CATS[number], habit_fix: "" });
  const [text, setText] = useState(""); const [xp, setXp] = useState(20);

  async function load() {
    const { data } = await supabase.from("fail_log").select("*").order("created_at", { ascending: false }).limit(50);
    setItems(data || []);
    const ids = Array.from(new Set((data || []).map(d => d.user_id)));
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("user_id,display_name").in("user_id", ids);
      const m: Record<string, any> = {}; (ps || []).forEach(p => { m[p.user_id] = p; }); setProfiles(m);
    }
    // load any linked root_causes
    const failIds = (data || []).map(d => d.id);
    if (failIds.length) {
      const { data: rc } = await supabase.from("root_causes").select("*").in("fail_id", failIds);
      const map: Record<string, any> = {};
      (rc || []).forEach(r => { if (r.fail_id) map[r.fail_id] = r; });
      setCauses(map);
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

  function toggle(failId: string, isMine: boolean) {
    if (!isMine) return; // only owner can drill down/add
    if (openId === failId) { setOpenId(null); return; }
    setOpenId(failId);
    const existing = causes[failId];
    setDraft({
      cause: existing?.cause || "",
      category: (existing?.category || "sleep") as typeof CATS[number],
      habit_fix: existing?.habit_fix || "",
    });
  }

  async function saveCause(failId: string, failure: string) {
    if (!user || !draft.cause.trim()) { toast.error("Sababni yozing"); return; }
    const existing = causes[failId];
    if (existing) {
      await supabase.from("root_causes").update({
        cause: draft.cause, category: draft.category, habit_fix: draft.habit_fix,
      }).eq("id", existing.id);
    } else {
      await supabase.from("root_causes").insert({
        user_id: user.id, fail_id: failId, failure, cause: draft.cause, category: draft.category, habit_fix: draft.habit_fix,
      });
    }
    toast.success("Root cause saqlandi");
    setOpenId(null);
    load();
  }

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Skull className="w-7 h-7 text-rose-400" /> Public Fail Log</h1>
          <p className="text-muted-foreground text-sm mt-1">Bajarmaganingiz hammaga ko'rinadi. Failure ni bossangiz — root cause va habit fix.</p>
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
          {items.map(i => {
            const mine = user?.id === i.user_id;
            const rc = causes[i.id];
            const isOpen = openId === i.id;
            return (
              <div key={i.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <button onClick={() => toggle(i.id, mine)} className={`w-full p-3 flex items-center gap-3 text-left ${mine ? "hover:bg-muted/40" : "cursor-default"}`}>
                  <Skull className="w-5 h-5 text-rose-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{i.what_failed}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>{profiles[i.user_id]?.display_name || "Anon"}</span>
                      <span>·</span>
                      <span>{new Date(i.created_at).toLocaleString()}</span>
                      {rc && (<>
                        <span>·</span>
                        <span className="text-primary capitalize">{rc.category}</span>
                      </>)}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-rose-400 shrink-0">-{i.xp_lost} XP</div>
                  {mine && (isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />)}
                </button>
                <AnimatePresence>
                  {isOpen && mine && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-muted/20 px-3 py-3 space-y-3">
                      <div>
                        <div className="text-[11px] uppercase text-muted-foreground flex items-center gap-1"><Search className="w-3 h-3" /> Detected cause</div>
                        <input value={draft.cause} onChange={e => setDraft({ ...draft, cause: e.target.value })}
                          placeholder="Asl sabab nima? (haqiqatni yoz)"
                          className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase text-muted-foreground mb-1">Category</div>
                        <div className="flex gap-1 flex-wrap">
                          {CATS.map(c => (
                            <button key={c} onClick={() => setDraft({ ...draft, category: c })}
                              className={`px-2.5 py-1 rounded-full text-xs capitalize ${draft.category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{c}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase text-muted-foreground flex items-center gap-1"><Wrench className="w-3 h-3" /> Habit fix</div>
                        <input value={draft.habit_fix} onChange={e => setDraft({ ...draft, habit_fix: e.target.value })}
                          placeholder="Qanday odat shu sababni yo'q qiladi?"
                          className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <button onClick={() => saveCause(i.id, i.what_failed)}
                        className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold">
                        Saqlash
                      </button>
                      {rc && (
                        <div className="text-[11px] text-muted-foreground">Oxirgi yangilanish: {new Date(rc.created_at).toLocaleString()}</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}