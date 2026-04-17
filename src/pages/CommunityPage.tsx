import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import TopBar from "@/components/TopBar";
import { Heart, Send, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string; user_id: string; content: string; category: string;
  likes_count: number; created_at: string;
  profiles?: { display_name: string | null; rank: string };
  liked?: boolean;
}

const categories = ["general", "sport", "finance", "mental", "discipline", "win"];

export default function CommunityPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(100);
    if (!postsData) { setLoading(false); return; }
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profilesData } = await supabase.from("profiles").select("user_id, display_name, rank").in("user_id", userIds);
    const profileMap = new Map((profilesData ?? []).map(p => [p.user_id, p]));

    let likedSet = new Set<string>();
    if (user) {
      const { data: likes } = await supabase.from("post_likes").select("post_id").eq("user_id", user.id);
      likedSet = new Set((likes ?? []).map(l => l.post_id));
    }

    setPosts(postsData.map(p => ({
      ...p,
      profiles: profileMap.get(p.user_id) as any,
      liked: likedSet.has(p.id),
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!user) { toast({ title: "Avval kiring", variant: "destructive" }); return; }
    if (!content.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("posts").insert({ user_id: user.id, content: content.trim(), category });
    setPosting(false);
    if (error) { toast({ title: "Xato", description: error.message, variant: "destructive" }); return; }
    setContent("");
    load();
  };

  const toggleLike = async (post: Post) => {
    if (!user) return;
    if (post.liked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: user.id });
    }
    setPosts(prev => prev.map(p => p.id === post.id
      ? { ...p, liked: !post.liked, likes_count: post.likes_count + (post.liked ? -1 : 1) }
      : p));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-xl font-bold">{t("community")}</h1>
        </div>

        {user && (
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t("write")} rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" />
            <div className="flex items-center justify-between gap-2">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={submit} disabled={posting || !content.trim()}
                className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1 disabled:opacity-50">
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {t("post")}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("noPosts")}</p>
        ) : (
          posts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-heading font-bold text-primary">
                    {(p.profiles?.display_name ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.profiles?.display_name ?? "Anonim"}</p>
                    <p className="text-xs text-muted-foreground">{p.profiles?.rank ?? "Beginner"} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{p.category}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.content}</p>
              <button onClick={() => toggleLike(p)} disabled={!user}
                className={`mt-3 flex items-center gap-1 text-xs ${p.liked ? "text-destructive" : "text-muted-foreground"} hover:text-destructive transition-colors`}>
                <Heart className={`w-4 h-4 ${p.liked ? "fill-current" : ""}`} /> {p.likes_count}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
