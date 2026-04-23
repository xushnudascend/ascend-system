import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Loader2, Search } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { characters as baseChars, characterCategories, type Character } from "@/data/characters";
import { charactersExtra } from "@/data/charactersExtra";
import { useI18n } from "@/hooks/useI18n";

type Msg = { role: "user" | "assistant"; content: string };

const characters: Character[] = [...baseChars, ...charactersExtra];

export default function CharactersPage() {
  const { t } = useI18n();
  const [active, setActive] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages]);

  const list = characters.filter(c => (cat === "all" || c.category === cat) && (!q || c.name.toLowerCase().includes(q.toLowerCase())));

  async function send() {
    if (!input.trim() || !active || loading) return;
    const userMsg: Msg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-mentor`;
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ characterId: active.id, messages: next, systemPrompt: active.systemPrompt }),
      });
      if (!resp.ok || !resp.body) throw new Error("stream failed");
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "", acc = "";
      setMessages(m => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl); buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") break;
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) { acc += c; setMessages(m => m.map((mm, i) => i === m.length - 1 ? { ...mm, content: acc } : mm)); }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Xatolik yuz berdi." }]);
    } finally { setLoading(false); }
  }

  if (active) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopBar />
        <div className="border-b border-border bg-card/40">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setActive(null); setMessages([]); }} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft className="w-4 h-4" /></button>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl">{active.emoji}</motion.div>
            <div>
              <div className="font-semibold">{active.name}</div>
              <div className="text-xs text-muted-foreground">{active.title} · {active.era}</div>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-12">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-3">{active.emoji}</motion.div>
              <p className="text-sm italic">"{active.short}"</p>
              <p className="text-xs mt-2">Savol bering...</p>
            </motion.div>
          )}
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                {m.content || (loading && <Loader2 className="w-4 h-4 animate-spin" />)}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-border bg-background p-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`${active.name} ga savol...`}
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <button onClick={send} disabled={loading || !input.trim()} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="font-heading text-3xl font-bold">{t("characters")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{characters.length}+ tarixiy va zamonaviy shaxs · AI ular sifatida javob beradi</p>
        </header>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Shaxs qidirish..." className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {characterCategories.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${cat === c.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {list.map((c, i) => (
              <motion.button key={c.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
                whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setActive(c)}
                className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.05 }} className="text-4xl mb-2">{c.emoji}</motion.div>
                <div className="font-heading text-sm font-bold leading-tight">{c.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{c.era}</div>
                <p className="text-[10px] text-muted-foreground italic mt-2 line-clamp-2">"{c.short}"</p>
              </motion.button>
            ))}
          </div>
        </AnimatePresence>
        {list.length === 0 && <div className="text-center text-muted-foreground py-12">Topilmadi.</div>}
      </main>
    </div>
  );
}
