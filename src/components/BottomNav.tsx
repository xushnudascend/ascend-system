import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HeartPulse, GraduationCap, BarChart3, ListChecks, Bot, Users, X,
  Dumbbell, Apple, Heart, BookOpen, Library, Beaker, Sparkles, ClipboardList,
  Radar, LineChart, Clock, Target, AlertOctagon, Search, ClipboardCheck,
  LayoutDashboard, Swords, Power, Lock, FileSignature, Zap, Brain, Award,
  UserPlus, Trophy,
} from "lucide-react";

type Item = { to: string; icon: any; label: string };
type Tab = { key: string; icon: any; label: string; items: Item[]; direct?: string };

const TABS: Tab[] = [
  {
    key: "body", icon: HeartPulse, label: "Tana",
    items: [
      { to: "/health", icon: Heart, label: "Sog'liq & Energiya" },
      { to: "/workouts", icon: Dumbbell, label: "Mashqlar" },
      { to: "/nutrition", icon: Apple, label: "Ovqatlanish" },
    ],
  },
  {
    key: "learn", icon: GraduationCap, label: "O'rganish",
    items: [
      { to: "/courses", icon: BookOpen, label: "Kurslar" },
      { to: "/books", icon: Library, label: "Kitoblar" },
      { to: "/methods", icon: Beaker, label: "Metodlar" },
      { to: "/characters", icon: Sparkles, label: "Mentorlar" },
      { to: "/calm", icon: Heart, label: "Tinchlik" },
      { to: "/identity-quiz", icon: ClipboardList, label: "Identity Quiz" },
    ],
  },
  {
    key: "analytics", icon: BarChart3, label: "Tahlil",
    items: [
      { to: "/analytics", icon: BarChart3, label: "Statistika" },
      { to: "/life-score", icon: Radar, label: "Life Score" },
      { to: "/trajectory", icon: LineChart, label: "Trayektoriya" },
      { to: "/time-leak", icon: Clock, label: "Time Leak" },
      { to: "/outputs", icon: Target, label: "Natijalar" },
      { to: "/fail-log", icon: AlertOctagon, label: "Xatolar" },
      { to: "/root-cause", icon: Search, label: "Asosiy sabab" },
      { to: "/feedback", icon: ClipboardCheck, label: "Kunlik baho" },
    ],
  },
  {
    key: "habits", icon: ListChecks, label: "Odat & Kundalik",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/war-room", icon: Swords, label: "War Room" },
      { to: "/command", icon: Power, label: "Command" },
      { to: "/focus", icon: Lock, label: "Focus Lock" },
      { to: "/contracts", icon: FileSignature, label: "Shartnomalar" },
      { to: "/drills", icon: Zap, label: "Mashqlar" },
      { to: "/decision-hub", icon: Brain, label: "Decision Hub" },
      { to: "/wins", icon: Award, label: "Yutuqlar" },
    ],
  },
  {
    key: "mentor", icon: Bot, label: "AI Mentor",
    direct: "/ai-mentor",
    items: [],
  },
  {
    key: "friends", icon: Users, label: "Do'stlar",
    items: [
      { to: "/community", icon: Users, label: "Jamiyat" },
      { to: "/buddies", icon: UserPlus, label: "Do'stlar" },
      { to: "/duels", icon: Swords, label: "Duels" },
      { to: "/leaderboard", icon: Trophy, label: "Reyting" },
    ],
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const activeTab = TABS.find(t =>
    t.direct === pathname || t.items.some(i => i.to === pathname),
  )?.key;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="absolute bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-base">
                {TABS.find(t => t.key === open)?.label}
              </h3>
              <button onClick={() => setOpen(null)} className="p-1 rounded hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TABS.find(t => t.key === open)?.items.map(it => {
                const isActive = pathname === it.to;
                return (
                  <Link key={it.to} to={it.to} onClick={() => setOpen(null)}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm transition-colors ${isActive ? "bg-primary/15 text-primary font-semibold" : "bg-muted/40 text-foreground hover:bg-muted"}`}>
                    <it.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-[55] bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-6">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            const handleClick = () => {
              if (tab.direct) {
                window.location.href = tab.direct;
              } else {
                setOpen(o => o === tab.key ? null : tab.key);
              }
            };
            if (tab.direct) {
              return (
                <Link key={tab.key} to={tab.direct}
                  className={`flex flex-col items-center justify-center py-2 px-1 gap-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] leading-tight font-medium truncate max-w-full">{tab.label}</span>
                </Link>
              );
            }
            return (
              <button key={tab.key} onClick={handleClick}
                className={`flex flex-col items-center justify-center py-2 px-1 gap-0.5 ${isActive || open === tab.key ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[9px] leading-tight font-medium truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
      {/* spacer to prevent content being hidden */}
      <div className="h-16" aria-hidden />
    </>
  );
}