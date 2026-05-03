import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Users, Activity, FileSignature, AlertOctagon, MessageSquare, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stats {
  total_users: number;
  new_users_today: number;
  new_users_7d: number;
  active_today: number;
  habits_logged_today: number;
  posts_total: number;
  posts_today: number;
  contracts_active: number;
  fails_today: number;
  top_habits: { name: string; logs: number }[];
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav("/auth"); return; }
    (async () => {
      const { data, error } = await supabase.rpc("admin_stats");
      if (error) setError(error.message);
      else setStats(data as unknown as Stats);
      setLoading(false);
    })();
  }, [user, authLoading, nav]);

  if (loading) return (
    <div className="min-h-screen bg-background"><TopBar />
      <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background"><TopBar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-heading text-2xl font-bold mb-2">Admin</h1>
        <p className="text-destructive text-sm">Ruxsat yo'q. Faqat admin foydalanuvchilar ko'ra oladi.</p>
        <p className="text-xs text-muted-foreground mt-2">{error}</p>
      </div>
    </div>
  );

  const cards = [
    { label: "Jami foydalanuvchilar", value: stats?.total_users ?? 0, icon: Users, color: "text-primary" },
    { label: "Bugun ro'yxatdan", value: stats?.new_users_today ?? 0, icon: TrendingUp, color: "text-success" },
    { label: "7 kunda yangi", value: stats?.new_users_7d ?? 0, icon: TrendingUp, color: "text-primary" },
    { label: "Bugun faol", value: stats?.active_today ?? 0, icon: Activity, color: "text-success" },
    { label: "Bugun odat-loglar", value: stats?.habits_logged_today ?? 0, icon: Activity, color: "text-primary" },
    { label: "Aktiv shartnomalar", value: stats?.contracts_active ?? 0, icon: FileSignature, color: "text-warning" },
    { label: "Bugun fail", value: stats?.fails_today ?? 0, icon: AlertOctagon, color: "text-destructive" },
    { label: "Postlar (jami)", value: stats?.posts_total ?? 0, icon: MessageSquare, color: "text-primary" },
    { label: "Bugun postlar", value: stats?.posts_today ?? 0, icon: MessageSquare, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="font-heading text-3xl font-bold">Admin paneli</h1>
          <p className="text-muted-foreground text-sm mt-1">Real vaqt foydalanuvchi statistikasi</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {cards.map(c => (
            <div key={c.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <c.icon className={`w-4 h-4 ${c.color}`} />
                <span className="text-[10px] uppercase text-muted-foreground">{c.label}</span>
              </div>
              <div className="font-heading text-2xl font-bold">{c.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-heading font-bold mb-3 text-sm">Top 5 odat (7 kun)</h2>
          {(stats?.top_habits ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">Ma'lumot yo'q</p>
          ) : (
            <ul className="space-y-2">
              {stats!.top_habits.map((h, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="truncate">{i + 1}. {h.name}</span>
                  <span className="text-primary font-semibold">{h.logs}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          O'zingizni admin qilish uchun: Lovable Cloud → SQL editorda <code>insert into user_roles(user_id, role) values ('SIZNING_USER_ID', 'admin');</code>
        </p>
      </main>
    </div>
  );
}