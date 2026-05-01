import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

export default function WinsWallPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [wins, setWins] = useState<any[]>([]);

  useEffect(()=>{ load(); }, []);
  async function load() {
    const { data } = await supabase.from('wins_wall').select('*, profiles!inner(display_name)').eq('is_public', true).order('created_at',{ascending:false}).limit(50);
    setWins((data as any) || []);
  }
  async function post() {
    if (!user) { toast.error('Login qiling'); return; }
    if (!title.trim()) return;
    const { error } = await supabase.from('wins_wall').insert({ user_id: user.id, title, body, is_public: true });
    if (error) toast.error(error.message); else { setTitle(''); setBody(''); toast.success('Devorda'); load(); }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Wins Wall</h1>
        </div>
        <p className="text-muted-foreground mb-6">Yutuq devori. Boshqalar ko'radi.</p>

        {user && (
          <Card className="p-4 mb-4">
            <Input className="mb-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Yutuq sarlavhasi: 30 kun streak"/>
            <Textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Tafsilot (ixtiyoriy)" rows={2}/>
            <Button className="mt-2 w-full" onClick={post}>E'lon qilish</Button>
          </Card>
        )}

        <div className="space-y-3">
          {wins.length===0 && <p className="text-sm text-muted-foreground text-center py-8">Hali yutuq yo'q. Birinchi bo'ling.</p>}
          {wins.map(w => (
            <Card key={w.id} className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h3 className="font-semibold">{w.title}</h3>
                  {w.body && <p className="text-sm text-muted-foreground mt-1">{w.body}</p>}
                  <p className="text-xs text-muted-foreground mt-2">— {w.profiles?.display_name || 'Anon'}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(w.created_at).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}