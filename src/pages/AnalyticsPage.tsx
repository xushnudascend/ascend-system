import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart3, Calendar } from "lucide-react";

const weekDays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];

export default function AnalyticsPage() {
  // Simulated data
  const thisWeek = [85, 90, 70, 60, 95, 80, 0];
  const lastWeek = [75, 80, 65, 85, 70, 90, 50];
  const avgThis = Math.round(thisWeek.reduce((a, b) => a + b, 0) / 7);
  const avgLast = Math.round(lastWeek.reduce((a, b) => a + b, 0) / 7);
  const trend = avgThis - avgLast;

  const strongHabits = ["Ertalab turish", "Kitob o'qish"];
  const weakHabits = ["Ijtimoiy tarmoqsiz 2 soat", "Sovuq dush"];
  const failureDays = ["Chorshanba", "Payshanba"];
  const failureTimes = ["Kechqurun 20:00 - 23:00"];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="font-heading font-bold">Analitika</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Bu hafta</p>
            <p className="font-heading text-3xl font-bold text-primary">{avgThis}%</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card text-center">
            <p className="text-xs text-muted-foreground mb-1">O'tgan hafta</p>
            <p className="font-heading text-3xl font-bold text-muted-foreground">{avgLast}%</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-border bg-card flex items-center gap-3">
          {trend >= 0 ? <TrendingUp className="w-5 h-5 text-success" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
          <p className="text-sm">
            {trend >= 0 ? `${trend}% yaxshilangan — davom eting!` : `${Math.abs(trend)}% pasaygan — sabab toping va tuzating.`}
          </p>
        </motion.div>

        {/* Daily breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Kunlik baholash</h3>
          <div className="space-y-3">
            {weekDays.map((d, i) => (
              <div key={d} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20">{d}</span>
                <div className="flex-1"><Progress value={thisWeek[i]} className="h-2" /></div>
                <span className={`text-xs font-medium w-10 text-right ${thisWeek[i] >= 80 ? 'text-success' : thisWeek[i] >= 50 ? 'text-warning' : 'text-destructive'}`}>{thisWeek[i]}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strong vs Weak */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-xl border border-success/20 bg-success/5">
            <h3 className="font-heading text-sm font-semibold text-success mb-3 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Kuchli tomonlar
            </h3>
            <ul className="space-y-2">
              {strongHabits.map(h => <li key={h} className="text-sm">{h}</li>)}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="p-5 rounded-xl border border-destructive/20 bg-destructive/5">
            <h3 className="font-heading text-sm font-semibold text-destructive mb-3 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Zaif tomonlar
            </h3>
            <ul className="space-y-2">
              {weakHabits.map(h => <li key={h} className="text-sm">{h}</li>)}
            </ul>
          </motion.div>
        </div>

        {/* Failure Patterns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-warning/20 bg-warning/5 p-5">
          <h3 className="font-heading font-semibold text-warning mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Muvaffaqiyatsizlik naqshlari
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Eng zaif kunlar:</span> {failureDays.join(', ')}</p>
            <p><span className="text-muted-foreground">Eng zaif vaqtlar:</span> {failureTimes.join(', ')}</p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              AI tavsiya: Chorshanba va payshanba kunlari rejani yengillashtiring. Kechqurun 20:00 dan keyin telefonni olib qo'ying.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
