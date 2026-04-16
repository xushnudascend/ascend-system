import { motion } from "framer-motion";
import { ArrowRight, Flame, Target, Brain, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const painPoints = [
  "You start, then quit after 3 days.",
  "You know what to do. You just don't do it.",
  "Motivation fades. Systems don't.",
];

const systemFeatures = [
  {
    icon: Brain,
    title: "AI That Confronts You",
    desc: "No motivational fluff. Your AI mentor detects excuse patterns and forces corrections.",
  },
  {
    icon: Target,
    title: "Adaptive Behavior Engine",
    desc: "Miss 3 days? Plan auto-simplifies. Win 7 straight? Difficulty escalates.",
  },
  {
    icon: Flame,
    title: "Streak & Discipline Score",
    desc: "Your consistency, completion rate, and streak fused into one number. No hiding.",
  },
  {
    icon: Zap,
    title: "XP & Rank System",
    desc: "Beginner → Disciplined → Elite → Apex. Every habit completed earns XP.",
  },
  {
    icon: Shield,
    title: "Failure System",
    desc: "Missed a habit? Streak resets. Score drops. AI tells you exactly why you failed.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            ASCEND<span className="text-primary">.</span>
          </span>
          <Link
            to="/auth"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold hover:brightness-110 transition-all"
          >
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container relative text-center max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-muted-foreground text-sm font-heading tracking-widest uppercase mb-8"
          >
            Behavior Optimization System
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            You said you'll change{" "}
            <span className="text-primary glow-text">tomorrow.</span>
            <br />
            You didn't.
            <br />
            <span className="text-muted-foreground">Again.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            ASCEND doesn't motivate you.
            <br />
            <span className="text-foreground font-medium">
              It builds the system that replaces motivation.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <Link
              to="/auth"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading text-lg font-bold glow-box hover:brightness-110 transition-all"
            >
              Start Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 border-t border-border/30">
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
            The System<span className="text-primary">.</span>
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
            Stop thinking about it<span className="text-primary">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg mb-10"
          >
            Every day you delay is another day the old version of you wins.
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
              Begin Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            ASCEND — Replace willpower with automated discipline.
          </p>
        </div>
      </footer>
    </div>
  );
}
