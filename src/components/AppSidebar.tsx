import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Library, BarChart3, Users, Trophy,
  User as UserIcon, MessageCircle, Crown, UserPlus, Settings, Brain,
  Heart, Sparkles, Power, Lock, Zap,
  Activity, Clock, Target, AlertOctagon, Swords, LineChart, CalendarClock,
  FileSignature, Search, ClipboardCheck, Dumbbell, Apple, ClipboardList,
  Radar, Award, ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Props { onClose?: () => void }

export default function AppSidebar({ onClose }: Props) {
  const { t } = useI18n();
  const loc = useLocation();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role","admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const groups: { label: string; items: { to: string; icon: any; label: string }[] }[] = [
    {
      label: t("dashboard"),
      items: [
        { to: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
        { to: "/war-room", icon: Swords, label: "War Room" },
        { to: "/identity-quiz", icon: ClipboardList, label: "Identity Quiz" },
        { to: "/life-score", icon: Radar, label: "Life Score" },
        { to: "/health", icon: Heart, label: "Health & Energy" },
        { to: "/analytics", icon: BarChart3, label: t("analytics") },
        { to: "/trajectory", icon: LineChart, label: "Trajectory" },
        { to: "/feedback", icon: ClipboardCheck, label: "Daily Feedback" },
      ],
    },
    {
      label: "Body",
      items: [
        { to: "/workouts", icon: Dumbbell, label: "Workouts & Sport" },
        { to: "/nutrition", icon: Apple, label: "Nutrition" },
      ],
    },
    {
      label: "Discipline",
      items: [
        { to: "/decision-hub", icon: Brain, label: t("decisionEngine") },
        { to: "/command", icon: Power, label: "Command" },
        { to: "/focus", icon: Lock, label: "Focus Lock" },
        { to: "/contracts", icon: FileSignature, label: "Contracts" },
        { to: "/root-cause", icon: Search, label: "Root Cause" },
        { to: "/drills", icon: Zap, label: "Drills" },
      ],
    },
    {
      label: "Tracking",
      items: [
        { to: "/time-leak", icon: Clock, label: "Time Leak" },
        { to: "/outputs", icon: Target, label: "Outputs" },
        { to: "/fail-log", icon: AlertOctagon, label: "Fail Log" },
        { to: "/duels", icon: Swords, label: "Duels" },
      ],
    },
    {
      label: t("sections"),
      items: [
        { to: "/courses", icon: BookOpen, label: t("courses") },
        { to: "/books", icon: Library, label: t("books") },
        { to: "/methods", icon: Beaker, label: t("methods") },
        { to: "/calm", icon: Heart, label: t("calm") },
        { to: "/characters", icon: Sparkles, label: t("characters") },
      ],
    },
    {
      label: t("community"),
      items: [
        { to: "/community", icon: Users, label: t("community") },
        { to: "/wins", icon: Award, label: "Wins Wall" },
        { to: "/buddies", icon: UserPlus, label: t("buddies") },
        { to: "/leaderboard", icon: Trophy, label: t("leaderboard") },
        { to: "/ai-mentor", icon: MessageCircle, label: t("aiMentor") },
      ],
    },
    {
      label: t("profile"),
      items: [
        { to: "/profile", icon: UserIcon, label: t("profile") },
        { to: "/pricing", icon: Crown, label: t("pricing") },
        { to: "/settings", icon: Settings, label: t("settings") },
        ...(isAdmin ? [{ to: "/admin", icon: ShieldCheck, label: t("admin") }] : []),
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-card border-r border-border w-72">
      <div className="px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
        <Link to="/dashboard" onClick={onClose} className="font-heading text-xl font-bold">
          ASCEND<span className="text-primary">.</span>
        </Link>
        <p className="text-[11px] text-muted-foreground mt-0.5">Behavior OS</p>
      </div>
      <nav className="p-3 space-y-5">
        {groups.map(g => (
          <div key={g.label}>
            <div className="px-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{g.label}</div>
            <div className="space-y-0.5">
              {g.items.map(it => {
                const active = loc.pathname === it.to;
                return (
                  <Link key={it.to} to={it.to} onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <it.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{it.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}