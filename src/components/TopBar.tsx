import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Library, BarChart3, Users, Trophy,
  User as UserIcon, MessageCircle, LogOut, Sun, Moon, Globe
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useI18n, type Lang } from "@/hooks/useI18n";
import { useState } from "react";

export default function TopBar() {
  const { signOut, user } = useAuth();
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useI18n();
  const loc = useLocation();
  const [openLang, setOpenLang] = useState(false);

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/courses", icon: BookOpen, label: t("courses") },
    { to: "/books", icon: Library, label: t("books") },
    { to: "/analytics", icon: BarChart3, label: t("analytics") },
    { to: "/community", icon: Users, label: t("community") },
    { to: "/leaderboard", icon: Trophy, label: t("leaderboard") },
    { to: "/profile", icon: UserIcon, label: t("profile") },
    { to: "/ai-mentor", icon: MessageCircle, label: t("aiMentor") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="font-heading text-lg font-bold shrink-0">
          ASCEND<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 overflow-x-auto">
          {links.map(l => {
            const active = loc.pathname === l.to;
            return (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <l.icon className="w-3.5 h-3.5" /> {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="relative">
            <button onClick={() => setOpenLang(o => !o)} className="p-2 rounded-lg hover:bg-card transition-colors flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="w-4 h-4" /> {lang.toUpperCase()}
            </button>
            {openLang && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {(["uz", "en", "ru", "tr"] as Lang[]).map(l => (
                  <button key={l} onClick={() => { setLang(l); setOpenLang(false); }}
                    className={`block w-full px-4 py-2 text-xs text-left hover:bg-muted ${lang === l ? "text-primary font-medium" : ""}`}>
                    {l === "uz" ? "O'zbek" : l === "en" ? "English" : l === "ru" ? "Русский" : "Türkçe"}
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
        </div>
      </div>

      {/* Mobile pill nav */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-3 pb-2 scrollbar-hide">
        {links.map(l => {
          const active = loc.pathname === l.to;
          return (
            <Link key={l.to} to={l.to}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${active ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              <l.icon className="w-3.5 h-3.5" /> {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
