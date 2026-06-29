import { Component, ReactNode, useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

type Item = { id: number; msg: string };
let push: ((msg: string) => void) | null = null;

function friendly(input: unknown): string {
  const raw =
    (input as any)?.message ||
    (typeof input === "string" ? input : "") ||
    (input as any)?.error?.message ||
    "";
  const s = String(raw);
  if (!s) return "Nimadir noto'g'ri ketdi. Iltimos qayta urinib ko'ring.";
  if (/Failed to fetch|NetworkError|ERR_NETWORK/i.test(s))
    return "Internet aloqasi yo'q yoki server javob bermayapti.";
  if (/401|JWT|not authenticated|Unauthorized/i.test(s))
    return "Sessiya tugagan — qaytadan kiring.";
  if (/403|permission|not authorized|RLS/i.test(s))
    return "Bu amalga ruxsat yo'q.";
  if (/429|rate limit/i.test(s)) return "Juda ko'p so'rov — biroz kuting.";
  if (/402|credit/i.test(s)) return "AI krediti tugagan.";
  if (/5\d\d|Internal Server/i.test(s)) return "Server xatosi — keyinroq urinib ko'ring.";
  // ChunkLoad / dynamic import
  if (/ChunkLoadError|Loading chunk|dynamically imported/i.test(s))
    return "Yangilanish mavjud — sahifani yangilang.";
  return s.length > 160 ? s.slice(0, 157) + "…" : s;
}

function Banner() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    push = (msg) => {
      const id = Date.now() + Math.random();
      setItems((p) => [...p, { id, msg }]);
      setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 6000);
    };
    const onErr = (e: ErrorEvent) => push?.(friendly(e.error || e.message));
    const onRej = (e: PromiseRejectionEvent) => push?.(friendly(e.reason));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
      push = null;
    };
  }, []);
  if (!items.length) return null;
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-[min(92vw,520px)] space-y-2 pointer-events-none">
      {items.map((i) => (
        <div
          key={i.id}
          className="pointer-events-auto flex items-start gap-2 bg-rose-500/10 border border-rose-500/40 text-rose-100 backdrop-blur px-3 py-2 rounded-lg shadow-lg text-sm"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
          <div className="flex-1">{i.msg}</div>
          <button
            onClick={() => setItems((p) => p.filter((x) => x.id !== i.id))}
            className="opacity-60 hover:opacity-100"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

class Boundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { push?.(friendly(err)); console.error(err); }
  render() {
    if (this.state.err) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full bg-card border border-border rounded-2xl p-6 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 mx-auto text-rose-400" />
            <h2 className="font-heading text-xl font-bold">Sahifada xatolik</h2>
            <p className="text-sm text-muted-foreground">{friendly(this.state.err)}</p>
            <div className="flex gap-2 justify-center pt-2">
              <button onClick={() => location.reload()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Yangilash</button>
              <button onClick={() => { this.setState({ err: null }); history.back(); }} className="px-4 py-2 rounded-lg border border-border text-sm">Orqaga</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <Boundary>
      <Banner />
      {children}
    </Boundary>
  );
}