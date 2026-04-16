import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { categories, courses } from "@/data/courses";
import { ArrowLeft, ChevronRight, Clock, BarChart, CheckCircle2 } from "lucide-react";

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const cat = categories.find(c => c.id === selectedCategory);
  const subCat = cat?.subcategories.find(s => s.id === selectedSubCategory);
  const course = selectedCourse ? courses[selectedCourse] : null;

  if (course) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
          <button onClick={() => setSelectedCourse('')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Orqaga
          </button>
        </nav>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{course.icon}</span>
              <div>
                <h1 className="font-heading text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground text-sm">{course.description}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-1"><BarChart className="w-4 h-4" /> {course.difficulty}</span>
            </div>

            {/* Tips */}
            <div className="mt-8 p-5 rounded-xl border border-success/20 bg-success/5">
              <h3 className="font-heading font-semibold text-success mb-3">💡 Muhim maslahatlar</h3>
              <ul className="space-y-2">
                {course.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="mt-4 p-5 rounded-xl border border-destructive/20 bg-destructive/5">
              <h3 className="font-heading font-semibold text-destructive mb-3">⚠️ Ko'p uchraydigan xatolar</h3>
              <ul className="space-y-2">
                {course.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-destructive shrink-0">✗</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weekly Plan */}
            <h3 className="font-heading text-xl font-bold mt-8 mb-4">Haftalik reja</h3>
            <div className="space-y-3">
              {course.weeklyPlan.map((day) => (
                <div key={day.day} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading text-sm font-bold">{day.day}</span>
                    <h4 className="font-heading font-semibold">{day.title}</h4>
                  </div>
                  <ul className="space-y-1 ml-10">
                    {day.tasks.map((task, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary shrink-0">•</span> {task}
                      </li>
                    ))}
                  </ul>
                  {day.exercises && (
                    <div className="mt-3 ml-10">
                      <p className="text-xs text-primary font-medium mb-1">Mashqlar:</p>
                      {day.exercises.map((ex, i) => (
                        <div key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="font-medium text-foreground">{ex.name}</span>
                          {ex.sets && <span>{ex.sets}×{ex.reps}</span>}
                          {ex.notes && <span className="text-primary/70">— {ex.notes}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (subCat) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
          <button onClick={() => setSelectedSubCategory('')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> {cat?.title}
          </button>
        </nav>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="font-heading text-2xl font-bold mb-2">{subCat.title}</h1>
          <p className="text-muted-foreground mb-6">{subCat.description}</p>
          <div className="space-y-3">
            {subCat.courseIds.map(cid => {
              const c = courses[cid];
              if (!c) return null;
              return (
                <motion.button key={cid} onClick={() => setSelectedCourse(cid)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="w-full p-5 rounded-xl border border-border bg-card card-hover text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h3 className="font-heading font-semibold">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.duration} • {c.difficulty}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (cat) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
          <button onClick={() => setSelectedCategory('')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Barcha bo'limlar
          </button>
        </nav>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="font-heading text-2xl font-bold">{cat.title}</h1>
              <p className="text-muted-foreground">{cat.description}</p>
            </div>
          </div>
          <div className="space-y-3">
            {cat.subcategories.map((sub, i) => (
              <motion.button key={sub.id} onClick={() => setSelectedSubCategory(sub.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="w-full p-5 rounded-xl border border-border bg-card card-hover text-left flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold">{sub.title}</h3>
                  <p className="text-sm text-muted-foreground">{sub.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{sub.courseIds.length} kurs</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All categories
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="font-heading font-bold">Kurslar</span>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="font-heading text-2xl font-bold mb-6">Barcha bo'limlar</h1>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, i) => (
            <motion.button key={cat.id} onClick={() => setSelectedCategory(cat.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-border bg-card card-hover text-left">
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="font-heading font-semibold mt-2">{cat.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{cat.description}</p>
              <p className="text-xs text-primary mt-2">{cat.subcategories.length} bo'lim</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
