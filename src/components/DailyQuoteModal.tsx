import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X } from "lucide-react";
import { getQuoteOfDay } from "@/data/dailyQuotes";
import { useI18n } from "@/hooks/useI18n";

const KEY = "ascend_quote_shown_date";

export default function DailyQuoteModal() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [q] = useState(() => getQuoteOfDay());

  useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem(KEY) !== today) {
      const id = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(id);
    }
  }, []);

  const close = () => {
    localStorage.setItem(KEY, new Date().toDateString());
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-lg w-full bg-card border border-primary/30 rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.2)" }}
          >
            <button onClick={close} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-muted text-muted-foreground" aria-label="close">
              <X className="w-4 h-4" />
            </button>
            <Quote className="w-10 h-10 text-primary mb-4 opacity-60" />
            <p className="text-xs uppercase tracking-widest text-primary mb-3">{t("todayQuote")}</p>
            <p className="font-heading text-2xl md:text-3xl font-semibold leading-tight mb-4">
              "{q.text}"
            </p>
            <p className="text-sm text-muted-foreground">— {q.author}</p>
            <button onClick={close} className="mt-6 w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:opacity-90">
              {t("close")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}