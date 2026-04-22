import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Target, Timer, Trophy, RotateCw } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";

type Drill = "memory" | "focus" | "logic" | "reaction";

const drills: { id: Drill; title: string; desc: string; icon: any; color: string }[] = [
  { id: "memory", title: "Xotira", desc: "Ketma-ketlikni eslab qoling", icon: Brain, color: "from-violet-500 to-purple-600" },
  { id: "focus", title: "Fokus", desc: "Faqat to'g'ri belgini bosing", icon: Target, color: "from-cyan-500 to-blue-600" },
  { id: "logic", title: "Mantiq", desc: "Keyingi sonni toping", icon: Zap, color: "from-amber-500 to-orange-600" },
  { id: "reaction", title: "Reaksiya", desc: "Yashil yonganda bosing", icon: Timer, color: "from-emerald-500 to-green-600" },
];

export default function CognitiveDrillsPage() {
  const [active, setActive] = useState<Drill | null>(null);
  const bestKey = (d: Drill) => `drill_best_${d}`;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" /> Cognitive Drills
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Miyani har kuni mashq qildiring — xotira, fokus, mantiq, reaksiya.</p>
        </header>

        {!active ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {drills.map(d => {
              const best = localStorage.getItem(bestKey(d.id));
              return (
                <motion.button key={d.id} whileHover={{ y: -3 }} onClick={() => setActive(d.id)}
                  className="text-left bg-card border border-border rounded-xl p-4 group">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-3`}>
                    <d.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{d.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{d.desc}</p>
                  {best && <div className="text-xs text-primary flex items-center gap-1"><Trophy className="w-3 h-3" /> Rekord: {best}</div>}
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div>
            <button onClick={() => setActive(null)} className="text-xs text-muted-foreground mb-3 hover:text-foreground flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Boshqa o'yin
            </button>
            {active === "memory" && <MemoryGame onScore={s => saveBest("memory", s)} />}
            {active === "focus" && <FocusGame onScore={s => saveBest("focus", s)} />}
            {active === "logic" && <LogicGame onScore={s => saveBest("logic", s)} />}
            {active === "reaction" && <ReactionGame onScore={s => saveBest("reaction", s)} />}
          </div>
        )}
      </main>
    </div>
  );
}

function saveBest(d: Drill, score: number) {
  const k = `drill_best_${d}`;
  const cur = Number(localStorage.getItem(k) || 0);
  if (score > cur) localStorage.setItem(k, String(score));
}

/* ---------- Memory: Simon-says ---------- */
function MemoryGame({ onScore }: { onScore: (n: number) => void }) {
  const [seq, setSeq] = useState<number[]>([]);
  const [user, setUser] = useState<number[]>([]);
  const [showing, setShowing] = useState(-1);
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "over">("idle");

  function start() { const n = [Math.floor(Math.random() * 4)]; setSeq(n); setUser([]); play(n); }
  function play(arr: number[]) {
    setPhase("show"); let i = 0;
    const iv = setInterval(() => {
      setShowing(arr[i]); setTimeout(() => setShowing(-1), 350);
      i++; if (i >= arr.length) { clearInterval(iv); setTimeout(() => setPhase("input"), 400); }
    }, 700);
  }
  function tap(n: number) {
    if (phase !== "input") return;
    const nu = [...user, n]; setUser(nu);
    if (seq[nu.length - 1] !== n) { onScore(seq.length - 1); setPhase("over"); return; }
    if (nu.length === seq.length) {
      const next = [...seq, Math.floor(Math.random() * 4)];
      setSeq(next); setUser([]); setTimeout(() => play(next), 600);
    }
  }

  const colors = ["bg-rose-500", "bg-cyan-500", "bg-amber-500", "bg-emerald-500"];
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <h2 className="font-heading text-xl mb-1">Xotira — daraja {seq.length}</h2>
      <p className="text-xs text-muted-foreground mb-4">Ketma-ketlikni takrorlang</p>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-4">
        {[0, 1, 2, 3].map(i => (
          <button key={i} onClick={() => tap(i)} disabled={phase !== "input"}
            className={`aspect-square rounded-xl ${colors[i]} transition-opacity ${showing === i ? "opacity-100" : "opacity-40"} ${phase === "input" ? "hover:opacity-80" : ""}`} />
        ))}
      </div>
      {phase === "idle" && <button onClick={start} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Boshlash</button>}
      {phase === "over" && <div><p className="text-sm text-muted-foreground mb-2">O'yin tugadi · ball: {seq.length - 1}</p>
        <button onClick={start} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Qayta</button></div>}
    </div>
  );
}

/* ---------- Focus: tap correct color ---------- */
function FocusGame({ onScore }: { onScore: (n: number) => void }) {
  const [target, setTarget] = useState("cyan");
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const colors = ["cyan", "rose", "amber", "emerald", "violet"];

  function gen() {
    const t = colors[Math.floor(Math.random() * colors.length)];
    setTarget(t);
    const g = Array.from({ length: 9 }, () => colors[Math.floor(Math.random() * colors.length)]);
    if (!g.includes(t)) g[Math.floor(Math.random() * 9)] = t;
    setGrid(g);
  }
  useEffect(() => {
    if (!running) return;
    if (time <= 0) { setRunning(false); onScore(score); return; }
    const id = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [time, running]);

  function start() { setScore(0); setTime(30); setRunning(true); gen(); }
  function tap(c: string) { if (!running) return; if (c === target) { setScore(s => s + 1); gen(); } else setScore(s => Math.max(0, s - 1)); }

  const cmap: Record<string, string> = { cyan: "bg-cyan-500", rose: "bg-rose-500", amber: "bg-amber-500", emerald: "bg-emerald-500", violet: "bg-violet-500" };
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <div className="flex justify-between text-sm mb-3"><span>Vaqt: {time}s</span><span>Ball: {score}</span></div>
      {running ? (
        <>
          <p className="mb-3 text-sm">Bosing: <span className={`px-2 py-0.5 rounded ${cmap[target]} text-white`}>{target}</span></p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {grid.map((c, i) => <button key={i} onClick={() => tap(c)} className={`aspect-square rounded-lg ${cmap[c]} hover:opacity-80`} />)}
          </div>
        </>
      ) : (
        <button onClick={start} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">{score > 0 ? `Qayta (oldingi: ${score})` : "Boshlash"}</button>
      )}
    </div>
  );
}

/* ---------- Logic: next number ---------- */
function LogicGame({ onScore }: { onScore: (n: number) => void }) {
  const [q, setQ] = useState<{ seq: number[]; ans: number; opts: number[] } | null>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  function next() {
    const start = Math.floor(Math.random() * 9) + 1;
    const step = Math.floor(Math.random() * 5) + 2;
    const type = Math.floor(Math.random() * 3);
    let seq: number[], ans: number;
    if (type === 0) { seq = [start, start + step, start + 2 * step, start + 3 * step]; ans = start + 4 * step; }
    else if (type === 1) { seq = [start, start * 2, start * 4, start * 8]; ans = start * 16; }
    else { seq = [start, start + 1, start + 3, start + 6]; ans = start + 10; }
    const opts = [ans, ans + step, ans - step, ans + 1].sort(() => Math.random() - 0.5);
    setQ({ seq, ans, opts });
  }
  useEffect(() => { next(); }, []);
  function pick(n: number) { if (!q) return; if (n === q.ans) { setScore(s => s + 1); next(); } else { onScore(score); setOver(true); } }

  if (!q) return null;
  if (over) return <div className="bg-card border border-border rounded-xl p-6 text-center">
    <p className="mb-3">Tugadi · ball: {score}</p>
    <button onClick={() => { setScore(0); setOver(false); next(); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">Qayta</button>
  </div>;
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <div className="text-sm mb-2">Ball: {score}</div>
      <div className="font-heading text-2xl mb-4">{q.seq.join(" → ")} → ?</div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {q.opts.map(o => <button key={o} onClick={() => pick(o)} className="px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary">{o}</button>)}
      </div>
    </div>
  );
}

/* ---------- Reaction ---------- */
function ReactionGame({ onScore }: { onScore: (n: number) => void }) {
  const [state, setState] = useState<"idle" | "wait" | "go" | "done" | "early">("idle");
  const [ms, setMs] = useState(0);
  const startRef = useRef(0);
  const tRef = useRef<any>(null);

  function begin() {
    setState("wait");
    tRef.current = setTimeout(() => { startRef.current = performance.now(); setState("go"); }, 1000 + Math.random() * 3000);
  }
  function click() {
    if (state === "wait") { clearTimeout(tRef.current); setState("early"); return; }
    if (state === "go") { const t = Math.round(performance.now() - startRef.current); setMs(t); setState("done"); onScore(Math.max(0, 1000 - t)); }
  }
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <button onClick={state === "idle" || state === "done" || state === "early" ? begin : click}
        className={`w-full aspect-video rounded-xl text-white font-semibold transition-colors ${state === "go" ? "bg-emerald-500" : state === "wait" ? "bg-amber-600" : state === "early" ? "bg-rose-600" : "bg-muted text-foreground"}`}>
        {state === "idle" && "Boshlash uchun bosing"}
        {state === "wait" && "Kuting... yashil yonsa bosing"}
        {state === "go" && "BOSING!"}
        {state === "done" && `${ms} ms — qayta urinish`}
        {state === "early" && "Erta bosdingiz! Qayta"}
      </button>
    </div>
  );
}