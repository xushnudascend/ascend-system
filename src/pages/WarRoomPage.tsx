import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Swords, Check } from "lucide-react";

export default function WarRoomPage() {
  const { user } = useAuth();
  const [mission, setMission] = useState('');
  const [enemy, setEnemy] = useState('');
  const [highRoi, setHighRoi] = useState('');
  const [avoid, setAvoid] = useState('');
  const [done, setDone] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0,10);

  useEffect(()=>{ if (user) load(); }, [user]);
  async function load() {
    const { data } = await supabase.from('war_room').select('*').eq('user_id', user!.id).eq('log_date', today).maybeSingle();
    if (data) { setMission(data.mission); setEnemy(data.enemy||''); setHighRoi(data.high_roi||''); setAvoid(data.avoid||''); setDone(data.done); setId(data.id); }
  }

  async function save(markDone=false) {
    if (!user) return;
    if (!mission.trim()) { toast.error('Asosiy missiyani yozing'); return; }
    const payload = { user_id: user.id, log_date: today, mission, enemy, high_roi: highRoi, avoid, done: markDone || done };
    const { error } = await supabase.from('war_room').upsert(payload, { onConflict: 'user_id,log_date' });
    if (error) toast.error(error.message); else { toast.success(markDone?'Bugun yutdingiz':'Saqlandi'); if (markDone) setDone(true); load(); }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Daily War Room</h1>
        </div>
        <p className="text-muted-foreground mb-6">Bugungi jang. 1 missiya. 1 dushman. 1 yuqori ROI. 1 qochish.</p>

        <Card className="p-5 space-y-4">
          <div>
            <label className="text-xs uppercase text-muted-foreground">Bugungi missiya *</label>
            <Input value={mission} onChange={e=>setMission(e.target.value)} placeholder="2 soat deep work — projectni tugatish"/>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground">Eng katta dushman</label>
            <Input value={enemy} onChange={e=>setEnemy(e.target.value)} placeholder="Telefon, Instagram"/>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground">Eng yuqori ROI vazifa</label>
            <Input value={highRoi} onChange={e=>setHighRoi(e.target.value)} placeholder="Mijozga taklif yuborish"/>
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground">Qochish kerak</label>
            <Textarea value={avoid} onChange={e=>setAvoid(e.target.value)} placeholder="YouTube, kechki shirinlik" rows={2}/>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={()=>save(false)}>Saqlash</Button>
            <Button className="flex-1" onClick={()=>save(true)} disabled={done}>
              <Check className="w-4 h-4 mr-1"/>{done?'Bugun yutdingiz':'Bajardim'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}