import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, UserPlus, Check, X, Users, MapPin, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";

interface Suggestion {
  user_id: string;
  display_name: string | null;
  country: string | null;
  goals: string | null;
  rank: string;
  xp: number;
  match_score: number;
}

interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: string;
  profile?: { display_name: string | null; country: string | null };
}

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [{ data: me }, { data: profiles }, { data: fs }] = await Promise.all([
      supabase.from("profiles").select("country,goals").eq("user_id", user!.id).maybeSingle(),
      supabase.from("profiles").select("user_id,display_name,country,goals,rank,xp").neq("user_id", user!.id).limit(50),
      supabase.from("friendships").select("*").or(`requester_id.eq.${user!.id},addressee_id.eq.${user!.id}`),
    ]);

    setFriendships(fs || []);

    const existingIds = new Set((fs || []).flatMap(f => [f.requester_id, f.addressee_id]));
    const myCountry = me?.country?.toLowerCase() || "";
    const myGoals = (me?.goals || "").toLowerCase().split(/[\s,]+/).filter(Boolean);

    const scored: Suggestion[] = (profiles || [])
      .filter(p => !existingIds.has(p.user_id))
      .map(p => {
        let score = 0;
        if (myCountry && p.country?.toLowerCase() === myCountry) score += 50;
        const theirGoals = (p.goals || "").toLowerCase();
        myGoals.forEach(g => { if (g.length > 2 && theirGoals.includes(g)) score += 15; });
        return { ...p, match_score: score };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 20);

    setSuggestions(scored);
    setLoading(false);
  };

  const sendRequest = async (addresseeId: string) => {
    const { error } = await supabase.from("friendships").insert({
      requester_id: user!.id, addressee_id: addresseeId, status: "pending",
    });
    if (error) toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    else { toast({ title: "So'rov yuborildi" }); loadAll(); }
  };

  const respond = async (id: string, status: "accepted" | "blocked") => {
    await supabase.from("friendships").update({ status }).eq("id", id);
    loadAll();
  };

  const incoming = friendships.filter(f => f.addressee_id === user?.id && f.status === "pending");
  const accepted = friendships.filter(f => f.status === "accepted");

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> Do'stlar
        </h1>

        {incoming.length > 0 && (
          <section>
            <h2 className="font-heading text-sm font-semibold mb-3 text-muted-foreground">SO'ROVLAR ({incoming.length})</h2>
            <div className="space-y-2">
              {incoming.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-sm">Foydalanuvchi sizga so'rov yubordi</span>
                  <div className="flex gap-2">
                    <button onClick={() => respond(f.id, "accepted")} className="p-2 rounded-lg bg-success/10 text-success"><Check className="w-4 h-4" /></button>
                    <button onClick={() => respond(f.id, "blocked")} className="p-2 rounded-lg bg-destructive/10 text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-heading text-sm font-semibold mb-3 text-muted-foreground">DO'STLAR ({accepted.length})</h2>
          {accepted.length === 0 ? <p className="text-sm text-muted-foreground">Hali do'stingiz yo'q.</p> : (
            <div className="space-y-2">{accepted.map(f => <div key={f.id} className="p-3 rounded-xl border border-border bg-card text-sm">Do'st</div>)}</div>
          )}
        </section>

        <section>
          <h2 className="font-heading text-sm font-semibold mb-3 text-muted-foreground">TAVSIYALAR — maqsad va manzilingizga mos</h2>
          <div className="space-y-2">
            {suggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Hali tavsiyalar yo'q. Profilizga maqsadlar va manzilni kiriting.</p>
            ) : suggestions.map((s, i) => (
              <motion.div key={s.user_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-heading font-bold text-primary">
                  {(s.display_name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{s.display_name || "Anonim"}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{s.rank}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {s.country && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{s.country}</span>}
                    {s.match_score > 0 && <span className="flex items-center gap-0.5 text-success"><Target className="w-3 h-3" />{s.match_score}% mos</span>}
                    <span>{s.xp} XP</span>
                  </div>
                </div>
                <button onClick={() => sendRequest(s.user_id)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                  <UserPlus className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
