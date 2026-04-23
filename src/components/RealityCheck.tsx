import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

const PROMPTS = [
  "Are you actually focused?",
  "Phone in another room?",
  "Is this the most important task?",
  "What did you accomplish in the last hour?",
  "Are you doing — or pretending?",
];

export default function RealityCheck({ active, intervalSec = 300 }: { active: boolean; intervalSec?: number }) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setText(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
      setShow(true);
      setTimeout(() => setShow(false), 6000);
    }, intervalSec * 1000);
    return () => clearInterval(id);
  }, [active, intervalSec]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] bg-amber-500/15 border border-amber-500/40 backdrop-blur-md px-4 py-3 rounded-xl flex items-center gap-2 text-amber-300 text-sm shadow-lg">
          <Eye className="w-4 h-4 shrink-0" />
          <span className="font-medium">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
