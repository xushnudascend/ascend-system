import { useState } from "react";
import TopBar from "@/components/TopBar";
import { splits, sportsGuides } from "@/data/workoutSplits";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ChevronRight } from "lucide-react";

export default function WorkoutsPage() {
  const [tab, setTab] = useState<'splits'|'sports'>('splits');
  const [openSplit, setOpenSplit] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Workouts & Sports</h1>
        </div>
        <p className="text-muted-foreground mb-6">Tayyor splitlar, mashqlar, set/rep/RPE bilan. Sport turlari uchun real yo'l.</p>

        <div className="flex gap-2 mb-6">
          <Button variant={tab==='splits'?'default':'outline'} onClick={()=>setTab('splits')}>Splits</Button>
          <Button variant={tab==='sports'?'default':'outline'} onClick={()=>setTab('sports')}>Sport turlari</Button>
        </div>

        {tab==='splits' && (
          <div className="grid gap-4">
            {splits.map(s => (
              <Card key={s.id} className="p-5">
                <button onClick={()=>setOpenSplit(openSplit===s.id?null:s.id)} className="w-full text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-heading font-bold">{s.title}</h2>
                      <p className="text-xs text-muted-foreground mt-1">{s.freq} • {s.level} • {s.goal}</p>
                      <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform shrink-0 ${openSplit===s.id?'rotate-90':''}`} />
                  </div>
                </button>
                {openSplit===s.id && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">Maslahatlar</div>
                      <ul className="text-sm space-y-1">{s.tips.map((t,i)=>(<li key={i}>• {t}</li>))}</ul>
                    </div>
                    {s.days.map(d => (
                      <div key={d.name} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{d.name}</h3>
                          <span className="text-xs text-muted-foreground">{d.focus}</span>
                        </div>
                        <div className="grid gap-1 text-sm">
                          {d.exercises.map((e,i)=>(
                            <div key={i} className="flex justify-between gap-2 py-1 border-b border-border/40 last:border-0">
                              <span>{e.name}</span>
                              <span className="text-muted-foreground tabular-nums">{e.sets}×{e.reps}{e.rpe?` @RPE${e.rpe}`:''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {tab==='sports' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {sportsGuides.map(s => (
              <Card key={s.id} className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <h2 className="text-lg font-heading font-bold">{s.title}</h2>
                    <p className="text-xs text-muted-foreground">{s.method}</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1 mt-3">
                  {s.tips.map((t,i)=>(<li key={i} className="flex gap-2"><span className="text-primary">→</span><span>{t}</span></li>))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}