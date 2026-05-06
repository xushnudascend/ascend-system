import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Apple, Camera, Loader2, Sparkles } from "lucide-react";

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
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanNote, setScanNote] = useState("");

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

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) return toast.error("Rasm 6MB dan kichik bo'lsin");
    setScanning(true); setScanResult(null);
    try {
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { image: dataUrl, note: scanNote },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setScanResult(data);
      toast.success("Rasm tahlil qilindi");
    } catch (err: any) {
      toast.error(err.message || "Tahlilda xato");
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  }

  function applyScan() {
    if (!scanResult) return;
    setCalories(Math.round(scanResult.calories || 0));
    setProtein(Math.round(scanResult.protein_g || 0));
    toast.success("Forma to'ldirildi");
  }

  async function logScan() {
    if (!user || !scanResult) return;
    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id, goal,
      calories: Math.round(scanResult.calories || 0),
      protein_g: Math.round(scanResult.protein_g || 0),
      carbs_g: Math.round(scanResult.carbs_g || 0),
      fat_g: Math.round(scanResult.fat_g || 0),
      notes: (scanResult.items || []).map((i: any) => `${i.name} ~${i.grams}g`).join(", "),
    });
    if (error) toast.error(error.message);
    else { toast.success("Log qilindi"); setScanResult(null); load(); }
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

        <Card className="p-5 mb-4 border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="text-sm font-semibold">AI: Rasm orqali makro hisoblash</div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Ovqat rasmini yuklang — AI kaloriya, protein, carb va yog'ni baholaydi.</p>
          <Input placeholder="Qo'shimcha izoh (ixtiyoriy, mas: katta porsiya)" value={scanNote} onChange={e=>setScanNote(e.target.value)} className="mb-2" />
          <label className="block">
            <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
            <div className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-dashed ${scanning ? 'border-primary bg-primary/5' : 'border-border hover:border-primary cursor-pointer'}`}>
              {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Tahlil qilinmoqda…</> : <><Camera className="w-4 h-4" /> Rasm tanlash / Kamera</>}
            </div>
          </label>
          {scanResult && !scanResult.error && (
            <div className="mt-3 space-y-2 text-sm">
              <div className="grid grid-cols-4 gap-2 text-center">
                <Box label="Kkal" v={Math.round(scanResult.calories||0)} />
                <Box label="Protein" v={`${Math.round(scanResult.protein_g||0)}g`} />
                <Box label="Carb" v={`${Math.round(scanResult.carbs_g||0)}g`} />
                <Box label="Fat" v={`${Math.round(scanResult.fat_g||0)}g`} />
              </div>
              {scanResult.items?.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {scanResult.items.map((i:any,idx:number) => <span key={idx}>{i.name} ~{i.grams}g{idx<scanResult.items.length-1?', ':''}</span>)}
                </div>
              )}
              <div className="text-[10px] text-muted-foreground">Ishonch: {scanResult.confidence || '—'}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={applyScan}>Formaga qo'yish</Button>
                <Button size="sm" className="flex-1" onClick={logScan}>To'g'ridan-to'g'ri log</Button>
              </div>
            </div>
          )}
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

function Box({ label, v }: { label: string; v: any }) {
  return (
    <div className="bg-background border border-border rounded-lg p-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-bold text-sm">{v}</div>
    </div>
  );
}