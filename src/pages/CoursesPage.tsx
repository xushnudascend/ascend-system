import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BarChart, CheckCircle2, Search } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { courses as baseCourses, courseCategories, type Course } from "@/data/courses";
import { coursesExtra } from "@/data/coursesExtra";
import { useI18n } from "@/hooks/useI18n";

const allCourses: Course[] = [...baseCourses, ...coursesExtra];

// Sort by level: beginner → intermediate → advanced
const levelOrder: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
function sortByLevel(list: Course[]): Course[] {
  return [...list].sort((a, b) => (levelOrder[a.level] ?? 99) - (levelOrder[b.level] ?? 99));
}

// Interleave by category so the "all" view doesn't look like a single category
function interleaveByCategory(list: Course[]): Course[] {
  const buckets = new Map<string, Course[]>();
  list.forEach(c => {
    if (!buckets.has(c.category)) buckets.set(c.category, []);
    buckets.get(c.category)!.push(c);
  });
  // Sort each bucket by level
  buckets.forEach((arr, k) => buckets.set(k, sortByLevel(arr)));
  const queues = Array.from(buckets.values());
  const out: Course[] = [];
  while (queues.some(q => q.length)) {
    queues.forEach(q => { if (q.length) out.push(q.shift()!); });
  }
  return out;
}
const coursesAll = interleaveByCategory(allCourses);

export default function CoursesPage() {
  const { t } = useI18n();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Course | null>(null);
  const [doneDays, setDoneDays] = useState<Record<string, number[]>>(() => {
    try { return JSON.parse(localStorage.getItem("course-progress") || "{}"); } catch { return {}; }
  });

  function toggleDay(courseId: string, day: number) {
    setDoneDays(prev => {
      const cur = new Set(prev[courseId] || []);
      cur.has(day) ? cur.delete(day) : cur.add(day);
      const next = { ...prev, [courseId]: Array.from(cur) };
      localStorage.setItem("course-progress", JSON.stringify(next));
      return next;
    });
  }

  const source = cat === "all" ? coursesAll : sortByLevel(allCourses.filter(c => c.category === cat));
  const list = source.filter(c => !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()));

  if (active) {
    const done = doneDays[active.id] || [];
    const pct = Math.round((done.length / active.lessons.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button onClick={() => setActive(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{active.emoji}</span>
              <div>
                <h1 className="font-heading text-2xl font-bold">{active.title}</h1>
                <p className="text-muted-foreground text-sm">{active.description}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {active.duration} {t("dayWord")}</span>
              <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> {active.level}</span>
              <span className="text-primary">{pct}% {t("completed")}</span>
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-primary" />
            </div>
            <div className="mt-6 space-y-2">
              {active.lessons.map(l => {
                const isDone = done.includes(l.day);
                return (
                  <motion.div key={l.day} whileHover={{ x: 2 }} className={`p-4 rounded-xl border ${isDone ? "bg-success/5 border-success/30" : "bg-card border-border"}`}>
                    <button onClick={() => toggleDay(active.id, l.day)} className="w-full text-left flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isDone ? "bg-success border-success" : "border-muted-foreground"}`}>
                        {isDone && <CheckCircle2 className="w-3 h-3 text-background" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold text-sm">{t("dayWord")} {l.day}: {l.title}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{l.task}</p>
                        <p className="text-[10px] text-primary mt-1">💡 {l.tip}</p>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="font-heading text-3xl font-bold">{t("courses")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{allCourses.length}+ · {t("coursesSubtitle")}</p>
        </header>

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t("searchCourse")} className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {courseCategories.map(c => (
            <button key={c.id} onClick={() => { setCat(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${cat === c.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              <span>{c.emoji}</span> {t(c.tKey)}
            </button>
          ))}
        </div>

        <div key={cat} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map(c => {
            const done = (doneDays[c.id] || []).length;
            const pct = Math.round((done / c.lessons.length) * 100);
            return (
              <motion.button key={c.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, scale: 1.01 }} onClick={() => setActive(c)}
                className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-3xl">{c.emoji}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.level === 'beginner' ? 'bg-success/10 text-success' : c.level === 'intermediate' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>{c.level}</span>
                </div>
                <div className="font-heading font-bold text-sm">{c.title}</div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{c.duration} {t("dayWord")}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {list.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {t("noResults") || "Hech narsa topilmadi"}
          </div>
        )}
      </main>
    </div>
  );
}
