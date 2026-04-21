import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, Target, Cake, MessageCircle } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { useI18n } from "@/hooks/useI18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ageGroups = ["13-17", "18-24", "25-34", "35-44", "45+"];
const goals = ["Sport & Fitnes", "Pul & Biznes", "O'qish & Universitet", "Ruhiy salomatlik", "Intizom & Erta turish", "Ijodkorlik & San'at", "Til o'rganish", "Programming"];
const locations = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Online (boshqa)"];

interface Buddy { user_id: string; display_name: string | null; rank: string; xp: number; streak: number; goals: string | null; country: string | null; }

export default function BuddiesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [age, setAge] = useState("18-24");
  const [goal, setGoal] = useState(goals[0]);
  const [loc, setLoc] = useState(locations[0]);
  const [list, setList] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [goal, loc]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, rank, xp, streak, goals, country")
      .order("xp", { ascending: false })
      .limit(50);
    setList((data || []).filter(p => p.user_id !== user?.id));
    setLoading(false);
  }

  async function sendRequest(addressee_id: string) {
    if (!user) { nav("/auth"); return; }
    const { error } = await supabase.from("friendships").insert({ requester_id: user.id, addressee_id });
    if (error) toast({ title: "Xato", description: error.message, variant: "destructive" });
    else toast({ title: "Yuborildi", description: "Do'stlik so'rovi yuborildi." });
  }

  const filtered = list.filter(b => {
    const goalMatch = !b.goals || b.goals.toLowerCase().includes(goal.toLowerCase().split(" ")[0].toLowerCase()) || true;
    const locMatch = !b.country || b.country === loc || loc === "Online (boshqa)";
    return goalMatch && locMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> {t("buddies")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Yosh, manzil va maqsad bo'yicha o'xshash insonlar.</p>
        </header>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Cake className="w-3 h-3" /> {t("ageGroup")}</div>
            <select value={age} onChange={e => setAge(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              {ageGroups.map(g => <option key={g} value={g} className="bg-card">{g}</option>)}
            </select>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> {t("goal")}</div>
            <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              {goals.map(g => <option key={g} value={g} className="bg-card">{g}</option>)}
            </select>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t("location")}</div>
            <select value={loc} onChange={e => setLoc(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              {locations.map(l => <option key={l} value={l} className="bg-card">{l}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="text-xs text-muted-foreground mb-2">Tanlangan guruh</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{age}</span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{goal}</span>
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{loc}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-8">Yuklanmoqda...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 bg-card border border-border rounded-xl">
            Ushbu guruhda hali odam yo'q. Birinchi bo'ling — boshqalarni taklif qiling.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map(b => (
              <motion.div key={b.user_id} whileHover={{ y: -2 }} className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{b.display_name || "Anonim"}</div>
                    <div className="text-xs text-muted-foreground">{b.rank} · {b.xp} XP · 🔥 {b.streak}</div>
                  </div>
                  <button onClick={() => sendRequest(b.user_id)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> {t("findBuddy")}
                  </button>
                </div>
                {b.goals && <p className="text-xs text-muted-foreground line-clamp-2">{b.goals}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}