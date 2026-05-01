import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Radar } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from "recharts";

const dims = ['body','mind','money','discipline','social','purpose'] as const;

export default function LifeScorePage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<Record<string,number>>({ body:50, mind:50, money:50, discipline:50, social:50, purpose:50 });

  useEffect(()=>{ if (user) load(); }, [user]);
  async function load() {
    const { data } = await supabase.from('life_scores').select('*').eq('user_id', user!.id).order('log_date',{ascending:false}).limit(1).maybeSingle();
    if (data) setScores({ body:data.body, mind:data.mind, money:data.money, discipline:data.discipline, social:data.social, purpose:data.purpose });
  }
  async function save() {
    if (!user) return;
    const today = new Date().toISOString().slice(0,10);
    const { error } = await supabase.from('life_scores').upsert({ user_id: user.id, log_date: today, ...scores }, { onConflict: 'user_id,log_date' });
    if (error) toast.error(error.message); else toast.success('Saqlandi');
  }

  const data = dims.map(d => ({ dim: d, score: scores[d] }));
  const avg = Math.round(Object.values(scores).reduce((a,b)=>a+b,0) / 6);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Radar className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Life Score</h1>
        </div>
        <p className="text-muted-foreground mb-6">6 ta o'lcham bo'yicha hayot bali. Har kuni o'zingizni baholang.</p>

        <Card className="p-5 mb-4">
          <div className="text-center mb-4">
            <div className="text-xs uppercase text-muted-foreground">O'rtacha</div>
            <div className="text-5xl font-heading font-bold text-primary">{avg}</div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <PolarRadiusAxis domain={[0,100]} tick={false} />
                <RechartsRadar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="space-y-4">
            {dims.map(d => (
              <div key={d}>
                <div className="flex justify-between text-sm mb-1"><span className="capitalize">{d}</span><span className="text-muted-foreground">{scores[d]}</span></div>
                <input type="range" min={0} max={100} value={scores[d]} onChange={e=>setScores(s=>({...s,[d]:+e.target.value}))} className="w-full" />
              </div>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={save}>Bugungi ballni saqlash</Button>
        </Card>
      </div>
    </div>
  );
}