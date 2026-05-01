import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Apple } from "lucide-react";

const goals = [
  { id: 'cut', title: 'Ozish (cut)', cal: -500, protein: 2.0, tip: '500 kcal kamaytiring. Protein 2 g/kg. Kunda 3 L suv. Steplar 8k+.' },
  { id: 'maintain', title: 'Saqlash', cal: 0, protein: 1.6, tip: 'TDEE darajasida. Protein 1.6 g/kg. Carb va yog\' balans.' },
  { id: 'bulk', title: 'Semirish (bulk)', cal: 300, protein: 1.8, tip: '+300 kcal sekin. Protein 1.8 g/kg. Trening volume oshiring.' },
];

export default function NutritionPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState('maintain');
  const [weight, setWeight] = useState(70);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);

  const tdee = Math.round(weight * 33);
  const target = tdee + (goals.find(g=>g.id===goal)?.cal ?? 0);
  const targetP = Math.round(weight * (goals.find(g=>g.id===goal)?.protein ?? 1.6));

  useEffect(() => { if (user) load(); }, [user]);
  async function load() {
    const { data } = await supabase.from('nutrition_logs').select('*').order('log_date',{ascending:false}).limit(14);
    setLogs(data || []);
  }
  async function save() {
    if (!user) return;
    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id, goal, calories, protein_g: protein, carbs_g: 0, fat_g: 0
    });
    if (error) toast.error(error.message); else { toast.success("Saqlandi"); setCalories(0); setProtein(0); load(); }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Apple className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Nutrition</h1>
        </div>

        <Card className="p-5 mb-4">
          <div className="text-sm font-semibold mb-2">Maqsadingiz</div>
          <div className="grid grid-cols-3 gap-2">
            {goals.map(g => (
              <button key={g.id} onClick={()=>setGoal(g.id)}
                className={`p-3 rounded-lg border text-sm ${goal===g.id?'border-primary bg-primary/10':'border-border'}`}>
                {g.title}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">{goals.find(g=>g.id===goal)?.tip}</p>
        </Card>

        <Card className="p-5 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label className="text-xs">Vazn (kg)<Input type="number" value={weight} onChange={e=>setWeight(+e.target.value)}/></label>
            <div className="text-xs">TDEE / Target<div className="font-bold text-foreground">{tdee} / {target} kcal</div></div>
          </div>
          <div className="text-xs text-muted-foreground">Protein target: <span className="text-foreground font-semibold">{targetP} g</span></div>
        </Card>

        <Card className="p-5 mb-4">
          <div className="text-sm font-semibold mb-3">Bugun yedingiz</div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs">Kaloriya<Input type="number" value={calories} onChange={e=>setCalories(+e.target.value)}/></label>
            <label className="text-xs">Protein (g)<Input type="number" value={protein} onChange={e=>setProtein(+e.target.value)}/></label>
          </div>
          <Button className="mt-3 w-full" onClick={save}>Log qilish</Button>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold mb-3">Oxirgi 14 kun</div>
          {logs.length===0 && <p className="text-sm text-muted-foreground">Hali log yo'q.</p>}
          <div className="space-y-1">
            {logs.map(l => (
              <div key={l.id} className="flex justify-between text-sm py-1 border-b border-border/40 last:border-0">
                <span>{l.log_date}</span>
                <span className="text-muted-foreground">{l.calories} kcal • {l.protein_g}g P</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}