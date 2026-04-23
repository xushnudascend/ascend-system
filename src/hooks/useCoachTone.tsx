import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CoachTone = "soft" | "hard";

interface Ctx { tone: CoachTone; setTone: (t: CoachTone) => void; toggle: () => void; }
const C = createContext<Ctx | undefined>(undefined);

export function CoachToneProvider({ children }: { children: ReactNode }) {
  const [tone, setToneState] = useState<CoachTone>(() => (localStorage.getItem("ascend_tone") as CoachTone) || "hard");
  useEffect(() => { localStorage.setItem("ascend_tone", tone); }, [tone]);
  const setTone = (t: CoachTone) => setToneState(t);
  const toggle = () => setToneState(p => p === "soft" ? "hard" : "soft");
  return <C.Provider value={{ tone, setTone, toggle }}>{children}</C.Provider>;
}
export const useCoachTone = () => {
  const c = useContext(C);
  if (!c) throw new Error("useCoachTone must be inside CoachToneProvider");
  return c;
};