import type { Course, Lesson } from "./courses";

const mk = (id:string, title:string, category:Course['category'], emoji:string, desc:string, level:Course['level'], lessons: Lesson[]):Course => ({id, title, category, emoji, description: desc, duration: lessons.length, level, lessons});
const gen = (n: number, makeT:(i:number)=>string, makeTask:(i:number)=>string, tip:string): Lesson[] =>
  Array.from({length:n},(_,i)=>({day:i+1,title:makeT(i),task:makeTask(i),tip}));

// 65 NEW COURSES to push library past 100
export const coursesExtra: Course[] = [
  // SAT / University prep (5)
  mk('uni-sat','SAT 30 Day Sprint','learning','📐','Score boost: math + reading + writing.','intermediate',
    gen(30,(i)=>`Day ${i+1}: ${['Math','Reading','Writing','Mixed'][i%4]} block`,(i)=>`Solve 25 ${['math','reading','grammar','full'][i%4]} questions, review every wrong answer.`,'Process > result.')),
  mk('uni-harvard','Harvard Application Prep','learning','🎓','60 days to a strong app.','advanced',
    gen(60,(i)=>`Day ${i+1}: ${['Essay draft','Activity log','Recommender plan','Interview prep'][i%4]}`,(i)=>'30 min focused work on your application.','Specificity wins.')),
  mk('uni-mit','MIT STEM Foundations','learning','🛠️','45 days of physics + math + code.','advanced',
    gen(45,(i)=>`Day ${i+1}: ${['Calculus','Linear algebra','Physics','Python'][i%4]}`,(i)=>'1 hour deep work + 5 problems.','Build proofs, not memory.')),
  mk('uni-stanford','Stanford CS Mindset','learning','💻','30 day CS warmup.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>`Solve 2 LeetCode + read 1 CS paper section.`,'Reps build intuition.')),
  mk('uni-toefl','TOEFL 21 Day Push','learning','🌐','Reading, listening, speaking, writing.','intermediate',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'1 reading + 1 listening + 5 min speaking + 1 essay.','Track score weekly.')),

  // Bodybuilding 0 → competition (3)
  mk('bb-zero','Bodybuilding 0 → Stage','fitness','🏆','120 day path to first competition.','advanced',
    gen(120,(i)=>`Day ${i+1}: ${['Push','Pull','Legs','Rest','Cardio'][i%5]}`,(i)=>i%5===3?'Active rest + protein + sleep 8h.':'45–60 min lift + 30 g protein post.','Volume + recovery + tracking.')),
  mk('bb-physique','Aesthetic Physique 90','fitness','💪','90 days, lean look.','intermediate',
    gen(90,(i)=>`Day ${i+1}: ${['Upper','Lower','Arms','Core','Cardio'][i%5]}`,(i)=>'45 min training + macro tracking.','Surplus 200 cal, protein 1.8g/kg.')),
  mk('bb-strength','Powerlifting 5x5','fitness','🏋️','12 week strength.','intermediate',
    gen(84,(i)=>`Day ${i+1}: ${['Squat','Bench','Deadlift','Rest'][i%4]}`,(i)=>i%4===3?'Rest day. Mobility 15 min.':'5x5 main lift + 3 accessories.','Add 2.5 kg weekly.')),

  // Running (3)
  mk('run-5k','5K in 6 Weeks','fitness','🏃','Couch to 5K.','beginner',
    gen(42,(i)=>`Day ${i+1}`,(i)=>i%2===0?'Run/walk intervals 25 min.':'Recovery walk 20 min + stretch.','Form before pace.')),
  mk('run-10k','10K Builder','fitness','🏃‍♂️','8 weeks.','intermediate',
    gen(56,(i)=>`Day ${i+1}`,(i)=>i%3===0?'Long run.':'Easy 5 km or rest.','Heart rate zone 2.')),
  mk('run-marathon','Marathon Prep 16w','fitness','🏅','From 10K to 42K.','advanced',
    gen(112,(i)=>`Day ${i+1}`,(i)=>'Follow the weekly plan: long run, tempo, intervals, rest.','Fuel and shoes matter.')),

  // Mindset / Mental (8)
  mk('mind-grit','Grit Builder','mindset','🪨','30 days of hard things.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Do 1 thing today you really do not want to do.','Discomfort is the dose.')),
  mk('mind-focus','Attention Reset','mindset','🎯','21 days, no doomscroll.','beginner',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'Block social apps from 7am to 7pm. Track urges.','Urges peak then fade.')),
  mk('mind-emot','Emotional Mastery','mindset','🧊','30 days.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Name the emotion before you act. Wait 60 sec.','Name it to tame it.')),
  mk('mind-rejection','Rejection Therapy','mindset','🚪','30 days, ask & lose.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Make 1 ask you expect to be rejected on.','Rejection is data.')),

  // Productivity (8)
  mk('prod-2hour','2-Hour Power Block','productivity','⚡','21 days, 1 deep block daily.','intermediate',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'2 uninterrupted hours on your top priority before noon.','Phone in another room.')),
  mk('prod-inbox','Inbox Zero','productivity','📥','7 days.','beginner',
    gen(7,(i)=>`Day ${i+1}`,(i)=>'Process inbox to zero in 20 min. Reply, archive, delete.','Decide once.')),
  mk('prod-week','Weekly Review','productivity','📅','12 weeks.','beginner',
    gen(84,(i)=>`Week day ${i+1}`,(i)=>i%7===6?'Full weekly review: wins, misses, next 3 priorities.':'Daily 5-min plan and shutdown.','Plan tomorrow tonight.')),
  mk('prod-system','Build Your Second Brain','productivity','🧠','30 days note system.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Capture 3 ideas, organize daily, distill weekly.','PARA method.')),
  mk('prod-eat','Eat the Frog','productivity','🐸','21 days.','beginner',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'Do the hardest task first thing in the morning.','Win the morning.')),
  mk('prod-batch','Batch & Block','productivity','🧱','14 days.','intermediate',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'Batch similar tasks. Time-block calendar.','Switching kills focus.')),
  mk('prod-notion','Notion OS Setup','productivity','📒','14 days.','beginner',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'Build one piece of your system today.','Use, then improve.')),
  mk('prod-shutdown','Shutdown Ritual','productivity','🌙','30 days.','beginner',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'5 min: review, list tomorrow, close laptop, say "shutdown complete".','Cal Newport method.')),

  // Finance (8)
  mk('fin-crypto','Crypto Basics','finance','₿','14 days.','intermediate',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'Read 20 min, never invest more than you can lose.','DCA, no hype.')),
  mk('fin-mindset','Wealth Mindset','finance','🧠','30 days reading.','beginner',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Read 10 pages of a wealth classic + 1 reflection note.','Identity first.')),

  // Relationships (5)
  mk('rel-boundaries','Boundaries','relationships','🚧','14 days.','intermediate',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'Say "no" once today without justifying.','No is a sentence.')),

  // Spirituality (4)
  mk('spi-stoic','Daily Stoic 30','spirituality','🏛️','30 days.','beginner',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Read 1 stoic passage + write 1 application for today.','Memento mori.')),
  mk('spi-faith','Faith Practice 21','spirituality','🕊️','21 days.','beginner',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'15 min prayer/scripture + 1 act of service.','Practice > belief.')),
  mk('spi-quiet','Quiet Time 14','spirituality','🌅','14 days.','beginner',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'15 min silence in the morning. No phone.','Silence speaks.')),
  mk('spi-purpose','Purpose Discovery','spirituality','✨','30 days.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Answer 1 purpose question in writing (3 paragraphs).','Slow down to see.')),

  // Leadership (4)
  mk('lead-write','Executive Writing','leadership','✍️','21 days.','intermediate',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'Write 1 short memo. BLUF (bottom line up front).','Brevity is power.')),
  mk('lead-meet','Better Meetings','leadership','📋','14 days.','beginner',
    gen(14,(i)=>`Day ${i+1}`,(i)=>'Every meeting: agenda, time-box, written outcome.','No agenda, no meeting.')),
  mk('lead-coach','Coaching Reps','leadership','🎯','30 days.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Ask 3 powerful questions instead of giving 1 answer.','Coach, do not tell.')),

  // Creativity (4)
  mk('cre-ship','Ship Daily','creativity','🚢','30 days, publish small.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Publish something tiny: tweet, sketch, demo.','Done > perfect.')),
  mk('cre-video','Daily Video 30','creativity','🎥','30 days short videos.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Post 1 short video. Track watch time.','Reps shape voice.')),
  mk('cre-design','Design 30','creativity','🎨','30 days UI reps.','intermediate',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Recreate 1 interface from a brand you admire.','Steal, then evolve.')),
  mk('cre-storytell','Storytelling','creativity','📖','21 days.','intermediate',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'Write 1 short story (300 words) using a fixed structure.','Structure frees.')),

  // Learning (5)
  mk('learn-deep','Deep Learning Project','learning','🧪','60 days.','advanced',
    gen(60,(i)=>`Day ${i+1}`,(i)=>'Build 1 ML mini-project step. Document.','Build > read.')),
  mk('learn-lang','Language in 90','learning','🌍','Daily reps.','intermediate',
    gen(90,(i)=>`Day ${i+1}`,(i)=>'15 min app + 15 min speaking out loud + 5 new words.','Speak from day 1.')),
  mk('learn-anki','Spaced Repetition 30','learning','🃏','Daily Anki.','beginner',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Review your deck + add 10 new cards.','Less is more.')),
  mk('learn-read','30 Books in 90 Days','learning','📚','Aggressive reading.','advanced',
    gen(90,(i)=>`Day ${i+1}`,(i)=>'30 pages + 3-line summary.','Compound notes.')),

  // Discipline extras (4)
  mk('disc-contract','7-Day Contract','discipline','🪪','Make and keep a binding contract.','intermediate',
    gen(7,(i)=>`Day ${i+1}`,(i)=>'Hit your stated daily target. Log proof.','Stake creates honesty.')),
  mk('disc-monk2','Silent Day','discipline','🤐','7 day silence weekend.','intermediate',
    gen(7,(i)=>`Day ${i+1}`,(i)=>'No social media, minimal speech, journaling 30 min.','Quiet sharpens.')),
  mk('disc-walk','10K Steps Daily','discipline','🚶','30 days.','beginner',
    gen(30,(i)=>`Day ${i+1}`,(i)=>'Hit 10,000 steps. Walk meetings count.','Move daily.')),
  mk('disc-water','Hydration 21','discipline','💧','3 L daily.','beginner',
    gen(21,(i)=>`Day ${i+1}`,(i)=>'Drink 3 L of water. First glass before coffee.','Hydration = focus.')),

  // ======== NEW PRACTICAL COURSES ========
  mk('body-posture','To\'g\'ri Tana Tutilishi','fitness','🧍','21 kun — bel/elka og\'rig\'iga qarshi.','beginner',
    gen(21,(i)=>`Kun ${i+1}`,(i)=>'5 daq stretching: ko\'krak ochish, bel cho\'zish, yelka aylana. Kun davomida 3 marta tana holatini tekshiring.','Telefonni ko\'z balandligida ushlang.')),
  mk('body-eyes','Ko\'z Salomatligi','fitness','👁️','14 kun — ekran charchog\'ini kamaytirish.','beginner',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'20-20-20 qoidasi: har 20 daqiqada 20 sek 20 fut uzoqqa qarang. 5 daq palming.','Tabiiy yorug\'lik — eng yaxshi.')),
  mk('body-breath','Nafas Mashqi','fitness','🌬️','14 kun — Box breathing & Wim Hof.','beginner',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'Ertalab: 4-4-4-4 nafas x 5 daq. Kechqurun: 30 chuqur nafas + 1 daq nafasni ushlash x 3.','Burun bilan, qorin bilan.')),
  mk('body-fasting','16:8 Intermittent Fasting','fitness','⏰','30 kun — vazn va energiya.','beginner',
    gen(30,(i)=>`Kun ${i+1}`,(i)=>'12:00–20:00 oralig\'ida ovqatlaning. Boshqa vaqt — suv, choy, qora qahva.','Sabr — birinchi 7 kun qiyin.')),
  mk('learn-coding','Dasturlash 0→1','learning','💻','60 kun — Python asoslari.','beginner',
    gen(60,(i)=>`Kun ${i+1}`,(i)=>'30 daq video + 30 daq mashq. Har hafta 1 ta mini loyiha.','Yozilmasa — o\'rganilmaydi.')),
  mk('learn-english','Ingliz Tili B1→B2','learning','🇬🇧','90 kun — gaplashish va o\'qish.','intermediate',
    gen(90,(i)=>`Kun ${i+1}`,(i)=>'15 daq podcast + 10 yangi so\'z (Anki) + 10 daq ovoz yozish.','Xato qilmasdan o\'rganilmaydi.')),
  mk('learn-public','Notiqlik Mashqi','learning','🎤','21 kun — qo\'rquvni yengish.','intermediate',
    gen(21,(i)=>`Kun ${i+1}`,(i)=>'5 daq video o\'zingizni gaplashayotgan holatda yozing. Tahlil qiling.','Reps > theory.')),
  mk('learn-negotiate','Muzokara Sanati','learning','🤝','14 kun — Chris Voss metodi.','intermediate',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'1 ta real muzokarada "tactical empathy" qo\'llang. Mirroring + labeling.','"No" — boshlash, oxir emas.')),
  mk('disc-digital','Raqamli Detoks','discipline','📵','30 kun — telefondan ozod.','beginner',
    gen(30,(i)=>`Kun ${i+1}`,(i)=>'Ekran vaqti < 2 soat. Yotoqxonada telefon yo\'q. Ertalab 1 soat telefonsiz.','Dofaminni qaytaring.')),
  mk('disc-promise','Va\'da Va Bajarish','discipline','🤞','14 kun — o\'zingga bergan so\'z.','beginner',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'Ertalab 3 ta kichik va\'da yozing. Kechqurun bajarganlaringizni belgilang. 100% maqsad.','Kichik — keyin katta.')),
  mk('mind-anxiety','Tashvishni Boshqarish','mindset','🌊','21 kun — CBT asoslari.','beginner',
    gen(21,(i)=>`Kun ${i+1}`,(i)=>'Tashvishli fikrni yozing → "dalil bormi?" → realistik javob. 5 daq nafas.','Fikr — fakt emas.')),
  mk('mind-self','O\'zini Anglash','mindset','🪞','30 kun — chuqur introspection.','intermediate',
    gen(30,(i)=>`Kun ${i+1}`,(i)=>'1 ta savol: kim men? nima istayman? nimadan qo\'rqaman? Yozing 15 daq.','Savol > javob.')),
  mk('prod-morning','Ideal Ertalab','productivity','☀️','21 kun — kuchli boshlanish.','beginner',
    gen(21,(i)=>`Kun ${i+1}`,(i)=>'5:30 turish → suv → 10 daq harakat → 10 daq journal → eng muhim 1 ta vazifa.','Ertalab — kun yutadi.')),
  mk('prod-evening','Kechki Ritual','productivity','🌙','14 kun — yaxshi uyqu uchun.','beginner',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'21:30: telefon o\'chiq. 22:00: kitob/journal. 22:30: yotoq. Ertangi rejani yozing.','Kechqurun — ertangi kun boshlanadi.')),
  mk('rel-listen','Aktiv Tinglash','relationships','👂','14 kun — chuqur muloqot.','beginner',
    gen(14,(i)=>`Kun ${i+1}`,(i)=>'1 suhbatda telefon yo\'q. So\'rang, kutib turing, qaytaring: "Sen aytdingki...".','Tinglash — sevish.')),
];
