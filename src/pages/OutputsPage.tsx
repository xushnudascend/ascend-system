import { useEffect, useState } from "react";
import { Target, Plus, Trash2, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CATS = ["Code", "Essay", "Video", "Design", "Workout", "Sale", "Lesson", "Other"];

export default function OutputsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState(""); const [cat, setCat] = useState(CATS[0]); const [desc, setDesc] = useState("");

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("outputs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    setItems(data || []);
  }
  useEffect(() => { load(); }, [user]);

  async function add() {
    if (!user || !title.trim()) return;
    const { error } = await supabase.from("outputs").insert({ user_id: user.id, title, category: cat, description: desc || null });
    if (error) return toast.error(error.message);
    setTitle(""); setDesc(""); toast.success("Output qo'shildi"); load();
  }
  async function del(id: string) { await supabase.from("outputs").delete().eq("id", id); load(); }

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = items.filter(i => i.log_date === today).length;

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><Target className="w-7 h-7 text-emerald-400" /> Output Tracking</h1>
          <p className="text-muted-foreground text-sm mt-1">Nima qilding emas — nima <span className="text-emerald-400 font-semibold">chiqarding</span>? Bu real progress.</p>
        </header>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <div><div className="text-sm">Bugun chiqargan natijalar</div><div className="font-heading text-2xl font-bold text-emerald-400">{todayCount}</div></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-3">Yangi output</div>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Sarlavha (masalan: Landing page chiqdi)" className="bg-background border border-border rounded-lg px-3 py-2 text-sm md:col-span-2" />
            <select value={cat} onChange={e => setCat(e.target.value)} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">{CATS.map(c => <option key={c}>{c}</option>)}</select>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tafsilot" className="bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={add} className="mt-3 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Qo'shish</button>
        </div>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold">{i.category}</span>
              <div className="flex-1"><div className="text-sm font-semibold">{i.title}</div>{i.description && <div className="text-xs text-muted-foreground">{i.description}</div>}</div>
              <div className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</div>
              <button onClick={() => del(i.id)} className="p-1.5 text-muted-foreground hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}