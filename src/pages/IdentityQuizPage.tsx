import { useState } from "react";
import TopBar from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";

const questions = [
  { dim: 'discipline', q: 'Kunda ertalab rejani bajaraman' },
  { dim: 'discipline', q: 'Berilgan so\'zimda turaman' },
  { dim: 'focus', q: 'Bir vazifaga 60+ daqiqa fokus qila olaman' },
  { dim: 'focus', q: 'Telefon ko\'p chalg\'itmaydi' },
  { dim: 'social', q: 'Notanish odam bilan suhbat boshlay olaman' },
  { dim: 'social', q: 'Yo\'q deb ayta olaman' },
  { dim: 'fitness', q: 'Haftada 3+ marta sport qilaman' },
  { dim: 'fitness', q: 'Energiyam baland (10/10)' },
  { dim: 'money', q: 'Daromadim va xarajatim aniq' },
  { dim: 'money', q: 'Oyiga jamg\'arma qilaman' },
  { dim: 'dopamine', q: 'Ijtimoiy tarmoqsiz 24 soat tura olaman' },
  { dim: 'dopamine', q: 'Tezkor zavqdan ko\'ra uzoq mukofotni tanlayman' },
];

export default function IdentityQuizPage() {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState<any>(null);

  function setAns(i: number, v: number) { setAnswers(a => ({ ...a, [i]: v })); }

  async function submit() {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Hamma savollarga javob bering');
      return;
    }
    const dims: Record<string, { sum: number; n: number }> = {};
    questions.forEach((q, i) => {
      dims[q.dim] = dims[q.dim] || { sum: 0, n: 0 };
      dims[q.dim].sum += answers[i] * 20; // 1..5 → 20..100
      dims[q.dim].n += 1;
    });
    const scores: any = {};
    Object.keys(dims).forEach(k => scores[`${k}_score`] = Math.round(dims[k].sum / dims[k].n));
    const avg = Object.values(scores).reduce((a:number,b:any)=>a+(b as number),0) / 6;
    const profile_type = avg >= 80 ? 'Apex' : avg >= 60 ? 'Disciplined' : avg >= 40 ? 'Builder' : 'Beginner';
    const sortedDims = Object.entries(scores).sort(([,a]:any,[,b]:any)=>b-a);
    const strengths = sortedDims.slice(0,2).map(([k])=>k.replace('_score','')).join(', ');
    const weaknesses = sortedDims.slice(-2).map(([k])=>k.replace('_score','')).join(', ');
    const roadmap = `30 kun: ${weaknesses} ustida ishlash. ${strengths} darajasini saqlash.`;

    if (!user) { setDone({ ...scores, profile_type, strengths, weaknesses, roadmap, avg }); return; }
    const { data, error } = await supabase.from('assessments').insert({
      user_id: user.id, ...scores, profile_type, strengths, weaknesses, roadmap
    }).select().single();
    if (error) toast.error(error.message); else { toast.success('Saqlandi'); setDone({ ...data, avg }); }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="p-6">
            <h1 className="text-2xl font-heading font-bold mb-2">Profil: <span className="text-primary">{done.profile_type}</span></h1>
            <p className="text-sm text-muted-foreground mb-4">O'rtacha ball: {Math.round(done.avg)}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['discipline','focus','social','fitness','money','dopamine'].map(k => (
                <div key={k} className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs uppercase text-muted-foreground">{k}</div>
                  <div className="text-2xl font-bold">{done[`${k}_score`]}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Kuchli:</span> <b className="capitalize">{done.strengths}</b></div>
              <div><span className="text-muted-foreground">Zaif:</span> <b className="capitalize">{done.weaknesses}</b></div>
              <div className="mt-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <div className="text-xs uppercase text-primary mb-1">30 kun yo'l</div>
                {done.roadmap}
              </div>
            </div>
            <Button className="mt-5 w-full" onClick={()=>{setDone(null); setAnswers({});}}>Qayta o'tish</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-heading font-bold">Identity Assessment</h1>
        </div>
        <p className="text-muted-foreground mb-6">12 savol. Har biri 1 (umuman to'g'ri emas) — 5 (mutlaqo to'g'ri).</p>
        <div className="space-y-3">
          {questions.map((q,i)=>(
            <Card key={i} className="p-4">
              <p className="text-sm mb-3">{i+1}. {q.q}</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={()=>setAns(i,v)}
                    className={`flex-1 py-2 rounded text-sm font-semibold border ${answers[i]===v?'bg-primary text-primary-foreground border-primary':'border-border hover:bg-muted'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <Button className="mt-6 w-full" onClick={submit}>Natijani ko'rish</Button>
      </div>
    </div>
  );
}