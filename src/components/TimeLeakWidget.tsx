import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function TimeLeakWidget() {
  const { user } = useAuth();
  const [trend, setTrend] = useState<{date:string; minutes:number}[]>([]);
  const [top3, setTop3] = useState<{category:string; minutes:number}[]>([]);

  useEffect(() => { if (user) load(); }, [user]);
  async function load() {
    const since = new Date(); since.setDate(since.getDate()-13);
    const { data } = await supabase.from('time_logs').select('*').eq('user_id', user!.id).gte('log_date', since.toISOString().slice(0,10));
    if (!data) return;
    // 14-day trend
    const byDay: Record<string, number> = {};
    for (let i=13;i>=0;i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      byDay[d.toISOString().slice(0,10)] = 0;
    }
    data.forEach(r => { byDay[r.log_date] = (byDay[r.log_date]||0) + r.minutes; });
    setTrend(Object.entries(byDay).map(([date, minutes]) => ({ date: date.slice(5), minutes })));
    // Top 3 wastes
    const byCat: Record<string, number> = {};
    data.forEach(r => { byCat[r.category] = (byCat[r.category]||0) + r.minutes; });
    const sorted = Object.entries(byCat).sort(([,a],[,b])=>b-a).slice(0,3).map(([category, minutes]) => ({ category, minutes }));
    setTop3(sorted);
  }

  const totalMin = trend.reduce((s,x)=>s+x.minutes,0);
  if (totalMin === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/><h3 className="font-semibold">Time Leak</h3></div>
          <Link to="/time-leak" className="text-xs text-primary flex items-center gap-1">Log <ArrowRight className="w-3 h-3"/></Link>
        </div>
        <p className="text-sm text-muted-foreground">14 kun ichida vaqt sarfi yo'q. <Link to="/time-leak" className="text-primary underline">Log qiling</Link>.</p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/><h3 className="font-semibold">Time Leak (14 kun)</h3></div>
        <Link to="/time-leak" className="text-xs text-primary flex items-center gap-1">Batafsil <ArrowRight className="w-3 h-3"/></Link>
      </div>
      <div style={{width:'100%', height:120}}>
        <ResponsiveContainer>
          <LineChart data={trend}>
            <XAxis dataKey="date" tick={{fontSize:10, fill:'hsl(var(--muted-foreground))'}}/>
            <YAxis hide/>
            <Tooltip contentStyle={{background:'hsl(var(--card))', border:'1px solid hsl(var(--border))', fontSize:12}}/>
            <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <div className="text-xs uppercase text-muted-foreground mb-1.5">Top 3 sarf manbalari</div>
        <div className="space-y-1">
          {top3.map((t,i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="capitalize">{i+1}. {t.category}</span>
              <span className="text-muted-foreground tabular-nums">{Math.round(t.minutes/60)}s {t.minutes%60}d</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}