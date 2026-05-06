import { Link, useLocation } from "react-router-dom";
import {
  LogOut, Sun, Moon, Globe, Menu, Flame, HeartHandshake,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useI18n, type Lang, LANG_NAMES } from "@/hooks/useI18n";
import { useCoachTone } from "@/hooks/useCoachTone";
import { useState } from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";

export default function TopBar() {
  const { signOut, user } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { tone, toggle: toggleTone } = useCoachTone();
  const loc = useLocation();
  const [openLang, setOpenLang] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="font-heading text-lg font-bold shrink-0">
          ASCEND<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleTone}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${tone === "hard" ? "text-rose-400 hover:bg-rose-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
            aria-label="Coach tone">
            {tone === "hard" ? <Flame className="w-4 h-4" /> : <HeartHandshake className="w-4 h-4" />}
            <span className="hidden sm:inline">{tone === "hard" ? "Hard" : "Soft"}</span>
          </button>
          <div className="relative">
            <button onClick={() => setOpenLang(o => !o)} className="p-2 rounded-lg hover:bg-card transition-colors flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="w-4 h-4" /> {lang.toUpperCase()}
            </button>
            {openLang && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto min-w-[140px]">
                {(Object.keys(LANG_NAMES) as Lang[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); setOpenLang(false); }}
                    className={`block w-full px-4 py-2 text-xs text-left hover:bg-muted ${lang === l ? "text-primary font-medium" : ""}`}>
                    {LANG_NAMES[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user && (
            <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => setOpenMenu(true)} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>

    {/* Slide-out sidebar */}
    {openMenu && (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpenMenu(false)} />
        <div className="absolute right-0 top-0 h-full animate-slide-in-right">
          <AppSidebar onClose={() => setOpenMenu(false)} />
        </div>
      </div>
    )}
    <BottomNav />
    </>
  );
}
