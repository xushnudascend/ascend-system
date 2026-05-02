import { useEffect, useState } from "react";
import { Heart, Moon, Zap, Activity, Droplets, Plus, Calculator } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function HealthPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [form, setForm] = useState({ sleep_hours: 7, energy_level: 6, stress_level: 5, mood: "neutral", water_glasses: 4, weight_kg: "", steps: "", notes: "" });
  const [bmi, setBmi] = useState({ height_cm: "175", weight_kg: "70", age: "25", sex: "male" as "male" | "female" });

  async function load() {
    if (!user) return;
    const { data } = await supabase.from("health_logs").select("*").eq("user_id", user.id).order("log_date", { ascending: false }).limit(30);
    setLogs(data || []);
  }
  useEffect(() => { load(); }, [user]);

  async function save() {
    if (!user) return toast.error("Avval kiring");
    const payload: any = { user_id: user.id, sleep_hours: form.sleep_hours, energy_level: form.energy_level, stress_level: form.stress_level, mood: form.mood, water_glasses: form.water_glasses, notes: form.notes || null };
    if (form.weight_kg) payload.weight_kg = Number(form.weight_kg);
    if (form.steps) payload.steps = Number(form.steps);
    const { error } = await supabase.from("health_logs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Bugungi sog'liq saqlandi");
    load();
  }

  const chartData = [...logs].reverse().slice(-14).map(l => ({
    date: new Date(l.log_date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    sleep: l.sleep_hours, energy: l.energy_level, stress: l.stress_level,
  }));
  const last = logs[0];

  // BMI calculation with sex/age and ideal-weight delta
  const h = Number(bmi.height_cm), w = Number(bmi.weight_kg), age = Number(bmi.age);
  const bmiVal = h > 0 && w > 0 ? +(w / Math.pow(h / 100, 2)).toFixed(1) : 0;
  // Devine formula for ideal body weight (with sex), then adjust slightly by age
  const heightInches = h / 2.54;
  const overFive = Math.max(0, heightInches - 60);
  let idealWeight = bmi.sex === "male" ? 50 + 2.3 * overFive : 45.5 + 2.3 * overFive;
  // gentle age adjustment: +0.1 kg per year over 25, capped at +5kg
  if (age > 25) idealWeight += Math.min(5, (age - 25) * 0.1);
  idealWeight = +idealWeight.toFixed(1);
  const delta = w > 0 ? +(w - idealWeight).toFixed(1) : 0;
  let bmiCategory = "—", bmiColor = "text-muted-foreground";
  if (bmiVal > 0) {
    if (bmiVal < 18.5) { bmiCategory = "Kam vazn"; bmiColor = "text-cyan-400"; }
    else if (bmiVal < 25) { bmiCategory = "Normal"; bmiColor = "text-emerald-400"; }
    else if (bmiVal < 30) { bmiCategory = "Ortiqcha vazn"; bmiColor = "text-amber-400"; }
    else { bmiCategory = "Semizlik"; bmiColor = "text-rose-400"; }
  }
  const deltaText = w > 0
    ? delta > 0
      ? `${delta} kg ortiqcha`
      : delta < 0
        ? `${Math.abs(delta)} kg yetishmaydi`
        : "Ideal vaznda"
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><DailyQuoteModal />
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-400" /> Health & Energy
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Uyqu · energiya · stress · suv · vazn · qadamlar</p>
        </header>

        {last && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={<Moon className="w-4 h-4 text-indigo-400" />} label="Uyqu" v={`${last.sleep_hours ?? "-"}h`} />
            <Stat icon={<Zap className="w-4 h-4 text-amber-400" />} label="Energiya" v={`${last.energy_level ?? "-"}/10`} />
            <Stat icon={<Activity className="w-4 h-4 text-rose-400" />} label="Stress" v={`${last.stress_level ?? "-"}/10`} />
            <Stat icon={<Droplets className="w-4 h-4 text-cyan-400" />} label="Suv" v={`${last.water_glasses ?? 0} stak.`} />
          </div>
        )}

        {/* BMI calculator */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" /> BMI kalkulyatori
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Bo'y (sm)" value={bmi.height_cm} onChange={v => setBmi({ ...bmi, height_cm: v })} type="number" />
            <Field label="Vazn (kg)" value={bmi.weight_kg} onChange={v => setBmi({ ...bmi, weight_kg: v })} type="number" />
            <Field label="Yosh" value={bmi.age} onChange={v => setBmi({ ...bmi, age: v })} type="number" />
            <div>
              <label className="text-xs text-muted-foreground">Jins</label>
              <div className="mt-1 grid grid-cols-2 gap-1">
                <button onClick={() => setBmi({ ...bmi, sex: "male" })}
                  className={`py-2 rounded-lg text-xs font-semibold border ${bmi.sex === "male" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Erkak</button>
                <button onClick={() => setBmi({ ...bmi, sex: "female" })}
                  className={`py-2 rounded-lg text-xs font-semibold border ${bmi.sex === "female" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Ayol</button>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <div className="text-xs text-muted-foreground">BMI</div>
              <div className={`font-heading text-3xl font-bold ${bmiColor}`}>{bmiVal || "—"}</div>
              <div className={`text-xs mt-1 ${bmiColor}`}>{bmiCategory}</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <div className="text-xs text-muted-foreground">Ideal vazn</div>
              <div className="font-heading text-3xl font-bold">{idealWeight > 0 ? `${idealWeight} kg` : "—"}</div>
              <div className="text-xs mt-1 text-muted-foreground">Devine formulasi</div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 text-center">
              <div className="text-xs text-muted-foreground">Farq</div>
              <div className={`font-heading text-3xl font-bold ${delta > 0 ? "text-amber-400" : delta < 0 ? "text-cyan-400" : "text-emerald-400"}`}>
                {w > 0 ? `${delta > 0 ? "+" : ""}${delta} kg` : "—"}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">{deltaText}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="font-heading text-lg font-bold mb-4">Bugungi yozuv</div>
          <div className="grid md:grid-cols-2 gap-4">
            <Slider label={`Uyqu: ${form.sleep_hours}h`} min={0} max={12} step={0.5} value={form.sleep_hours} onChange={v => setForm({ ...form, sleep_hours: v })} />
            <Slider label={`Energiya: ${form.energy_level}/10`} min={1} max={10} step={1} value={form.energy_level} onChange={v => setForm({ ...form, energy_level: v })} />
            <Slider label={`Stress: ${form.stress_level}/10`} min={1} max={10} step={1} value={form.stress_level} onChange={v => setForm({ ...form, stress_level: v })} />
            <Slider label={`Suv: ${form.water_glasses} stakan`} min={0} max={15} step={1} value={form.water_glasses} onChange={v => setForm({ ...form, water_glasses: v })} />
            <Field label="Vazn (kg)" value={form.weight_kg} onChange={v => setForm({ ...form, weight_kg: v })} type="number" />
            <Field label="Qadamlar" value={form.steps} onChange={v => setForm({ ...form, steps: v })} type="number" />
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Mood / Izoh</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Bugun qanday his qildingiz?"
                className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={save} className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Saqlash
          </button>
        </div>

        {chartData.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="font-heading text-lg font-bold mb-3">14 kunlik trend</div>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="sleep" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, v }: any) {
  return <div className="bg-card border border-border rounded-xl p-3"><div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">{icon} {label}</div><div className="font-heading text-2xl font-bold">{v}</div></div>;
}
function Slider({ label, min, max, step, value, onChange }: any) {
  return <div><label className="text-xs text-muted-foreground">{label}</label><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-primary" /></div>;
}
function Field({ label, value, onChange, type = "text" }: any) {
  return <div><label className="text-xs text-muted-foreground">{label}</label><input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" /></div>;
}