import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { questions, calculateResults, type TestResult } from "@/data/onboardingQuestions";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Zap, Brain, Dumbbell, Shield, Trophy, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'choice' | 'test' | 'result'>('choice');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [profileData, setProfileData] = useState<{ age?: number; height?: number; weight?: number; sex?: 'm'|'f'; badHabits: string[] }>({ badHabits: [] });
  const [numInput, setNumInput] = useState("");
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [questions[current].id]: score };
    setAnswers(newAnswers);
    advance(newAnswers, profileData);
  };

  const advance = (newAnswers: Record<number, number>, pd: typeof profileData) => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setNumInput("");
      setMultiSel([]);
    } else {
      const res = calculateResults(newAnswers, { ...pd });
      setResult(res);
      setMode('result');
    }
  };

  const handleNumberSubmit = () => {
    const v = Number(numInput);
    if (!v || v <= 0) return;
    const q = questions[current];
    const next = { ...profileData };
    if (q.id === 16) next.age = v;
    if (q.id === 17) next.height = v;
    if (q.id === 18) next.weight = v;
    setProfileData(next);
    advance(answers, next);
  };

  const handleSexPick = (val: string) => {
    const next = { ...profileData, sex: val as 'm'|'f' };
    setProfileData(next);
    advance(answers, next);
  };

  const handleMultiSubmit = () => {
    const next = { ...profileData, badHabits: multiSel };
    setProfileData(next);
    advance(answers, next);
  };

  const toggleMulti = (v: string) => {
    setMultiSel(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const handleQuickStart = () => {
    localStorage.setItem('ascend_profile', JSON.stringify({
      disciplineScore: 50, focusScore: 50, fitnessScore: 50,
      addictionLevel: 'mid', energyLevel: 'mid', rank: 'Beginner', overallScore: 50,
    }));
    navigate('/dashboard');
  };

  const handleFinish = async () => {
    if (result) localStorage.setItem('ascend_profile', JSON.stringify(result));
    if (user && result?.recommendedHabits?.length) {
      setSaving(true);
      // Clear existing default seed habits and insert personalized ones
      const habitsToInsert = result.recommendedHabits.map(h => ({
        user_id: user.id, name: h.name, difficulty: h.difficulty, xp_reward: h.xp_reward,
      }));
      await supabase.from("habits").insert(habitsToInsert);
      // Save profile data
      if (result.weightKg || result.heightCm) {
        await supabase.from("health_logs").insert({
          user_id: user.id, weight_kg: result.weightKg, notes: `Sex: ${result.sex}, Age: ${result.age}, BMI: ${result.bmi}`,
        });
      }
      setSaving(false);
    }
    navigate('/dashboard');
  };

  const rankColors: Record<string, string> = {
    Beginner: 'text-muted-foreground',
    Disciplined: 'text-primary',
    Elite: 'text-warning',
    Apex: 'text-success',
  };

  if (mode === 'choice') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg space-y-6">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold">Boshlashdan oldin</h1>
            <p className="text-muted-foreground mt-2">Qanday boshlashni tanlang</p>
          </div>

          <button onClick={handleQuickStart}
            className="w-full p-6 rounded-xl border border-border bg-card card-hover text-left group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Tez boshlash
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Standart reja bilan darhol boshlang</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>

          <button onClick={() => setMode('test')}
            className="w-full p-6 rounded-xl border border-primary/50 bg-card glow-border card-hover text-left group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" /> 15 ta test
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Shaxsiylashtirilgan reja oling (3-5 daqiqa)</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  if (mode === 'result' && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 glow-border">
            <div className="text-center mb-8">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold">Sizning profilingiz</h2>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Daraja</p>
              <p className={`font-heading text-3xl font-bold ${rankColors[result.rank]}`}>
                {result.rank}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatCard icon={<Shield className="w-5 h-5" />} label="Intizom" value={result.disciplineScore} />
              <StatCard icon={<Brain className="w-5 h-5" />} label="Fokus" value={result.focusScore} />
              <StatCard icon={<Dumbbell className="w-5 h-5" />} label="Fitness" value={result.fitnessScore} />
              <StatCard icon={<Zap className="w-5 h-5" />} label="Umumiy" value={result.overallScore} />
            </div>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Addiction darajasi:</span><span className="font-medium">{result.addictionLevel === 'low' ? 'Past' : result.addictionLevel === 'mid' ? "O'rta" : 'Yuqori'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Energiya:</span><span className="font-medium">{result.energyLevel === 'low' ? 'Past' : result.energyLevel === 'mid' ? "O'rta" : 'Yuqori'}</span></div>
              {result.bmi && (
                <div className="flex justify-between"><span className="text-muted-foreground">BMI:</span><span className="font-medium">{result.bmi} ({result.bmiCategory})</span></div>
              )}
            </div>

            {result.recommendedHabits && result.recommendedHabits.length > 0 && (
              <div className="mb-6">
                <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Sizga moslashtirilgan vazifalar
                </h3>
                <div className="space-y-2">
                  {result.recommendedHabits.map((h, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-background/50 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{h.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{h.reason}</p>
                      </div>
                      <span className="text-xs text-xp shrink-0">+{h.xp_reward}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleFinish} disabled={saving}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold glow-box hover:brightness-110 transition-all flex items-center justify-center gap-2">
              {saving ? "Saqlanmoqda..." : <>Dashboardga o'tish <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{current + 1} / {questions.length}</span>
            <span>{q.category}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <h2 className="font-heading text-xl font-bold mb-6">{q.text}</h2>
            {q.type === 'number' ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="number" value={numInput} onChange={e => setNumInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleNumberSubmit()}
                    autoFocus placeholder="..." className="flex-1 px-4 py-4 rounded-xl border border-border bg-card text-lg outline-none focus:border-primary" />
                  <span className="self-center text-muted-foreground">{q.unit}</span>
                </div>
                <button onClick={handleNumberSubmit} disabled={!numInput}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">
                  Davom etish
                </button>
              </div>
            ) : q.type === 'sex' ? (
              <div className="grid grid-cols-2 gap-3">
                {q.options!.map((opt, i) => (
                  <button key={i} onClick={() => handleSexPick(opt.value!)}
                    className="p-6 rounded-xl border border-border bg-card text-center card-hover hover:border-primary/50 transition-all text-lg">
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : q.type === 'multi' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {q.options!.map((opt, i) => {
                    const sel = multiSel.includes(opt.value!);
                    return (
                      <button key={i} onClick={() => toggleMulti(opt.value!)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${sel ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"}`}>
                        <span className="text-sm">{opt.label}</span>
                        {sel && <span className="text-primary">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleMultiSubmit}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold">
                  {multiSel.length === 0 ? "O'tkazib yuborish" : `Davom etish (${multiSel.length})`}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {q.options!.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt.score)}
                    className="w-full p-4 rounded-xl border border-border bg-card text-left card-hover hover:border-primary/50 transition-all">
                    <span className="text-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const color = value >= 70 ? 'text-success' : value >= 40 ? 'text-warning' : 'text-destructive';
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
      <div className="flex justify-center text-primary mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-heading text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
