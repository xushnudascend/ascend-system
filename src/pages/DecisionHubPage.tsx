import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Activity, Zap, AlertTriangle, Target, Trophy, FlaskConical,
  Skull, ShieldAlert, Layers, Globe2, Minimize2, Sparkles, Loader2,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/useI18n";

type Mode = "beast" | "normal" | "recovery";
const realMissions = [
  "Notanish 3 ta odam bilan gaplash",
  "Ertaga 5:00 da tur",
  "7 kun ketma-ket sovuq dush",
  "Bugun telefonni 4 soat o'chir",
  "10 km piyoda yur",
  "Kim ranjiganini bilasan — kechir",
  "Bir kishiga rahmat ayt (xabar yoz)",
  "Bugun shakar yema",
  "30 daqiqa quyosh ostida o'tir",
  "Eng qiyin vazifani birinchi qil",
];

export default function DecisionHubPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [advice, setAdvice] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("ascend_mode") as Mode) || "normal");
  const [focusActive, setFocusActive] = useState(false);
  const [focusLeft, setFocusLeft] = useState(25 * 60);

  useEffect(() => { localStorage.setItem("ascend_mode", mode); }, [mode]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: h }, { data: l }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id).gte("log_date", new Date(Date.now() - 30*86400000).toISOString().slice(0,10)),
      ]);
      setProfile(p); setHabits(h || []); setLogs(l || []);
    })();
  }, [user]);

  useEffect(() => {
    if (!focusActive) return;
    if (focusLeft <= 0) { setFocusActive(false); toast({ title: "🎉 Sessiya tugadi!" }); return; }
    const id = setInterval(() => setFocusLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [focusActive, focusLeft]);

  // Truth dashboard derived metrics
  const truth = useMemo(() => {
    const total = habits.length || 1;
    const done = habits.filter(h => h.completed).length;
    const completion = Math.round((done / total) * 100);
    const avgStreak = habits.length ? Math.round(habits.reduce((s, h) => s + h.streak, 0) / habits.length) : 0;
    const last7 = logs.filter(l => new Date(l.log_date) > new Date(Date.now() - 7*86400000)).length;
    const wasted = Math.max(0, 6 - last7) * 0.7; // synthetic estimate
    return { completion, avgStreak, last7, wasted };
  }, [habits, logs]);

  const lifeScore = useMemo(() => {
    const d = profile?.discipline_score ?? 50;
    const s = Math.min(100, (profile?.streak ?? 0) * 5);
    const x = Math.min(100, (profile?.xp ?? 0) / 50);
    return Math.round((d * 0.4 + s * 0.3 + x * 0.3));
  }, [profile]);

  // Failure prediction (heuristic)
  const failureRisk = useMemo(() => {
    if (!profile) return 0;
    let risk = 0;
    if (truth.last7 < 3) risk += 35;
    if (truth.avgStreak < 2) risk += 25;
    if ((profile.discipline_score ?? 50) < 40) risk += 30;
    if (truth.completion < 30) risk += 10;
    return Math.min(100, risk);
  }, [profile, truth]);

  async function askWhatNow() {
    if (!user) return;
    setLoadingAi(true); setAdvice("");
    try {
      const ctx = `Profile: discipline=${profile?.discipline_score}, streak=${profile?.streak}, xp=${profile?.xp}, mode=${mode}.
Habits: ${habits.map(h => `${h.name} (streak ${h.streak}, ${h.completed?"✓":"○"})`).join(", ") || "yo'q"}.
Last 7d logs: ${truth.last7}. Failure risk: ${failureRisk}%. Life score: ${lifeScore}.`;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: [{ role: "user", content: `${ctx}\n\nHozir nima qilishim kerak? Eng optimal 1 ta harakat ayt — qisqa, aniq, hozir bajarsa bo'ladigan.` }] }),
      });
      if (!resp.ok || !resp.body) throw new Error();
      const reader = resp.body.getReader(); const dec = new TextDecoder(); let buf=""; let acc="";
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try { const p = JSON.parse(j); const c = p.choices?.[0]?.delta?.content; if (c) { acc += c; setAdvice(acc); } } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch { toast({ title: "AI xatolik", variant: "destructive" }); }
    finally { setLoadingAi(false); }
  }

  const todayMission = realMissions[Math.floor(Date.now() / 86400000) % realMissions.length];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
              <Brain className="w-7 h-7 text-primary" /> {t("decisionEngine")}
            </h1>
            <p className="text-muted-foreground text-sm">Qaror chiqaruvchi tizim · Digital Twin · Truth · Missions</p>
          </div>
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            {(["recovery","normal","beast"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium ${mode===m?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
                {m === "beast" ? "🔥 "+t("beastMode") : m === "recovery" ? "🌿 "+t("recoveryMode") : t("normalMode")}
              </button>
            ))}
          </div>
        </header>

        {/* What now? */}
        <div className="bg-gradient-to-br from-primary/15 via-card to-card border border-primary/40 rounded-2xl p-5 mb-4"
             style={{ boxShadow: "0 0 30px hsl(var(--primary) / 0.15)" }}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold">{t("whatNow")}</h2>
            </div>
            <button onClick={askWhatNow} disabled={loadingAi}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
              {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {t("askAi")}
            </button>
          </div>
          {advice ? (
            <div className="bg-background/40 rounded-lg p-4 text-sm whitespace-pre-wrap">{advice}</div>
          ) : (
            <p className="text-sm text-muted-foreground">"AI dan so'rang" tugmasini bosing — sizning ma'lumotlaringiz asosida hozir bajarish kerak bo'lgan eng optimal harakatni aytadi.</p>
          )}
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-3">
          <Tile icon={<Trophy className="w-4 h-4" />} title={t("lifeScore")} accent>
            <div className="font-heading text-4xl font-bold text-primary">{lifeScore}</div>
            <div className="text-xs text-muted-foreground mt-1">discipline + streak + xp</div>
          </Tile>

          <Tile icon={<AlertTriangle className="w-4 h-4" />} title="Failure Prediction">
            <div className={`font-heading text-3xl font-bold ${failureRisk > 60 ? "text-destructive" : failureRisk > 30 ? "text-yellow-400" : "text-green-400"}`}>{failureRisk}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {failureRisk > 60 ? "2 kun ichida yiqilishingiz mumkin" : failureRisk > 30 ? "Ehtiyot bo'ling" : "Yo'lda davom eting"}
            </div>
          </Tile>

          <Tile icon={<Activity className="w-4 h-4" />} title="Energy">
            <div className="font-heading text-3xl font-bold">{Math.min(100, 40 + truth.last7 * 8)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Optimal: 9:00–11:00, 17:00–19:00</div>
          </Tile>

          <Tile icon={<Skull className="w-4 h-4" />} title={t("truth")}>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Bugun {truth.completion}% odat bajarildi</li>
              <li>• So'nggi 7 kunda {truth.last7} ta log</li>
              <li>• ~{truth.wasted.toFixed(1)} soat/kun isrof</li>
              <li>• O'rtacha streak: {truth.avgStreak}</li>
            </ul>
          </Tile>

          <Tile icon={<Target className="w-4 h-4" />} title="Real Mission (bugun)">
            <p className="text-sm font-semibold mb-2">{todayMission}</p>
            <button onClick={() => toast({ title: "✓ Bajarildi", description: "+50 XP" })}
              className="text-xs bg-primary/10 text-primary rounded-lg px-3 py-1.5">Bajardim</button>
          </Tile>

          <Tile icon={<Brain className="w-4 h-4" />} title="Digital Twin">
            <p className="text-xs text-muted-foreground mb-2">Hozirgi tezlikda 90 kundan keyin:</p>
            <div className="text-sm">
              <div>XP: ~{(profile?.xp ?? 0) + truth.last7 * 12 * 12}</div>
              <div>Rank: {failureRisk > 50 ? "shu joyda qoladi" : "+1 daraja"}</div>
            </div>
          </Tile>

          <Tile icon={<Layers className="w-4 h-4" />} title="Skill Stack">
            <div className="flex flex-wrap gap-1">
              {["Discipline","Focus","Health","Money","Communication"].map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">{s}</span>
              ))}
            </div>
          </Tile>

          <Tile icon={<FlaskConical className="w-4 h-4" />} title="Cognitive Drill">
            <p className="text-xs text-muted-foreground mb-2">2 daqiqalik xotira mashqi</p>
            <button onClick={() => toast({ title: "Tez orada", description: "Memory drill jamoasi tayyorlamoqda." })}
              className="text-xs bg-primary/10 text-primary rounded-lg px-3 py-1.5">{t("start")}</button>
          </Tile>

          <Tile icon={<Globe2 className="w-4 h-4" />} title="Global Rank">
            <div className="font-heading text-2xl font-bold">Top {Math.max(1, 100 - lifeScore)}%</div>
            <div className="text-xs text-muted-foreground">Dunyo bo'ylab</div>
          </Tile>
        </div>

        {/* Anti-procrastination focus */}
        <div className="mt-4 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="font-heading text-lg font-bold">Anti-Procrastination</h2>
            </div>
            {!focusActive ? (
              <button onClick={() => { setFocusLeft(25*60); setFocusActive(true); }}
                className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm">{t("startSession")}</button>
            ) : (
              <button onClick={() => setFocusActive(false)} className="bg-destructive text-destructive-foreground rounded-lg px-4 py-2 text-sm">Stop</button>
            )}
          </div>
          {focusActive ? (
            <div className="text-center py-6">
              <div className="font-heading text-6xl font-bold text-primary">
                {String(Math.floor(focusLeft/60)).padStart(2,"0")}:{String(focusLeft%60).padStart(2,"0")}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{t("noEscape")} · Telefon yoningizdan olib tashlang.</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">25 daqiqa to'liq fokus. Bilan birga: bildirishnomalar o'chirilgan, faqat 1 vazifa.</p>
          )}
        </div>

        <div className="mt-4 bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
          <Minimize2 className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Minimal Mode</h3>
            <p className="text-xs text-muted-foreground">Faqat bugungi 3 ta eng muhim vazifa. Distraction yo'q.</p>
          </div>
          <button onClick={() => toast({ title: "Minimal mode", description: "Dashboardda 3 ta odat ko'rinadi" })}
            className="text-xs bg-primary/10 text-primary rounded-lg px-3 py-1.5">Yoqish</button>
        </div>
      </main>
    </div>
  );
}

function Tile({ icon, title, children, accent }: { icon: React.ReactNode; title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <motion.div whileHover={{ y: -2 }} className={`bg-card border ${accent ? "border-primary/40" : "border-border"} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {icon} {title}
      </div>
      {children}
    </motion.div>
  );
}