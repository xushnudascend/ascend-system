import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Shield, Flame, Zap, Brain, Target, TrendingUp,
  CheckCircle2, Circle, Plus, Dumbbell,
  DollarSign, Heart, GraduationCap, ChevronRight,
  Calculator, MessageCircle, BarChart3,
} from "lucide-react";
import type { TestResult } from "@/data/onboardingQuestions";
import { categories } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import TopBar from "@/components/TopBar";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  difficulty: number;
  xp: number;
}

const defaultHabits: Habit[] = [
  { id: '1', name: 'Ertalab 5:30 da turish', completed: false, difficulty: 3, xp: 30 },
  { id: '2', name: '30 daqiqa sport', completed: false, difficulty: 4, xp: 40 },
  { id: '3', name: 'Kitob o\'qish (30 min)', completed: false, difficulty: 2, xp: 20 },
  { id: '4', name: 'Ijtimoiy tarmoqsiz 2 soat', completed: false, difficulty: 5, xp: 50 },
  { id: '5', name: 'Sovuq dush', completed: false, difficulty: 3, xp: 30 },
];

const categoryIcons: Record<string, React.ReactNode> = {
  sport: <Dumbbell className="w-5 h-5" />,
  finance: <DollarSign className="w-5 h-5" />,
  mental: <Heart className="w-5 h-5" />,
  intellect: <Brain className="w-5 h-5" />,
  discipline: <Shield className="w-5 h-5" />,
  university: <GraduationCap className="w-5 h-5" />,
};

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<TestResult | null>(null);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('ascend_habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('ascend_streak') || '0'));
  const [totalXp, setTotalXp] = useState(() => Number(localStorage.getItem('ascend_xp') || '0'));
  const [newHabit, setNewHabit] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem('ascend_profile');
    if (p) setProfile(JSON.parse(p));
  }, []);

  useEffect(() => {
    localStorage.setItem('ascend_habits', JSON.stringify(habits));
  }, [habits]);

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const disciplineScore = profile ? Math.round(
    (profile.disciplineScore * 0.4) + (completionRate * 0.3) + (Math.min(streak, 30) * 3.33 * 0.3)
  ) : completionRate;

  const level = Math.floor(totalXp / 200) + 1;
  const xpInLevel = totalXp % 200;
  const rank = disciplineScore >= 85 ? 'Apex' : disciplineScore >= 65 ? 'Elite' : disciplineScore >= 40 ? 'Disciplined' : 'Beginner';
  const rankColor = rank === 'Apex' ? 'text-success' : rank === 'Elite' ? 'text-warning' : rank === 'Disciplined' ? 'text-primary' : 'text-muted-foreground';

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        if (!h.completed) {
          setTotalXp(x => { const n = x + h.xp; localStorage.setItem('ascend_xp', String(n)); return n; });
        }
        return { ...h, completed: !h.completed };
      }
      return h;
    }));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(prev => [...prev, { id: Date.now().toString(), name: newHabit.trim(), completed: false, difficulty: 3, xp: 30 }]);
    setNewHabit('');
    setShowAddHabit(false);
  };

  // BMI Calculator state
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const bmi = bmiWeight && bmiHeight ? (Number(bmiWeight) / ((Number(bmiHeight) / 100) ** 2)).toFixed(1) : null;
  const bmiCategory = bmi ? (Number(bmi) < 18.5 ? 'Kam vazn' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Ortiqcha vazn' : 'Semizlik') : null;
  const bmiColor = bmiCategory === 'Normal' ? 'text-success' : bmiCategory === 'Kam vazn' || bmiCategory === 'Ortiqcha vazn' ? 'text-warning' : 'text-destructive';

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Bento Grid - Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Discipline Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-2 p-6 rounded-2xl border border-border bg-card glow-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1"><Shield className="w-4 h-4" /> Intizom balli</p>
              <span className={`font-heading text-sm font-bold ${rankColor}`}>{rank}</span>
            </div>
            <p className="font-heading text-5xl font-bold glow-text animate-score-count">{disciplineScore}</p>
            <Progress value={disciplineScore} className="h-2 mt-3" />
          </motion.div>

          {/* Streak */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Flame className="w-4 h-4" /> Streak</p>
            <p className={`font-heading text-4xl font-bold mt-1 ${streak < 3 ? 'text-destructive' : 'text-success'}`}>
              {streak}<span className="text-lg">kun</span>
            </p>
          </motion.div>

          {/* XP & Level */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Zap className="w-4 h-4" /> Level {level}</p>
            <p className="font-heading text-2xl font-bold text-xp mt-1">{totalXp} XP</p>
            <Progress value={(xpInLevel / 200) * 100} className="h-1.5 mt-2" />
          </motion.div>
        </div>

        {/* Today's Habits */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Bugungi vazifalar
            </h2>
            <span className="text-sm text-muted-foreground">{completedCount}/{habits.length}</span>
          </div>
          <div className="space-y-2">
            {habits.map(h => (
              <button key={h.id} onClick={() => toggleHabit(h.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${h.completed ? 'bg-success/10 border border-success/20' : 'bg-card border border-border hover:border-primary/30'}`}>
                {h.completed ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                <span className={`text-sm flex-1 text-left ${h.completed ? 'line-through text-muted-foreground' : ''}`}>{h.name}</span>
                <span className="text-xs text-xp">+{h.xp} XP</span>
              </button>
            ))}
          </div>
          {showAddHabit ? (
            <div className="flex gap-2 mt-3">
              <input value={newHabit} onChange={e => setNewHabit(e.target.value)} onKeyDown={e => e.key === 'Enter' && addHabit()}
                placeholder="Yangi odat..." className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" autoFocus />
              <button onClick={addHabit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Qo'shish</button>
            </div>
          ) : (
            <button onClick={() => setShowAddHabit(true)}
              className="w-full mt-3 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-sm flex items-center justify-center gap-1 hover:border-primary/50 transition-colors">
              <Plus className="w-4 h-4" /> Odat qo'shish
            </button>
          )}
        </motion.div>

        {/* BMI Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" /> BMI Kalkulyator
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Vazn (kg)</label>
              <input value={bmiWeight} onChange={e => setBmiWeight(e.target.value)} type="number" placeholder="70"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Bo'y (sm)</label>
              <input value={bmiHeight} onChange={e => setBmiHeight(e.target.value)} type="number" placeholder="175"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
            </div>
          </div>
          {bmi && (
            <div className="mt-4 p-4 rounded-xl bg-background border border-border text-center">
              <p className="text-sm text-muted-foreground">Sizning BMI</p>
              <p className={`font-heading text-3xl font-bold ${bmiColor}`}>{bmi}</p>
              <p className={`text-sm font-medium ${bmiColor}`}>{bmiCategory}</p>
            </div>
          )}
        </motion.div>

        {/* AI Mentor Quick Access */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-primary/30 bg-card p-6 glow-border">
          <Link to="/ai-mentor" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold">AI Mentor</h3>
                <p className="text-sm text-muted-foreground">Savol bering, maslahat oling</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </motion.div>

        {/* Categories / Sections */}
        <div>
          <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Bo'limlar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                <Link to={`/courses?category=${cat.id}`}
                  className="block p-5 rounded-xl border border-border bg-card card-hover">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    {categoryIcons[cat.id]}
                  </div>
                  <h3 className="font-heading font-semibold text-sm">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{cat.subcategories.length} ta bo'lim</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly Progress placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" /> Haftalik progress
          </h2>
          <div className="flex items-end gap-2 h-32">
            {['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sh', 'Ya'].map((d, i) => {
              const val = i < new Date().getDay() ? Math.random() * 80 + 20 : 0;
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-primary/20 relative" style={{ height: `${val}%` }}>
                    <div className="absolute bottom-0 w-full rounded-t-lg bg-primary transition-all" style={{ height: `${val * 0.7}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
