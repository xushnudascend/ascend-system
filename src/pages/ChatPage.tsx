import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Msg { id: string; user_id: string; content: string; created_at: string; }

export default function ChatPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    load();
    const ch = supabase.channel(`conv-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        (p) => setMsgs(m => [...m, p.new as Msg]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function load() {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", id!).order("created_at");
    setMsgs((data as Msg[]) || []);
  }

  async function send() {
    if (!text.trim() || !user || !id) return;
    const c = text; setText("");
    await supabase.from("messages").insert({ conversation_id: id, user_id: user.id, content: c });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col px-4 py-4">
        <button onClick={() => nav("/buddies")} className="text-xs text-muted-foreground mb-3 flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="w-3 h-3" /> Orqaga
        </button>
        <div className="flex-1 overflow-y-auto space-y-2 mb-3">
          {msgs.map(m => (
            <div key={m.id} className={`flex ${m.user_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.user_id === user?.id ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Xabar yozing..." className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-sm outline-none focus:border-primary" />
          <button onClick={send} className="p-2 rounded-xl bg-primary text-primary-foreground"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}