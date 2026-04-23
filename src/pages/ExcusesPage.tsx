import { useEffect, useState } from "react";
import { Activity, Plus, Trash2, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCoachTone } from "@/hooks/useCoachTone";
import { toast } from "sonner";

const COMMON: Record<string, { hard: string; soft: string }> = {
  "vaqtim yo'q": { hard: "Vaqt yo'q emas — prioritet yo'q. 2 daqiqa ham boshlash uchun yetadi.", soft: "Bugun 5 daqiqa ajrating — kichik qadam ham progress." },
  "charchadim": { hard: "Charchaganda ham bajarsang — disciplinasan. Aks holda — odatiy odam.", soft: "Charchagan bo'lsangiz, eng oson 1 qadamni qiling, qolganini ertaga." },
  "kayfiyat yo'q": { hard: "Kayfiyat hech qachon kelmaydi. Avval harakat, keyin kayfiyat.", soft: "Birinchi 5 minutdan keyin kayfiyat o'zgaradi. Sinab ko'ring." },
  "ertaga qilaman": { hard: "Ertaga ham xuddi shuni aytasan. Bu — yolg'on. Hozir 1 qadam.", soft: "Bugun shunchaki boshlang, oxirigacha qilmasangiz ham bo'ladi." },
  "siz tushunmaysiz": { hard: "Hamma sharoit boshqa, lekin disciplina universal. Bahonani to'xtat.", soft: "Tushundim, lekin bitta kichik harakat doim mumkin." },
};

export default function ExcusesPage() {
  const { user } = useAuth();
  const { tone } = useCoachTone();
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState("");

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("excuses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    setItems(data || []);
  }
  useEffect(() => { load(); }, [user]);

  function detect(t: string) {
    const low = t.toLowerCase();
    for (const k of Object.keys(COMMON)) if (low.includes(k)) return { key: k, ...COMMON[k] };
    return null;
  }

  async function add() {
    if (!user || !text.trim()) return;
    const det = detect(text);
    const counter = det ? det[tone] : (tone === "hard" ? "Bahona — bu zaif odamning quroli. Endi 1 qadam qil." : "Tushunaman, lekin bitta kichik harakat har doim mumkin.");
    const { error } = await supabase.from("excuses").insert({ user_id: user.id, excuse_text: text, category: det?.key || "other", counter });
    if (error) return toast.error(error.message);
    setText(""); load();
  }
  async function del(id: string) { await supabase.from("excuses").delete().eq("id", id); load(); }

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Activity className="w-7 h-7 text-rose-400" /> Excuse Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Bahonalaringizni yozing — sistema darhol javob beradi va saqlaydi.</p>
        </header>
        <div className="bg-card border border-border rounded-2xl p-5">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Bahonangizni yozing... (masalan: 'bugun vaqtim yo'q')"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
          <button onClick={add} className="mt-3 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Yozish va counter olish</button>
        </div>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Bahona:</div>
                  <div className="text-sm">{i.excuse_text}</div>
                  <div className="mt-2 pt-2 border-t border-border flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm font-medium text-primary">{i.counter}</div>
                  </div>
                </div>
                <button onClick={() => del(i.id)} className="p-1.5 text-muted-foreground hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}