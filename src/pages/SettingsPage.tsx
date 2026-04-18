import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Bell, MessageSquare, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/TopBar";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    telegram_chat_id: "", email_reminders: true, telegram_reminders: false,
    reminder_hour: 8, language: "uz", theme: "dark",
  });

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setPrefs({
        telegram_chat_id: data.telegram_chat_id || "",
        email_reminders: data.email_reminders, telegram_reminders: data.telegram_reminders,
        reminder_hour: data.reminder_hour, language: data.language, theme: data.theme,
      });
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("user_preferences").upsert({
      user_id: user!.id, ...prefs,
    });
    if (error) toast({ title: "Xatolik", description: error.message, variant: "destructive" });
    else toast({ title: "Saqlandi" });
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="font-heading text-2xl font-bold">Sozlamalar</h1>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-heading font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Bildirishnomalar</h2>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm">Email eslatmalari (har kuni)</span>
            <input type="checkbox" checked={prefs.email_reminders}
              onChange={e => setPrefs(p => ({ ...p, email_reminders: e.target.checked }))}
              className="w-5 h-5 accent-primary" />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm">Telegram eslatmalari</span>
            <input type="checkbox" checked={prefs.telegram_reminders}
              onChange={e => setPrefs(p => ({ ...p, telegram_reminders: e.target.checked }))}
              className="w-5 h-5 accent-primary" />
          </label>

          {prefs.telegram_reminders && (
            <div>
              <label className="text-xs text-muted-foreground flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Telegram chat ID</label>
              <input value={prefs.telegram_chat_id}
                onChange={e => setPrefs(p => ({ ...p, telegram_chat_id: e.target.value }))}
                placeholder="@AscendBot ga /start yuboring va ID oling"
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
              <p className="text-[10px] text-muted-foreground mt-1">Telegram'da @AscendReminderBot ga yozing va sizga ID beradi.</p>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground">Eslatma vaqti (soat)</label>
            <input type="number" min={0} max={23} value={prefs.reminder_hour}
              onChange={e => setPrefs(p => ({ ...p, reminder_hour: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
          </div>
        </motion.section>

        <button onClick={save} disabled={saving}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Saqlash</>}
        </button>
      </div>
    </div>
  );
}
