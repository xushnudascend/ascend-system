import { useMemo, useState } from "react";
import { CalendarClock, Sun, Coffee, Briefcase, Dumbbell, BookOpen, Moon } from "lucide-react";
import TopBar from "@/components/TopBar";

const PRESETS: Record<string, { time: string; title: string; icon: any }[]> = {
  athlete: [
    { time: "05:30", title: "Wake + cold shower", icon: Sun },
    { time: "06:00", title: "Strength training (60 min)", icon: Dumbbell },
    { time: "07:30", title: "Protein breakfast", icon: Coffee },
    { time: "09:00", title: "Deep work (3 soat)", icon: Briefcase },
    { time: "13:00", title: "Lunch + 20 min walk", icon: Sun },
    { time: "15:00", title: "Skill / learning (90 min)", icon: BookOpen },
    { time: "17:30", title: "Cardio / mobility", icon: Dumbbell },
    { time: "19:30", title: "Dinner + family", icon: Coffee },
    { time: "21:30", title: "Wind down + reading", icon: BookOpen },
    { time: "22:30", title: "Sleep", icon: Moon },
  ],
  scholar: [
    { time: "06:30", title: "Wake + journal", icon: Sun },
    { time: "07:00", title: "Light workout (30 min)", icon: Dumbbell },
    { time: "08:00", title: "Breakfast + reading", icon: Coffee },
    { time: "09:00", title: "Deep study block 1 (3 soat)", icon: BookOpen },
    { time: "12:30", title: "Lunch", icon: Coffee },
    { time: "14:00", title: "Deep study block 2 (3 soat)", icon: BookOpen },
    { time: "17:30", title: "Walk + podcast", icon: Sun },
    { time: "19:00", title: "Dinner", icon: Coffee },
    { time: "20:00", title: "Writing / synthesis (60 min)", icon: BookOpen },
    { time: "22:30", title: "Sleep", icon: Moon },
  ],
  builder: [
    { time: "06:00", title: "Wake + plan", icon: Sun },
    { time: "06:30", title: "Workout (45 min)", icon: Dumbbell },
    { time: "08:00", title: "Breakfast + inbox triage", icon: Coffee },
    { time: "09:00", title: "Build block 1 — ship code (4 soat)", icon: Briefcase },
    { time: "13:00", title: "Lunch", icon: Coffee },
    { time: "14:00", title: "Build block 2 — features (3 soat)", icon: Briefcase },
    { time: "17:00", title: "Sales / customer calls", icon: Briefcase },
    { time: "19:00", title: "Dinner", icon: Coffee },
    { time: "20:30", title: "Read business / case studies", icon: BookOpen },
    { time: "23:00", title: "Sleep", icon: Moon },
  ],
};

export default function AutoRoutinePage() {
  const [preset, setPreset] = useState<keyof typeof PRESETS>("athlete");
  const items = useMemo(() => PRESETS[preset], [preset]);

  return (
    <div className="min-h-screen bg-background"><TopBar />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <header>
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2"><CalendarClock className="w-7 h-7 text-primary" /> Auto Routine Builder</h1>
          <p className="text-muted-foreground text-sm mt-1">Sistema kuningizni rejalashtiradi. Siz faqat bajarasiz.</p>
        </header>
        <div className="flex gap-2">
          {(["athlete","scholar","builder"] as const).map(p => (
            <button key={p} onClick={() => setPreset(p)} className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${preset === p ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>{p}</button>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
              <div className="font-heading text-lg font-bold text-primary tabular-nums w-16">{it.time}</div>
              <it.icon className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1 text-sm font-medium">{it.title}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}