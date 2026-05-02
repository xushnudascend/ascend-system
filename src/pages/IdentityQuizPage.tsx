import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { toast } from "sonner";
import { ClipboardList, Loader2, ChevronRight, ChevronLeft, Sparkles, Calendar, Target, AlertTriangle, ListChecks } from "lucide-react";

type Dim = "discipline" | "focus" | "social" | "fitness" | "money" | "dopamine" | "purpose" | "emotion";

interface Q { dim: Dim; q: string }

const QUESTIONS: Q[] = [
  { dim: "discipline", q: "Kunda ertalab rejani aniq bajaraman" },
  { dim: "discipline", q: "Berilgan so'zimda turaman, og'ir bo'lsa ham" },
  { dim: "focus",      q: "Bir vazifaga 60+ daqiqa to'liq fokus qila olaman" },
  { dim: "focus",      q: "Telefon meni chalg'itmaydi, men uni boshqaraman" },
  { dim: "social",     q: "Notanish odam bilan suhbat boshlay olaman" },
  { dim: "social",     q: "Boshqalarga 'yo'q' deya olaman, hissiyotsiz" },
  { dim: "fitness",    q: "Haftada 3+ marta jismoniy mashq qilaman" },
  { dim: "fitness",    q: "Energiyam baland, kun davomida charchamayman" },
  { dim: "money",      q: "Daromadim va xarajatim har oy aniq" },
  { dim: "money",      q: "Oyiga jamg'arma yoki investitsiya qilaman" },
  { dim: "dopamine",   q: "Ijtimoiy tarmoqlarsiz 24 soat tura olaman" },
  { dim: "dopamine",   q: "Tezkor zavqdan ko'ra uzoq mukofotni tanlayman" },
  { dim: "purpose",    q: "Hayotimning aniq maqsadi va yo'nalishi bor" },
  { dim: "emotion",    q: "G'azab va stressni ongli boshqara olaman" },
  { dim: "emotion",    q: "Muvaffaqiyatsizlikni o'sish sifatida qabul qilaman" },
];

const DIMS: Dim[] = ["discipline", "focus", "social", "fitness", "money", "dopamine", "purpose", "emotion"];

