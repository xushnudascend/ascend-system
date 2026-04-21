import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wind, Heart, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { stoicReflections, breathingExercises, dailyAffirmations } from "@/data/stoicCalm";
import { useI18n } from "@/hooks/useI18n";

export default function CalmPage() {
  const { t } = useI18n();
  const [breathing, setBreathing] = useState<typeof breathingExercises[0] | null>(null);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!breathing) return;
    const totalSteps = breathing.steps.length;
    const interval = setInterval(() => {
      setPhase(p => {
        const next = (p + 1) % totalSteps;
        if (next === 0) setCount(c => c + 1);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [breathing]);

  useEffect(() => {
    if (breathing && count >= breathing.cycles) { setBreathing(null); setPhase(0); setCount(0); }
  }, [count, breathing]);

  const aff = dailyAffirmations[Math.floor(Date.now() / 86400000) % dailyAffirmations.length];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Heart className="w-7 h-7 text-primary" /> {t("calm")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Stress ↓ · Stoik fikr · Nafas mashqi</p>
        </header>

        <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/30 rounded-2xl p-6 mb-6 text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-primary mb-2">{t("affirmation")}</p>
          <p className="font-heading text-xl md:text-2xl font-semibold">"{aff}"</p>
        </div>

        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Wind className="w-4 h-4" /> Nafas mashqlari
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {breathingExercises.map(ex => (
              <button key={ex.id} onClick={() => { setBreathing(ex); setPhase(0); setCount(0); }}
                className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition">
                <div className="font-semibold mb-1">{ex.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{ex.description}</div>
                <div className="text-xs text-primary">{t("start")} →</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Stoik tafakkur</h2>
          <div className="space-y-3">
            {stoicReflections.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {breathing && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button onClick={() => setBreathing(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">{t("close")}</button>
          <p className="text-xs uppercase tracking-widest text-primary mb-4">{breathing.name}</p>
          <motion.div
            key={phase}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: phase % 2 === 0 ? 1.4 : 0.8, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-6"
            style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.4)" }}
          >
            <span className="font-heading text-2xl">{phase + 1}/{breathing.steps.length}</span>
          </motion.div>
          <p className="font-heading text-xl text-center max-w-xs">{breathing.steps[phase]}</p>
          <p className="text-xs text-muted-foreground mt-3">Sikl {count + 1} / {breathing.cycles}</p>
        </div>
      )}
    </div>
  );
}