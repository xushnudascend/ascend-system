import { useEffect, useRef, useState } from "react";
import { Lock, Play, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import RealityCheck from "@/components/RealityCheck";

export default function FocusLockPage() {
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState(25);
  const [state, setState] = useState<"idle" | "countdown" | "running" | "done">("idle");
  const [count, setCount] = useState(5);
  const [left, setLeft] = useState(0);
  const [reality, setReality] = useState<string | null>(null);
  const tRef = useRef<any>(null);

  useEffect(() => {
    if (state === "countdown") {
      if (count <= 0) { setState("running"); setLeft(duration * 60); return; }
      tRef.current = setTimeout(() => setCount(c => c - 1), 1000);
    }
    if (state === "running") {
      if (left <= 0) { setState("done"); return; }
      tRef.current = setTimeout(() => setLeft(l => l - 1), 1000);
      // Random reality check every ~5 min
      if (left % 300 === 0 && left > 0) {
        const checks = ["Hali fokusdamisiz?", "Telefonni qo'l urmadingizmi?", "Vazifaga to'liq berildingizmi?", "1 soatda nima qildingiz?"];
        setReality(checks[Math.floor(Math.random() * checks.length)]);
        setTimeout(() => setReality(null), 4000);
      }
    }
    return () => clearTimeout(tRef.current);
  }, [state, count, left]);

  function start() { if (!task.trim()) return; setCount(5); setState("countdown"); }
  function abort() { if (confirm("Sessiyani to'xtatasizmi? Bu zaiflik belgisi.")) { setState("idle"); setLeft(0); } }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <RealityCheck active={state === "running"} intervalSec={300} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Lock className="w-7 h-7 text-primary" /> Focus Lock
          </h1>
          <p className="text-muted-foreground text-sm mt-1">5-soniya qoidasi · qochish yo'q · reality check.</p>
        </header>

        {state === "idle" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-semibold mb-2">Vazifa</label>
            <input value={task} onChange={e => setTask(e.target.value)} placeholder="Masalan: 1-bobni o'qish"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-primary" />
            <label className="block text-sm font-semibold mb-2">Davomiyligi: {duration} min</label>
            <input type="range" min={5} max={90} step={5} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full accent-primary mb-4" />
            <button onClick={start} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-semibold flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> START NOW (5 sec rule)
            </button>
          </div>
        )}

        {state === "countdown" && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <motion.div key={count} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="font-heading text-8xl text-primary font-bold">{count}</motion.div>
            <p className="text-sm text-muted-foreground mt-4">Tayyor bo'ling...</p>
          </div>
        )}

        {state === "running" && (
          <div className="bg-card border border-border rounded-xl p-8 text-center relative overflow-hidden">
            <div className="text-xs text-muted-foreground mb-2">FOKUS</div>
            <div className="font-heading text-2xl mb-4">{task}</div>
            <div className="font-heading text-7xl font-bold text-primary mb-6 tabular-nums">{mm}:{ss}</div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full bg-primary" style={{ width: `${100 - (left / (duration * 60)) * 100}%` }} />
            </div>
            <button onClick={abort} className="text-xs text-muted-foreground hover:text-rose-400">Sessiyani buzish (zaiflik)</button>
            <AnimatePresence>
              {reality && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute top-3 left-3 right-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {reality}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {state === "done" && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-3" />
            <div className="font-heading text-2xl mb-2">Sessiya tugadi 🎯</div>
            <p className="text-sm text-muted-foreground mb-4">{duration} daqiqa to'liq fokus. Yana bir bor?</p>
            <button onClick={() => setState("idle")} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Yangi sessiya</button>
          </div>
        )}
      </main>
    </div>
  );
}