import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { characters, type Character } from "@/data/characters";
import { useI18n } from "@/hooks/useI18n";

type Msg = { role: "user" | "assistant"; content: string };

export default function CharactersPage() {
  const { t } = useI18n();
  const [active, setActive] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || !active || loading) return;
    const userMsg: Msg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/character-mentor`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ characterId: active.id, messages: next }),
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
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "Xatolik yuz berdi. Qayta urinib ko'ring." }]);
    } finally { setLoading(false); }
  }

  if (active) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopBar />
        <div className="border-b border-border bg-card/40">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => { setActive(null); setMessages([]); }} className="p-2 rounded-lg hover:bg-muted"><ArrowLeft className="w-4 h-4" /></button>
            <div className="text-2xl">{active.emoji}</div>
            <div>
              <div className="font-semibold">{active.name}</div>
              <div className="text-xs text-muted-foreground">{active.title} · {active.era}</div>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <div className="text-5xl mb-3">{active.emoji}</div>
              <p className="text-sm">"{active.short}"</p>
              <p className="text-xs mt-2">Savol bering...</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                {m.content || (loading && <Loader2 className="w-4 h-4 animate-spin" />)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-background p-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`${active.name} ${t("talkTo")}...`}
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 disabled:opacity-50">
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
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold">{t("characters")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("chooseCharacter")} — AI shu shaxs sifatida javob beradi.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {characters.map(c => (
            <motion.button key={c.id} whileHover={{ y: -3 }} onClick={() => setActive(c)}
              className="text-left bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <div className="text-4xl mb-3">{c.emoji}</div>
              <div className="font-heading text-lg font-bold">{c.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{c.title} · {c.era}</div>
              <p className="text-xs text-muted-foreground italic">"{c.short}"</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}