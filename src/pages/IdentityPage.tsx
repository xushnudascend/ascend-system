import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertTriangle, Trophy } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const identities = [
  { id: "athlete", label: "Athlete", desc: "Men kuchli va sog'lom odamman", emoji: "💪", check: ["sport", "trening", "yugur", "push", "gym", "uyqu"], avoid: ["fast food", "alkogol", "kech yot"] },
  { id: "scholar", label: "Scholar", desc: "Men o'qiydigan odamman", emoji: "📚", check: ["o'qish", "kitob", "kurs", "yozish", "essay"], avoid: ["tiktok", "scroll", "vaqt o'ldir"] },
  { id: "builder", label: "Builder", desc: "Men yaratuvchiman", emoji: "🛠️", check: ["kod", "loyiha", "build", "ship", "design", "yozdim"], avoid: ["seriya", "ko'p o'yin"] },
  { id: "warrior", label: "Warrior", desc: "Men intizomli odamman", emoji: "⚔️", check: ["erta turdim", "sovuq dush", "fokus", "mashq"], avoid: ["bahona", "ertaga", "skip"] },
  { id: "monk", label: "Monk", desc: "Men tinch va ongli odamman", emoji: "🧘", check: ["meditatsiya", "nafas", "tafakkur", "shukr"], avoid: ["g'azab", "stress", "shovqin"] },
];

export default function IdentityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chosen, setChosen] = useState<string | null>(null);
  const [votes, setVotes] = useState(0);
  const [action, setAction] = useState("");
  const [verdict, setVerdict] = useState<{ ok: boolean; reason: string } | null>(null);

  useEffect(() => { load(); }, [user]);
  async function load() {
    if (!user) return;
    const { data } = await supabase.from("user_identity").select("*").eq("user_id", user.id).maybeSingle();
    if (data) { setChosen(data.identity); setVotes(data.votes); }
  }

  async function pick(id: string) {
    if (!user) return;
    setChosen(id); setVotes(0);
    await supabase.from("user_identity").upsert({ user_id: user.id, identity: id, votes: 0 });
    toast({ title: "Identity tanlandi", description: identities.find(i => i.id === id)?.desc });
  }

  async function check() {
    if (!chosen || !action.trim()) return;
    const ident = identities.find(i => i.id === chosen)!;
    const a = action.toLowerCase();
    const matches = ident.check.some(k => a.includes(k));
    const violates = ident.avoid.some(k => a.includes(k));
    if (violates) setVerdict({ ok: false, reason: `Bu harakat "${ident.label}" identityga zid keladi.` });
    else if (matches) {
      setVerdict({ ok: true, reason: `Mukammal — har bir harakat = identity vote.` });
      const nv = votes + 1; setVotes(nv);
      if (user) await supabase.from("user_identity").update({ votes: nv }).eq("user_id", user.id);
    } else setVerdict({ ok: false, reason: `Aniq emas — bu identity-ni mustahkamlamaydi.` });
    setAction("");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" /> Identity Enforcement
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Identity tanlang. Har bir harakat shu identitetga mos bo'lishi kerak.</p>
        </header>

        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {identities.map(i => (
            <motion.button key={i.id} whileHover={{ y: -2 }} onClick={() => pick(i.id)}
              className={`p-4 rounded-xl border text-center transition-all ${chosen === i.id ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
              <div className="text-3xl mb-1">{i.emoji}</div>
              <div className="font-semibold text-sm">{i.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{i.desc}</div>
            </motion.button>
          ))}
        </div>

        {chosen && (
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-sm">Identity ovozlari: <strong>{votes}</strong></span>
              </div>
              <span className="text-xs text-muted-foreground">100 ovoz = mustahkam identity</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-cyan-400" style={{ width: `${Math.min(100, votes)}%` }} />
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-semibold mb-2">Reality check — qanday harakat qilmoqchisiz?</label>
          <div className="flex gap-2">
            <input value={action} onChange={e => setAction(e.target.value)} placeholder="Masalan: 1 soat tiktok ko'rmoqchiman"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={check} disabled={!chosen} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50">Tekshir</button>
          </div>
          {verdict && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg text-sm flex gap-2 ${verdict.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
              {verdict.ok ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
              <span>{verdict.reason}</span>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}