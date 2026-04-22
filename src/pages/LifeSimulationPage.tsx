import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function LifeSimulationPage() {
  const { user } = useAuth();
  const [score, setScore] = useState(50);
  const [streak, setStreak] = useState(0);
  const [wastedHours, setWastedHours] = useState(3);

  useEffect(() => { load(); }, [user]);
  async function load() {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("discipline_score, streak").eq("user_id", user.id).maybeSingle();
    if (data) { setScore(data.discipline_score); setStreak(data.streak); }
  }

  // Simple growth/decay model
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const discipline = months.map(m => Math.min(100, score + m * (5 + streak * 0.3)));
  const lazy = months.map(m => Math.max(0, score - m * 4));
  const yearWasted = wastedHours * 365;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" /> Life Simulation
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Hozirgi yo'l vs intizom yo'li — 12 oydan keyin.</p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Path color="emerald" label="Discipline yo'li" data={discipline} icon={TrendingUp}
            outcome={["Discipline 90+", "Energiya barqaror", "Maqsadlar ro'yobga", "Yangi identity", "Hurmat & natija"]} />
          <Path color="rose" label="Dangasalik yo'li" data={lazy} icon={TrendingDown}
            outcome={["Discipline 0 ga yaqin", "Charchoq doimiy", "Maqsadlar yo'qoladi", "Pushaymon o'sadi", "Imkoniyatlar ketadi"]} />
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><Clock className="w-5 h-5 text-primary" /><h2 className="font-heading text-xl">Opportunity Cost Tracker</h2></div>
          <label className="block text-sm mb-2">Kunlik behuda vaqt: <strong>{wastedHours}</strong> soat</label>
          <input type="range" min={0} max={12} value={wastedHours} onChange={e => setWastedHours(Number(e.target.value))} className="w-full accent-primary mb-4" />
          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <Stat label="Yiliga yo'qotgan" value={`${yearWasted} soat`} />
            <Stat label="= ish kuni" value={`${Math.round(yearWasted / 8)} kun`} />
            <Stat label="10 yilda" value={`${Math.round(yearWasted * 10 / 24 / 365 * 10) / 10} yil`} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Path({ color, label, data, icon: Icon, outcome }: any) {
  const max = Math.max(...data, 100);
  const pts = data.map((v: number, i: number) => `${(i / 11) * 100},${100 - (v / max) * 100}`).join(" ");
  const stroke = color === "emerald" ? "stroke-emerald-400" : "stroke-rose-400";
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3"><Icon className={`w-5 h-5 ${color === "emerald" ? "text-emerald-400" : "text-rose-400"}`} /><h2 className="font-heading text-lg">{label}</h2></div>
      <svg viewBox="0 0 100 100" className="w-full h-32 mb-3" preserveAspectRatio="none">
        <polyline points={pts} fill="none" className={stroke} strokeWidth="1.5" />
      </svg>
      <ul className="space-y-1 text-xs text-muted-foreground">
        {outcome.map((o: string) => <li key={o}>• {o}</li>)}
      </ul>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-muted/40 rounded-lg p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="font-heading text-lg text-primary">{value}</div></div>;
}