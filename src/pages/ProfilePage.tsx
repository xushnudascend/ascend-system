import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import TopBar from "@/components/TopBar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User as UserIcon, Trophy, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav("/auth"); return; }
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      setProfile(data ?? { display_name: "", bio: "", goals: "", country: "" });
      setLoading(false);
    })();
  }, [user, authLoading]);

  const save = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: profile.display_name,
      bio: profile.bio, goals: profile.goals, country: profile.country,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Xato", description: error.message, variant: "destructive" });
    else toast({ title: "Saqlandi" });
  };

  if (loading || authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 glow-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold">{profile?.display_name || "Anonim"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat icon={<Trophy className="w-4 h-4" />} label="Rank" value={profile?.rank ?? "Beginner"} />
            <Stat icon={<Flame className="w-4 h-4" />} label="Streak" value={`${profile?.streak ?? 0}`} />
            <Stat icon={<Zap className="w-4 h-4" />} label="XP" value={`${profile?.xp ?? 0}`} />
          </div>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Field label="Ism">
            <input value={profile?.display_name ?? ""} onChange={e => setProfile({ ...profile, display_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </Field>
          <Field label="Mamlakat">
            <input value={profile?.country ?? ""} onChange={e => setProfile({ ...profile, country: e.target.value })} placeholder="Uzbekistan"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </Field>
          <Field label="Bio">
            <textarea value={profile?.bio ?? ""} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3}
              placeholder="O'zingiz haqingizda..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </Field>
          <Field label="Maqsadlar">
            <textarea value={profile?.goals ?? ""} onChange={e => setProfile({ ...profile, goals: e.target.value })} rows={3}
              placeholder="Asosiy maqsadlaringiz..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none" />
          </Field>
          <button onClick={save} disabled={saving}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="text-center p-3 rounded-xl bg-background border border-border">
    <div className="flex justify-center text-primary mb-1">{icon}</div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-heading font-bold">{value}</p>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
    {children}
  </div>
);
