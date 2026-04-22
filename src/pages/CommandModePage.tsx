import { useEffect, useState } from "react";
import { Power, Lock, CheckCircle2, Circle, Zap } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { motion } from "framer-motion";

interface Task { id: string; title: string; done: boolean; time: string; }

const presets: Record<string, Task[]> = {
  beast: [
    { id: "1", title: "5:00 — Turish, sovuq dush", done: false, time: "05:00" },
    { id: "2", title: "5:30 — 30 daqiqa kardio", done: false, time: "05:30" },
    { id: "3", title: "6:30 — 1 soat o'qish", done: false, time: "06:30" },
    { id: "4", title: "8:00 — Eng qiyin vazifa (deep work)", done: false, time: "08:00" },
    { id: "5", title: "13:00 — 30 min kuch trening", done: false, time: "13:00" },
    { id: "6", title: "20:00 — Kun yakuniy reflection", done: false, time: "20:00" },
    { id: "7", title: "22:00 — Telefon o'chirildi, uyqu", done: false, time: "22:00" },
  ],
  normal: [
    { id: "1", title: "6:30 — Turish", done: false, time: "06:30" },
    { id: "2", title: "7:00 — 20 daqiqa harakat", done: false, time: "07:00" },
    { id: "3", title: "9:00 — 90 min deep work", done: false, time: "09:00" },
    { id: "4", title: "13:00 — 30 min o'qish", done: false, time: "13:00" },
    { id: "5", title: "21:00 — Reflection & uyqu hozirligi", done: false, time: "21:00" },
  ],
  recovery: [
    { id: "1", title: "8:00 — Sekin turing, suv iching", done: false, time: "08:00" },
    { id: "2", title: "9:00 — 15 daqiqa yurish", done: false, time: "09:00" },
    { id: "3", title: "12:00 — Yengil ovqat, journal", done: false, time: "12:00" },
    { id: "4", title: "18:00 — Meditatsiya 10 daqiqa", done: false, time: "18:00" },
    { id: "5", title: "22:00 — Erta uyqu", done: false, time: "22:00" },
  ],
};

export default function CommandModePage() {
  const [auto, setAuto] = useState(false);
  const [mode, setMode] = useState<"beast" | "normal" | "recovery">("normal");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`cmd_${mode}_${new Date().toDateString()}`);
    setTasks(saved ? JSON.parse(saved) : presets[mode]);
  }, [mode]);

  function toggle(id: string) {
    const idx = tasks.findIndex(t => t.id === id);
    // Lock mode: can only complete in order
    if (auto && idx > 0 && !tasks[idx - 1].done) return;
    const nu = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(nu);
    localStorage.setItem(`cmd_${mode}_${new Date().toDateString()}`, JSON.stringify(nu));
  }

  const done = tasks.filter(t => t.done).length;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Power className="w-7 h-7 text-primary" /> Command Mode
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Auto rejim — sistema reja tuzadi, siz bajarasiz.</p>
        </header>

        <div className="bg-card border border-border rounded-xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Auto Mode</div>
            <div className="text-xs text-muted-foreground">Yoqilgan paytda vazifalar ketma-ket bajarilishi shart</div>
          </div>
          <button onClick={() => setAuto(a => !a)}
            className={`relative w-14 h-7 rounded-full transition-colors ${auto ? "bg-primary" : "bg-muted"}`}>
            <motion.div className="absolute top-1 w-5 h-5 rounded-full bg-white" animate={{ left: auto ? 32 : 4 }} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {(["beast", "normal", "recovery"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm capitalize ${mode === m ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
              {m === "beast" ? "🔥 Beast" : m === "normal" ? "⚖️ Normal" : "🌿 Recovery"}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-2 mb-3">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${(done / tasks.length) * 100}%` }} />
          </div>
          <div className="text-xs text-muted-foreground text-center mt-1">{done} / {tasks.length} bajarildi</div>
        </div>

        <div className="space-y-2">
          {tasks.map((t, i) => {
            const locked = auto && i > 0 && !tasks[i - 1].done;
            return (
              <button key={t.id} onClick={() => toggle(t.id)} disabled={locked}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${t.done ? "bg-primary/5 border-primary/30 opacity-60" : "bg-card border-border"} ${locked ? "opacity-40" : "hover:border-primary/50"}`}>
                {t.done ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : locked ? <Lock className="w-5 h-5 text-muted-foreground shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                <div className="flex-1">
                  <div className={`text-sm ${t.done ? "line-through" : ""}`}>{t.title}</div>
                </div>
                <span className="text-xs text-muted-foreground">{t.time}</span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}