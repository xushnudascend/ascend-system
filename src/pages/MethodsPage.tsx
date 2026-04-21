import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, X, Beaker } from "lucide-react";
import TopBar from "@/components/TopBar";
import DailyQuoteModal from "@/components/DailyQuoteModal";
import { methods, methodCategories, type Method } from "@/data/methods";
import { useI18n } from "@/hooks/useI18n";

export default function MethodsPage() {
  const { t } = useI18n();
  const [cat, setCat] = useState<string>("all");
  const [active, setActive] = useState<Method | null>(null);

  const filtered = cat === "all" ? methods : methods.filter(m => m.category === cat);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <DailyQuoteModal />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-2">
            <Beaker className="w-7 h-7 text-primary" /> {t("methods")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">SMART, Eisenhower, Pomodoro va boshqa ilmiy metodlar.</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <button onClick={() => setCat("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${cat === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
            {t("all")}
          </button>
          {methodCategories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${cat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(m => (
            <motion.button key={m.id} whileHover={{ y: -2 }} onClick={() => setActive(m)}
              className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
              <div className="text-xs text-primary mb-1">{m.category}</div>
              <div className="font-semibold mb-1">{m.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{m.short}</div>
              <div className="text-xs flex items-center gap-1 text-primary">{t("learnMore")} <ChevronRight className="w-3 h-3" /></div>
            </motion.button>
          ))}
        </div>
      </main>

      {active && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-end md:items-center justify-center p-4" onClick={() => setActive(null)}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs text-primary mb-1">{active.category}</div>
                <h2 className="font-heading text-2xl font-bold">{active.name}</h2>
              </div>
              <button onClick={() => setActive(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{active.description}</p>
            <div className="mb-4">
              <h3 className="text-xs uppercase tracking-wider text-primary mb-2">{t("steps")}</h3>
              <ol className="space-y-2">
                {active.steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">{i+1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            {active.research && (
              <div className="bg-muted/30 rounded-lg p-3 text-xs">
                <div className="text-primary font-semibold mb-1">{t("research")}</div>
                <div className="text-muted-foreground">{active.research}</div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}