export default function IdentityQuizPage() {
  const { user } = useAuth();
  const { lang } = useI18n();
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1, then result
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [profileType, setProfileType] = useState("");

  const current = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progress = Math.round((Object.keys(answers).length / total) * 100);

  function setAns(v: number) {
    setAnswers(a => ({ ...a, [step]: v }));
    if (step < total - 1) setTimeout(() => setStep(s => s + 1), 150);
  }

  function computeScores() {
    const buckets: Record<string, { sum: number; n: number }> = {};
    QUESTIONS.forEach((q, i) => {
      buckets[q.dim] = buckets[q.dim] || { sum: 0, n: 0 };
      buckets[q.dim].sum += (answers[i] || 0) * 20;
      buckets[q.dim].n += 1;
    });
    const out: Record<string, number> = {};
    DIMS.forEach(d => { out[d] = buckets[d] ? Math.round(buckets[d].sum / buckets[d].n) : 0; });
    const avg = Object.values(out).reduce((a, b) => a + b, 0) / DIMS.length;
    const type = avg >= 80 ? "Apex" : avg >= 60 ? "Disciplined" : avg >= 40 ? "Builder" : "Beginner";
    return { out, avg, type };
  }

  async function submit() {
    if (Object.keys(answers).length < total) {
      toast.error("Hamma savollarga javob bering");
      return;
    }
    setGenerating(true);
    try {
      const { out, type } = computeScores();
      setScores(out); setProfileType(type);

      const sortedDims = Object.entries(out).sort(([, a], [, b]) => b - a);
      const strengths = sortedDims.slice(0, 2).map(([k]) => k).join(", ");
      const weaknesses = sortedDims.slice(-2).map(([k]) => k).join(", ");

      // Save baseline assessment
      if (user) {
        await supabase.from("assessments").insert({
          user_id: user.id,
          discipline_score: out.discipline,
          focus_score: out.focus,
          social_score: out.social,
          fitness_score: out.fitness,
          money_score: out.money,
          dopamine_score: out.dopamine,
          profile_type: type,
          strengths,
          weaknesses,
          roadmap: "AI plan generated",
        });
      }

      // Call edge function for AI personalized plan
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-plan`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          answers: QUESTIONS.map((q, i) => ({ q: q.q, dim: q.dim, score: answers[i] })),
          scores: out,
          profile_type: type,
          language: lang,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        if (resp.status === 429) toast.error("Juda ko'p so'rov. Birozdan keyin urinib ko'ring.");
        else if (resp.status === 402) toast.error("AI kreditlari tugagan.");
        else toast.error(data?.error || "Reja yaratib bo'lmadi");
        setGenerating(false); return;
      }

      // Persist personalized plan
      if (user) {
        await supabase.from("personalized_plans").insert({
          user_id: user.id,
          profile_type: type,
          scores: out,
          strengths,
          weaknesses,
          summary: data.summary,
          warnings: data.warnings,
          daily_routine: data.daily_routine || [],
          weekly_plan: data.weekly_plan || [],
          thirty_day_roadmap: data.thirty_day_roadmap || [],
          recommended_habits: data.recommended_habits || [],
        });
      }
      setPlan(data);
      toast.success("100% shaxsiylashtirilgan reja tayyor");
    } catch (e: any) {
      toast.error(e.message || "Xatolik");
    } finally {
      setGenerating(false);
    }
  }

  function reset() {
    setStep(0); setAnswers({}); setPlan(null); setScores({}); setProfileType("");
  }

  // ===== RESULT VIEW =====
  if (plan) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <main className="container max-w-3xl mx-auto px-4 py-6 space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-wider"><Sparkles className="w-4 h-4" /> 100% personalized</div>
            <h1 className="text-3xl font-heading font-bold mt-1">Profil: <span className="text-primary">{profileType}</span></h1>
            <p className="text-sm text-muted-foreground mt-2">{plan.summary}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {DIMS.map(d => (
                <div key={d} className="p-2 rounded-lg bg-muted/30 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">{d}</div>
                  <div className="text-xl font-bold">{scores[d]}</div>
                </div>
              ))}
            </div>
          </Card>

          {plan.warnings && (
            <Card className="p-4 border-amber-500/40 bg-amber-500/5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs uppercase font-bold text-amber-400">Eng katta tahdid</div>
                  <p className="text-sm mt-1">{plan.warnings}</p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><Calendar className="w-5 h-5 text-primary" /><h2 className="font-heading font-bold">Kunlik rejim</h2></div>
            <div className="space-y-2">
              {(plan.daily_routine || []).map((b: any, i: number) => (
                <div key={i} className="flex gap-3 text-sm border-l-2 border-primary/40 pl-3">
                  <div className="font-mono text-primary shrink-0 w-20">{b.time}</div>
                  <div>
                    <div className="font-semibold">{b.block}</div>
                    <div className="text-xs text-muted-foreground">{b.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><ListChecks className="w-5 h-5 text-primary" /><h2 className="font-heading font-bold">Sizga kerakli odatlar</h2></div>
            <div className="space-y-2">
              {(plan.recommended_habits || []).map((h: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm">{h.name}</div>
                    <div className="text-[11px] text-primary uppercase">{h.frequency}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{h.reason}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3"><Target className="w-5 h-5 text-primary" /><h2 className="font-heading font-bold">30 kunlik yo'l xaritasi</h2></div>
            <div className="space-y-2">
              {(plan.thirty_day_roadmap || []).map((w: any, i: number) => (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="text-xs uppercase text-primary font-bold">{w.week}</div>
                  <div className="text-sm font-semibold mt-1">{w.goal}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">→ {w.milestone}</div>
                </div>
              ))}
            </div>
          </Card>

          {(plan.weekly_plan || []).length > 0 && (
            <Card className="p-5">
              <h2 className="font-heading font-bold mb-3">Haftalik fokus</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.weekly_plan.map((d: any, i: number) => (
                  <div key={i} className="p-2 rounded-lg bg-muted/30 text-sm">
                    <span className="font-semibold">{d.day}:</span> <span className="text-muted-foreground">{d.focus}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button className="w-full" variant="outline" onClick={reset}>Qayta boshlash</Button>
        </main>
      </div>
    );
  }

  // ===== QUIZ VIEW =====
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Identity Quiz</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-4">15 ta savol. Tugatganingizdan keyin AI 100% shaxsiylashtirilgan reja yaratadi.</p>

        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-6">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="p-6">
              <div className="text-xs text-muted-foreground uppercase">Savol {step + 1} / {total}</div>
              <p className="text-lg font-semibold mt-2 mb-5">{current.q}</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setAns(v)}
                    className={`py-3 rounded-lg text-base font-bold border transition-all ${answers[step] === v ? "bg-primary text-primary-foreground border-primary scale-105" : "border-border hover:bg-muted"}`}>
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
                <span>To'g'ri emas</span><span>Mutlaqo</span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Oldingi
          </Button>
          {step < total - 1 ? (
            <Button onClick={() => setStep(s => Math.min(total - 1, s + 1))} disabled={!answers[step]}>
              Keyingi <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={submit} disabled={generating || Object.keys(answers).length < total}>
              {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Reja yaratilmoqda...</> : <>Reja olish <Sparkles className="w-4 h-4 ml-1" /></>}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}