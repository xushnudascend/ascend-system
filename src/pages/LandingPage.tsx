import { motion } from "framer-motion";
import { ArrowRight, Flame, Target, Brain, Zap, Shield, Sparkles, ListChecks, TrendingUp, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useI18n, LANG_NAMES, type Lang } from "@/hooks/useI18n";
import SEO from "@/components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function LandingPage() {
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();
  const painPoints = [t("pain1"), t("pain2"), t("pain3")];
  const systemFeatures = [
    { icon: Brain, title: t("feat1Title"), desc: t("feat1Desc") },
    { icon: Target, title: t("feat2Title"), desc: t("feat2Desc") },
    { icon: Flame, title: t("feat3Title"), desc: t("feat3Desc") },
    { icon: Zap, title: t("feat4Title"), desc: t("feat4Desc") },
    { icon: Shield, title: t("feat5Title"), desc: t("feat5Desc") },
  ];
  const steps = [
    { icon: Sparkles, title: t("landingStep1T"), desc: t("landingStep1D") },
    { icon: ListChecks, title: t("landingStep2T"), desc: t("landingStep2D") },
    { icon: TrendingUp, title: t("landingStep3T"), desc: t("landingStep3D") },
  ];
  const proof = [t("landingProof1"), t("landingProof2"), t("landingProof3"), t("landingProof4")];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEO
        title="Ascend — AI mentorship, habits & discipline tracking"
        description="Build discipline with AI mentorship, habit tracking, courses, and analytics. Ascend helps you turn intentions into daily action."
        path="/"
      />
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <nav className="container flex items-center justify-between h-16 gap-3" aria-label="Primary">
          <Link to="/" className="font-heading text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity">
            ASCEND<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Globe className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="appearance-none bg-card border border-border rounded-md text-xs pl-7 pr-2 py-1.5 text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                aria-label="Language"
              >
                {Object.entries(LANG_NAMES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            {!user && (
              <Link
                to="/auth"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("login") ?? "Kirish"}
              </Link>
            )}
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold hover:brightness-110 transition-all"
            >
              {user ? t("dashboard") : t("landingStartNow")}
            </Link>
          </div>
        </nav>
      </header>

      <main>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute bottom-0 right-[-120px] w-[420px] h-[420px] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,hsl(var(--background))_70%)]" />
        </div>

        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-muted-foreground text-sm font-heading tracking-widest uppercase mb-8"
          >
            {t("landingTagline")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-primary glow-text">{t("landingHero1")}</span>
            <br />
            {t("landingHero2")}
            <br />
            <span className="text-muted-foreground">{t("landingHero3")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            {t("landingSub1")}
            <br />
            <span className="text-foreground font-medium">{t("landingSub2")}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold glow-box hover:brightness-110 transition-all"
            >
              {t("landingStartNow")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-border bg-card/40 text-foreground font-heading text-base font-semibold hover:border-primary/40 hover:bg-card transition-all"
            >
              {t("landingHowTitle")}
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            ✦ {t("landingTrust")}
          </motion.p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="space-y-6">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/50 card-hover"
              >
                <div className="mt-0.5 w-2 h-2 rounded-full bg-destructive shrink-0" />
                <p className="text-foreground text-lg font-medium">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 border-t border-border/30 scroll-mt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            {t("landingHowTitle")}<span className="text-primary">.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-30px" }} variants={fadeUp}
                className="p-6 rounded-xl border border-primary/20 bg-card/80 card-hover">
                <s.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="py-16 border-t border-border/30">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proof.map((p, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-border/50 bg-card/50">
                <div className="font-heading text-2xl md:text-3xl font-bold text-primary glow-text">{p}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-base md:text-lg">{t("landingTrust")}</p>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 border-t border-border/30">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-16"
          >
            {t("landingSystemTitle")}<span className="text-primary">.</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {systemFeatures.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                className="p-6 rounded-xl border border-border/50 bg-card/80 card-hover"
              >
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border/30">
        <div className="container text-center max-w-2xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold mb-6"
          >
            {t("landingFinalH")}<span className="text-primary">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg mb-10"
          >
            {t("landingFinalP")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/auth"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold glow-box hover:brightness-110 transition-all"
            >
              {t("landingBegin")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      </main>
      <footer className="py-10 border-t border-border/30">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="font-heading">
            <span className="font-bold text-foreground">ASCEND<span className="text-primary">.</span></span>
            <span className="mx-2 opacity-50">·</span>
            © {new Date().getFullYear()}
          </p>
          <p className="text-center sm:text-right">{t("landingFooter")}</p>
        </div>
      </footer>
    </div>
  );
}
