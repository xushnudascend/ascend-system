import { motion } from "framer-motion";
import { Check, X, Zap, Crown, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useI18n } from "@/hooks/useI18n";
import SEO from "@/components/SEO";

const tiers = [
  {
    name: "Free",
    price: "0",
    period: "/oy",
    icon: Zap,
    description: "Boshlash uchun barcha asoslar",
    features: [
      { text: "Habit tracking (5 ta odat)", included: true },
      { text: "Asosiy dashboard va XP tizimi", included: true },
      { text: "1 ta faol mission", included: true },
      { text: "Kitoblar kutubxonasi (250+)", included: true },
      { text: "Community kirish", included: true },
      { text: "AI Mentor (cheklanmagan)", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Shaxsiy AI rejalar", included: false },
      { text: "Telegram/Email reminders", included: false },
    ],
    cta: "Bepul boshlash",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "9.99",
    period: "/oy",
    icon: Crown,
    description: "To'liq kuch — haqiqiy o'zgarish uchun",
    features: [
      { text: "Cheklanmagan habit tracking", included: true },
      { text: "Advanced bento dashboard", included: true },
      { text: "Cheklanmagan missiyalar", included: true },
      { text: "Barcha kitoblar + insholar", included: true },
      { text: "Community + Leaderboard", included: true },
      { text: "AI Mentor (qattiq, sovuq)", included: true },
      { text: "Haftalik trend va failure pattern", included: true },
      { text: "Dinamik shaxsiy reja", included: true },
      { text: "Telegram + Email eslatmalar", included: true },
    ],
    cta: "Premium olish",
    highlighted: true,
  },
];

export default function PricingPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pricing — Ascend"
        description="Simple pricing for Ascend. Choose the plan that fits your goals and unlock AI mentorship, courses, and discipline tracking."
        path="/pricing"
      />
      <TopBar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Bahoyalar
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">
            Intizom — sarmoya, xarajat emas
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Bepul boshlang. Tayyor bo'lganingizda — to'liq kuchni oching. Istalgan vaqtda bekor qiling.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                tier.highlighted
                  ? "border-primary bg-card glow-border"
                  : "border-border bg-card"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  ENG MASHHUR
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.highlighted ? "bg-primary/20" : "bg-muted"}`}>
                  <tier.icon className={`w-5 h-5 ${tier.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h2 className="font-heading text-2xl font-bold">{tier.name}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading text-5xl font-bold">${tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                    )}
                    <span className={f.included ? "text-foreground" : "text-muted-foreground line-through"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90 glow-primary"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-2xl border border-border bg-card text-center"
        >
          <h3 className="font-heading text-lg font-bold mb-2">7 kunlik bepul Premium sinov</h3>
          <p className="text-sm text-muted-foreground">
            Hech qanday karta talab qilinmaydi. Istalgan vaqt bekor qiling. Hech qanday sirli xarajatlar.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
