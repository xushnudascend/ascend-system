import { useEffect, useState } from "react";
import { Heart, Moon, Zap, Activity, Droplets, Footprints, Plus } from "lucide-react";
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