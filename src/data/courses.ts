export interface Lesson {
  day: number;
  title: string;
  task: string;
  tip: string;
}
export interface Course {
  id: string;
  title: string;
  category: 'discipline'|'mindset'|'fitness'|'finance'|'productivity'|'relationships'|'learning'|'spirituality'|'leadership'|'creativity';
  emoji: string;
  description: string;
  duration: number; // days
  level: 'beginner'|'intermediate'|'advanced';
  lessons: Lesson[];
}

const mk = (id:string, title:string, category:Course['category'], emoji:string, desc:string, level:Course['level'], lessons: Lesson[]):Course => ({id, title, category, emoji, description: desc, duration: lessons.length, level, lessons});

// helper to generate filler-style lessons quickly with quality content
const days7 = (titles: string[], tasks: string[], tips: string[]): Lesson[] =>
  titles.map((t, i) => ({ day: i+1, title: t, task: tasks[i], tip: tips[i] }));

export const courses: Course[] = [
  // DISCIPLINE (15)
  mk('disc-foundation','Intizom Asoslari','discipline','🧱','7 kunda intizom poydevorini quring.','beginner', days7(
    ['Identity tanlash','Erta turish','Telefon detoks','Sport boshlash','Ovqat tartibi','Reja tuzish','Haftalik audit'],
    ['Bugun "Men intizomli odamman" deb yozing','Ertalab 6:00 da turing, alarmga "snooze" yo\'q','Ekran vaqti 1 soatga tushiring','20 daqiqa harakat qiling','Sahar ovqatdan keyin shakar yo\'q','Ertangi 3 ta asosiy vazifa yozib qo\'ying','Haftani 1-10 baholang, 1 ta xulosa'],
    ['Identity > goal','Snooze — birinchi mag\'lubiyat','Ekran = dofamin o\'g\'ri','Harakat = ruh holat','Shakar — yashirin dushman','3 dan ko\'p — chalg\'ish','Audit = o\'sish'])),
  mk('disc-30','30 Kunlik Spartan','discipline','🛡️','30 kunda yangi odam.','intermediate',
    Array.from({length:30}, (_,i) => ({day:i+1, title:`Kun ${i+1}: ${['Erta turish','Sovuq dush','Sport','O\'qish','Meditatsiya','Yozish','Tahlil'][i%7]}`, task:`Bugun ${['5:30 da turing','2 daqiqa sovuq dush','30 daqiqa harakat','30 sahifa o\'qish','10 daq meditatsiya','Journal yozing','Kunni baholang'][i%7]}`, tip:'Hech qanday bahona yo\'q.'}))),
  mk('disc-noexcuses','Bahonalar O\'limi','discipline','🚫','Bahonalardan butunlay voz keching.','intermediate', days7(
    ['Bahonalarni yozing','Real sabab toping','Identity sweep','Public commitment','Punishment system','Re-frame','Lock-in'],
    ['Oxirgi 10 ta bahonangizni yozing','Har bahonadan keyin "lekin asl sabab..."','3 ta narsani tashlang','Do\'stga 30 kunlik va\'da bering','Yiqilsangiz — 50 push-up','"Men qila olmayman" ni "men hali qilmayapman" ga aylantiring','Telefonda 30 kun reminder'],
    Array(7).fill('Bahona = past identitining ovozi'))),
  mk('disc-monk','Rohib Rejimi','discipline','🧘','30 kun minimal hayot.','advanced',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Social media yo\'q, faqat asosiy ovqat, 1 soat o\'qish, 1 soat sport, 8 soat ish.',tip:'Sukunat — o\'qituvchi.'}))),
  mk('disc-5am','5 AM Klubi','discipline','🌅','21 kunda erta turish odat bo\'ladi.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${i<7?'4:30':i<14?'5:00':'5:30'} da turish`,task:'Alarmni xonadan tashqariga qo\'ying. Turishdan 1 daqiqa sovuq suv yuviniş.',tip:'Birinchi 30 daqiqa — kun yutish.'}))),
  mk('disc-cold','Sovuq Dush 30 Kun','discipline','❄️','Wim Hof metodi.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${Math.min(30+i*5,180)} sek`,task:`${Math.min(30+i*5,180)} sekund sovuq dush`,tip:'Nafas — chuqur, sokin'}))),
  mk('disc-nofap','30 Kun Toza','discipline','🛑','Porno va o\'zo\'zinitinch yo\'q.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Triggerlardan saqlaning. Soliqlarni sport bilan almashtiring.',tip:'Energiya — qayta yo\'naltirish.'}))),
  mk('disc-nosugar','Shakarsiz 21 Kun','discipline','🍬','Shakar qaramligini sindirish.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Hech qanday qo\'shilgan shakar. Mevadan tabiiyni iste\'mol qiling.',tip:'Birinchi 7 kun — eng qiyin'}))),
  mk('disc-nophone','Telefonsiz Yakshanba','discipline','📵','4 hafta — 1 kun telefonsiz.','beginner',
    Array.from({length:4},(_,i)=>({day:i+1,title:`Hafta ${i+1}: To\'liq yakshanba`,task:'Yakshanba kuni ertalab 7 dan kechki 21 gacha telefon yo\'q.',tip:'Kitob, oila, tabiat.'}))),
  mk('disc-deepwork','Deep Work 14 Kun','discipline','🎯','Cal Newport metodi.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${Math.min(60+i*15,180)} daq deep work`,task:`Telefon o\'chiq, ${Math.min(60+i*15,180)} daqiqa fokus`,tip:'1 narsa, 1 vaqt'}))),
  mk('disc-pomodoro','Pomodoro Master','discipline','🍅','7 kun — 25/5 metodi.','beginner', days7(
    ['Tushunish','4 sikl','6 sikl','8 sikl','10 sikl','12 sikl','Audit'],
    ['1 sikl: 25 daq fokus + 5 daq dam','Bugun 4 sikl','6 sikl','8 sikl','10 sikl','12 sikl','Haftani baholang'],
    Array(7).fill('Telefonni boshqa xonaga qo\'ying'))),
  mk('disc-stoic','Stoik 21 Kun','discipline','🏛️','Marcus Aurelius uslubida kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Ertalab: "Bugun ahmoq odamlar uchrayman..." Kechqurun: 3 ta journal savoli.',tip:'Memento mori'}))),
  mk('disc-jocko','Jocko Discipline','discipline','⚓','Discipline = Freedom.','advanced',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}: 4:30 + Sport + Plan`,task:'4:30 turing, 60 daq sport, kunlik reja.',tip:'Good.'}))),
  mk('disc-goggins','Goggins 4x4x48','discipline','💀','4 mil har 4 soatda 48 soat.','advanced',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}: tayyorgarlik`,task:'Har kun masofani oshiring. 14-kun: 4x4x48',tip:'Stay hard!'}))),
  mk('disc-spartan','Spartan Mind','discipline','🛡️','30 kun harbiy intizom.','advanced',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'5:00 turish, 100 push-up, 5 km yugurish, 1 soat o\'qish, 0 social media.',tip:'Molon labe'}))),

  // MINDSET (10)
  mk('mind-growth','Growth Mindset','mindset','🌱','Carol Dweck.','beginner', days7(
    ['Fixed vs Growth','Til o\'zgartirish','Yutqazishdan o\'rganish','Mehnat > talant','Feedback qabul','Yangi ko\'nikma','Yangi identity'],
    ['Bugun "men buni yaxshi bilmayman" o\'rniga "men buni hali yaxshi bilmayman"','3 ta "men qila olmayman" topib, "hali" qo\'shing','Oxirgi yutqazishni 1 ta dars sifatida yozing','Birovga "qanday ishlayotganingni" so\'rang','Tanqidni "ma\'lumot" deb qabul qiling','Yangi narsa o\'rganing — 30 daq','Yangi identity yozing'],
    Array(7).fill('Miya — mushak, o\'sadi'))),
  mk('mind-stoic','Stoik Tafakkur','mindset','🧠','Epictetus + Aurelius.','intermediate', days7(
    ['Dichotomy of control','Premeditatio malorum','Memento mori','Amor fati','View from above','Negative visualization','Voluntary discomfort'],
    ['Boshqara olmaydigan narsalar ro\'yxatini yozing','Eng yomon holatni xayolingda yashang','O\'zingizga "abadiy emassan" deb eslating','Bugun bo\'lganlarni qabul qiling','O\'zingizni kosmosdan ko\'ring','5 ta narsasiz qoling','Sovuq dush, och qolish'],
    Array(7).fill('Bu sening tushunching, voqea emas'))),
  mk('mind-gratitude','Minnatdorlik 21 Kun','mindset','🙏','Pozitiv neyrologiya.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Ertalab 3 ta minnatdorlik yozing. Kechqurun — bugungi 1 ta yaxshi narsa.',tip:'Miya nimaga e\'tibor — uni ko\'paytiradi.'}))),
  mk('mind-fear','Qo\'rquv Bilan Yuzlashish','mindset','😨','7 kun + harakat.','intermediate', days7(
    ['Qo\'rquv ro\'yxati','Eng kichigi','Public speaking','Rad qilinish','Yolg\'izlik','Yutqazish','Eng kattasi'],
    ['10 ta qo\'rquv yozing','Eng kichigini bugun bajaring','Begona odam bilan gaplashing','Birovdan biror narsa so\'rang (kafe, taxi)','1 soat yolg\'iz o\'tiring','1 marta yutqazadigan narsa qiling','Eng kattasiga 1 qadam'],
    Array(7).fill('Qo\'rquv yo\'qolmaydi — sen kuchayasan'))),
  mk('mind-failure','Yutqaziq San\'ati','mindset','📉','Yiqilishni qayta tushunish.','intermediate', days7(
    ['Yutqaziqlarni yozing','Sabablarni toping','Dars chiqarish','Qayta urinish','Iterate','Public sharing','Identity'],
    ['10 ta yutqaziq yozing','Har birining haqiqiy sababi','Har biridan 1 ta dars','Bittasini qayta urinib ko\'ring','Yangi yondashuv bilan','Birovga ulashing','"Men yutqazadigan emas, o\'rganadigan odamman"'],
    Array(7).fill('Yutqaziq — feedback, nuqson emas'))),
  mk('mind-confidence','O\'ziga Ishonch','mindset','💎','Identity asosida.','intermediate', days7(
    ['Yutuqlar ro\'yxati','Body language','Ovoz mashqi','Ko\'z bilan aloqa','Posture','Public action','Identity'],
    ['100 ta o\'tmish yutuqni yozing','5 daq superman pose','Oynaga qarab gapiring','Har gaplashganda 70% ko\'z','Tik tik yuring','1 ta jamoatchilik harakati','"Men ishonchli odamman"'],
    Array(7).fill('Ishonch — harakatdan, fikrdan emas'))),
  mk('mind-clarity','Tafakkur Aniqligi','mindset','🔍','Aql tozalash.','beginner', days7(
    ['Brain dump','Eisenhower','Pareto','First principles','Inversion','Mental models','Daily review'],
    ['10 daq miyangizdan hammasini qog\'ozga to\'king','Vazifalarni 4 kvadratga ajrating','20% sabablar — 80% natija','1 muammoni atomgacha bo\'ling','"Bu yiqilishi uchun nima kerak?"','3 ta yangi mental model','Kechqurun 5 daq audit'],
    Array(7).fill('Aniq fikr — yaxshi qaror'))),
  mk('mind-meditation','Meditatsiya 21 Kun','mindset','🕉️','Asoslardan boshlab.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${Math.min(5+i*2,30)} daqiqa`,task:`${Math.min(5+i*2,30)} daqiqa o\'tirib, nafasingizni kuzating.`,tip:'Fikrlar keladi — qaytaring.'}))),
  mk('mind-journal','Journal 30 Kun','mindset','📓','Ravon yozish.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Ertalab 3 sahifa morning pages. Kechqurun 3 ta savol: nima yaxshi? nima yomon? nima o\'rgandim?',tip:'Til orqali fikr aniqlanadi'}))),
  mk('mind-amorfati','Amor Fati 14 Kun','mindset','💛','Taqdiringni sev.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Bugun bo\'lgan 1 ta yomon narsani toping va undan rahmat ayting.',tip:'Hammasi — material'}))),

  // FITNESS (12)
  mk('fit-beginner','Sport Asoslari','fitness','💪','30 kunda boshlanish.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:`${i+1<=7?'10':i+1<=14?'20':i+1<=21?'30':'50'} push-up + ${i+1<=7?'20':i+1<=14?'40':i+1<=21?'60':'100'} squat + 5 daq plank`,tip:'Har kun bir oz ko\'proq'}))),
  mk('fit-100pushup','100 Push-up','fitness','💯','6 hafta.','beginner',
    Array.from({length:42},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${Math.floor(10+i*2.5)} push-up`,task:`${Math.floor(10+i*2.5)} push-up (3-4 set)`,tip:'Forma > tezlik'}))),
  mk('fit-5km','5 km Yugurish','fitness','🏃','8 hafta.','beginner',
    Array.from({length:56},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:`${i<14?'1 daq yugurish + 1 daq yurish x 10':i<28?'2/1 x 10':i<42?'3/1 x 8':'5 km nonstop'}`,tip:'Burun bilan nafas'}))),
  mk('fit-strong5x5','StrongLifts 5x5','fitness','🏋️','12 hafta — kuchli baza.','intermediate',
    Array.from({length:36},(_,i)=>({day:i+1,title:`Kun ${i+1}: ${i%2===0?'A':'B'}`,task:i%2===0?'Squat 5x5, Bench 5x5, Row 5x5':'Squat 5x5, OHP 5x5, Deadlift 1x5',tip:'Har sessiya 2.5 kg qo\'shing'}))),
  mk('fit-mobility','Egiluvchanlik 30 Kun','fitness','🧘','Kunlik 15 daq.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'15 daq stretching: oyoq, bel, yelka',tip:'Og\'riq — to\'xtang'}))),
  mk('fit-abs','30 Kun Abs','fitness','🔥','Qorin mushaklari.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:`${30+i*2} crunches + ${10+i} leg raises + ${30+i*2}s plank`,tip:'Abs — oshxonada'}))),
  mk('fit-weightloss','-10 kg 90 Kun','fitness','⚖️','Hisoblangan defitsit.','intermediate',
    Array.from({length:90},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'500 kal defitsit (ovqat) + 10000 qadam + 30 daq sport',tip:'Sabr — hafta sayin tarozi'}))),
  mk('fit-muscle','+5 kg Mushak','fitness','🥩','120 kun.','intermediate',
    Array.from({length:120},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:i%7===6?'Dam':'45 daq vazn + 1.6g/kg protein + +200 kal',tip:'Sleep > training'}))),
  mk('fit-yoga','Yoga 30 Kun','fitness','🕉️','Sun salutation.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'5 ta surya namaskar + 10 daq nafas',tip:'Body — temple'}))),
  mk('fit-hiit','HIIT 21 Kun','fitness','⚡','15 daq/kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'20 sek max + 10 sek dam x 8 (Tabata) — burpees, mountain climbers',tip:'Intensivlik — kalit'}))),
  mk('fit-sleep','Uyqu Ustasi','fitness','😴','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'22:00 da telefon o\'chiriladi. 22:30 da yotoq. Xona 18°C, qorong\'i.',tip:'Uyqu = recovery'}))),
  mk('fit-nutrition','Ovqatlanish Asoslari','fitness','🥗','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Plate: 1/2 sabzavot, 1/4 protein (palm), 1/4 karbon (mushti)',tip:'Whole foods'}))),

  // FINANCE (10)
  mk('fin-budget','Byudjet 30 Kun','finance','💰','Pul oqimini boshqaring.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Bugungi har bir xarajatni yozing. Hafta oxiri kategoriyalashtiring.',tip:'Tracking = control'}))),
  mk('fin-50-30-20','50/30/20 Qoidasi','finance','📊','7 kun.','beginner', days7(
    ['Daromadni hisoblang','Majburiy 50%','Istakli 30%','Jamg\'arma 20%','Audit','Optimize','Avtomatlashtirish'],
    ['Oylik daromadni yozing','Ijara, oziq-ovqat 50%','Hordiq, kiyim 30%','Jamg\'arma 20%','Oxirgi 30 kun audit','3 ta xarajatni kamaytiring','Avto-jamg\'arma sozlang'],
    Array(7).fill('Pay yourself first'))),
  mk('fin-emergency','Emergency Fund','finance','🆘','3 oy yashash uchun.','intermediate',
    Array.from({length:90},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Daromadning 20% ni alohida hisobga.',tip:'Bu — uxlash uchun'}))),
  mk('fin-invest','Investitsiya 101','finance','📈','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Index fund, ETF, akslar — har kun 1 ta tushuncha.',tip:'Compound > picking'}))),
  mk('fin-debt','Qarzdan Ozodlik','finance','⛓️','60 kun.','intermediate',
    Array.from({length:60},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Snowball: kichik qarzdan boshlab to\'lang.',tip:'Momentum'}))),
  mk('fin-side','Side Hustle 30 Kun','finance','🛠️','Qo\'shimcha daromad.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:i<7?'Idea validate':i<14?'MVP':i<21?'Sotish':'Skalalash',tip:'Ship > perfect'}))),
  mk('fin-millionaire','Millioner Yo\'li','finance','💎','90 kun foundation.','advanced',
    Array.from({length:90},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Daromad oshirish + jamg\'arma + investitsiya — 3 ta vector.',tip:'Income > saving > investing'}))),
  mk('fin-frugal','Tejamkor Yashash','finance','🍎','21 kun minimal.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Faqat zarurlarni sotib oling. Har bir xarajatdan oldin "kerakmi?" deb so\'rang.',tip:'Less = more'}))),
  mk('fin-passive','Passiv Daromad','finance','🌊','30 kun o\'rganish.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Dividends, royalties, rent, content — har kun 1 strategiya.',tip:'Vaqt — eng katta resurs'}))),
  mk('fin-tax','Soliq Optimizatsiya','finance','🧾','7 kun.','intermediate',
    days7(['Asoslar','Hisob turi','Deductions','Investitsion soliq','Biznes','Moliyaviy yil','Plan'],
    ['Davlatingiz soliq sistemasini o\'rganing','Qaysi hisob turi sizga mos','Qonuniy chegirmalar','Investitsiya soliqlari','Biznes ochish (agar)','Yillik plan','Buxgalter bilan'],
    Array(7).fill('Qonuniy minimallashtirish'))),

  // PRODUCTIVITY (10)
  mk('prod-gtd','GTD Metodi','productivity','✅','David Allen.','intermediate', days7(
    ['Capture','Clarify','Organize','Reflect','Engage','Weekly review','Iterate'],
    ['Hammasini bitta inboxga yozing','Har birini: harakatmi? Yo\'qmi?','Loyiha, kontekst, kun bo\'yicha','Kunlik 5 daq','Bugungi 3 ta MIT','Yakshanba 30 daq','Sistemani yaxshilang'],
    Array(7).fill('Brain — fikr uchun, xotira uchun emas'))),
  mk('prod-eisenhower','Eisenhower Matritsa','productivity','📐','7 kun.','beginner', days7(
    ['Mat tushunish','Vazifalarni saralash','Q1 minimumga','Q2 maksimumga','Q3 delegate','Q4 yo\'q','Audit'],
    ['Muhim vs Shoshilinch','Hozirgi 20 vazifani 4 kvadrat','Q1 (urgent+important) — 20% gacha','Q2 (important not urgent) — 60%','Q3 — boshqaga bering','Q4 — o\'chiring','Hafta audit'],
    Array(7).fill('Important > urgent'))),
  mk('prod-timeblock','Time Blocking','productivity','📅','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Kunni 90 daq bloklarga bo\'ling. Har blok — 1 vazifa.',tip:'Calendar > to-do'}))),
  mk('prod-mit','MIT Method','productivity','🎯','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Ertalab 3 ta Most Important Task yozing va birinchi qiling.',tip:'Frog first'}))),
  mk('prod-noemail','Email Detoks','productivity','📧','7 kun.','beginner', days7(
    ['Audit','Unsub','Filters','2x kun','Inbox zero','Templates','Boundaries'],
    ['Inboxni hisoblang','20 ta unsub','Filterlar yarating','Faqat 11:00 va 16:00 da tekshiring','Inbox zero','5 ta template','Email = work, not life'],
    Array(7).fill('Email — boshqalar prioriteti'))),
  mk('prod-2min','2 Daqiqa Qoidasi','productivity','⏱️','7 kun.','beginner', days7(
    ['Tushunish','Test','Habit','Combine','Stack','Identity','Master'],
    ['2 daqiqadan kam — bugun bajaring','10 marta sinab ko\'ring','Yangi odat — 2 daq versiyada','Push-up + ovqatlanish','Habit stack qiling','"Men paydo bo\'luvchi odamman"','Master'],
    Array(7).fill('Boshlash — eng qiyin'))),
  mk('prod-systems','Sistemalar > Maqsadlar','productivity','⚙️','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Maqsad emas — sistema yarating. Har sohada 1 ta sistema.',tip:'Identity > goals > systems > tactics'}))),
  mk('prod-singletask','Bir Vazifa','productivity','1️⃣','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Faqat 1 vazifa, telefonni boshqa xona.',tip:'Multitask = past sifat'}))),
  mk('prod-energy','Energiya Boshqaruvi','productivity','⚡','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Kun bo\'yi energiyangizni 1-10 baholang. Pattern toping.',tip:'Vaqt emas — energiya'}))),
  mk('prod-batch','Batch Processing','productivity','📦','7 kun.','intermediate', days7(
    ['Audit','Email batch','Meeting batch','Content batch','Errand batch','Decision batch','Optimize'],
    ['Vazifalarni guruhlash','Email — 2 marta/kun','Meetings — 1 kun','Content — 1 ta o\'tirishda hammasi','Errandlar — 1 marta','Kiyim/ovqat — oldindan','Audit'],
    Array(7).fill('Context switching — qotil'))),

  // RELATIONSHIPS (8)
  mk('rel-comm','Muloqot Asoslari','relationships','💬','21 kun.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'1 ta open question bering. Aktiv tinglang.',tip:'Tinglash > gaplashish'}))),
  mk('rel-charisma','Xarizma','relationships','✨','30 kun.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Hozirlik + iliqlik + kuch — 3 element.',tip:'Diqqat — eng katta sovg\'a'}))),
  mk('rel-network','Tarmoq Qurish','relationships','🕸️','60 kun.','intermediate',
    Array.from({length:60},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Hafta — 3 ta yangi tanish + 3 ta eski reconnect.',tip:'Give first'}))),
  mk('rel-bound','Chegaralar','relationships','🚧','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'1 ta "yo\'q" ayting. Sababini tushuntirmasdan.',tip:'No = full sentence'}))),
  mk('rel-toxic','Toksik Odamlardan','relationships','☠️','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Energiyangizni so\'ruvchilarni aniqlang. Kontaktni kamaytiring.',tip:'5 ta yaqin = sen'}))),
  mk('rel-deep','Chuqur Do\'stlik','relationships','🤝','30 kun.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'1 ta do\'stga vulnerable savol. Buni qaytaring.',tip:'Chuqurlik > kenglik'}))),
  mk('rel-conflict','Mojaroni Hal Qilish','relationships','⚖️','7 kun.','intermediate', days7(
    ['Tushunish','I-statement','Aktiv tinglash','Empatiya','Compromise','Re-frame','Practice'],
    ['Mojaro — fikr to\'qnashuvi','"Sen..." emas "Men..."','Qaytaring: "Sen aytayotgan..."','Ulardan tomondan ko\'ring','Win-win izlang','Mojaroni o\'sish deb qarang','1 ta real mojaroda qo\'llang'],
    Array(7).fill('Maqsad: yutish emas, hal qilish'))),
  mk('rel-family','Oila Aloqalari','relationships','👨‍👩‍👧','30 kun.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Oila a\'zosiga 1 ta minnatdorlik aytdi.',tip:'Vaqt — sevgi'}))),

  // LEARNING (8)
  mk('learn-feynman','Feynman Texnikasi','learning','🔬','7 kun.','intermediate', days7(
    ['Tanlash','Tushuntirish','Bo\'shliqlar','Soddalashtirish','Re-teach','Master','Apply'],
    ['1 ta tushuncha tanlang','Bolaga tushuntirgandek yozing','Qayerda chalkashganingizni toping','Texnik so\'zlarsiz qaytadan','Birovga aytib bering','Yana 1 daraja chuqur','Real hayotda qo\'llang'],
    Array(7).fill('Tushuntira olmasang — bilmaysan'))),
  mk('learn-speedread','Tez O\'qish','learning','📖','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Pointer + 2x speed + sub-vocalization yo\'q.',tip:'Sifat > tezlik'}))),
  mk('learn-memory','Xotira Mashqlari','learning','🧠','30 kun.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Memory palace + spaced repetition + mnemonics.',tip:'Birinchi marta — 24 soat ichida qaytar'}))),
  mk('learn-language','Yangi Til 90 Kun','learning','🗣️','Spaced repetition.','intermediate',
    Array.from({length:90},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'30 daq Anki + 15 daq podcast + 15 daq gaplashish (AI bilan).',tip:'Comprehensible input'}))),
  mk('learn-skill','Skill Stack','learning','🧩','100 kun.','advanced',
    Array.from({length:100},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Deliberate practice — 1 ta skill, 1 ta kichik element.',tip:'10000 soat — afsona, 20 soat — boshlash'}))),
  mk('learn-read12','12 Kitob/Yil','learning','📚','30 kun habit.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'30 daq o\'qish + 5 daq yozib olish.',tip:'O\'qish — kapitalizatsiya'}))),
  mk('learn-meta','Meta-Learning','learning','🎓','14 kun.','advanced',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Qanday o\'rganishni o\'rganing.',tip:'Process > content'}))),
  mk('learn-ai','AI bilan O\'rganish','learning','🤖','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Kunlik 1 ta murakkab mavzuni AI bilan tushuning.',tip:'Question > answer'}))),

  // SPIRITUALITY (5)
  mk('spi-mindful','Mindfulness 30','spirituality','🪷','Hozirgi onga.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'10 daq sokin o\'tirish + ovqat paytida 100% diqqat.',tip:'Sevish — diqqat'}))),
  mk('spi-faith','Iymon 21','spirituality','🕌','Ruhiy mashqlar.','beginner',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Kundalik ibodat/meditatsiya + 1 ta yaxshilik.',tip:'Niyat — amaldan oldin'}))),
  mk('spi-purpose','Hayot Maqsadi','spirituality','🧭','30 kun.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Ikigai 4 doirasi: sevgan, mahorat, dunyo kerak, pul beradigan.',tip:'Maqsad — qidirilmaydi, quriladi'}))),
  mk('spi-letgo','Qo\'yib Yuborish','spirituality','🍃','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'1 ta narsa, fikr yoki munosabatni qo\'yib yuboring.',tip:'Qarama-qarshilik — azobning manbai'}))),
  mk('spi-presence','Hozirlik','spirituality','⏳','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Soatda 1 marta to\'xtang. 5 nafas. "Hozirdaman."',tip:'Faqat hozir mavjud'}))),

  // LEADERSHIP (5)
  mk('lead-extreme','Extreme Ownership','leadership','👑','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Har xato — sen javobgar. Aybsiz topma.',tip:'Ownership = power'}))),
  mk('lead-vision','Vizyon Yaratish','leadership','🎯','14 kun.','intermediate',
    Array.from({length:14},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'5 yillik vizyon + qadamlar.',tip:'Vizyon — magnit'}))),
  mk('lead-team','Jamoa Qurish','leadership','👥','30 kun.','advanced',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'1-1 meetings, fikr-mulohaza, motivatsiya.',tip:'People > strategy'}))),
  mk('lead-decide','Qaror Qabul Qilish','leadership','🧭','7 kun.','intermediate', days7(
    ['Frame','Options','Criteria','Score','Decide','Commit','Review'],
    ['Muammoni aniq yozing','3+ variant','Mezonlar','Har variantga ball','Eng yaxshini tanlang','Qaytmasdan ishga tushiring','30 kunda qayta ko\'ring'],
    Array(7).fill('Yomon qaror > qarorsizlik'))),
  mk('lead-public','Notiqlik','leadership','🎤','30 kun.','intermediate',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'Kunlik 5 daq video o\'zingizdan. Tahrir qilmang.',tip:'Reps > talent'}))),

  // CREATIVITY (5)
  mk('cre-write','Yozish Mahorati','creativity','✍️','30 kun.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'500 so\'z yozing — har qanday mavzu.',tip:'Bad first draft'}))),
  mk('cre-art','Chizish 30','creativity','🎨','Daily.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'10 daq chizing — sketch, doodle.',tip:'Process > result'}))),
  mk('cre-idea','Idea Generation','creativity','💡','21 kun.','intermediate',
    Array.from({length:21},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'10 ta yangi g\'oya yozing. Yomonligi muhim emas.',tip:'Quantity > quality'}))),
  mk('cre-music','Musiqa Yaratish','creativity','🎵','30 kun.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'15 daq instrument bilan + 1 ta loop yarating.',tip:'Play > learn'}))),
  mk('cre-photo','Fotografiya 30','creativity','📷','Composition.','beginner',
    Array.from({length:30},(_,i)=>({day:i+1,title:`Kun ${i+1}`,task:'10 ta foto + bittasini tahlil qiling.',tip:'See > shoot'}))),
];

export const courseCategories = [
  { id: 'all', label: 'Hammasi', emoji: '🌍' },
  { id: 'discipline', label: 'Intizom', emoji: '🛡️' },
  { id: 'mindset', label: 'Tafakkur', emoji: '🧠' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'finance', label: 'Pul', emoji: '💰' },
  { id: 'productivity', label: 'Samaradorlik', emoji: '⚡' },
  { id: 'relationships', label: 'Munosabatlar', emoji: '💬' },
  { id: 'learning', label: 'O\'rganish', emoji: '🎓' },
  { id: 'spirituality', label: 'Ma\'naviyat', emoji: '🕊️' },
  { id: 'leadership', label: 'Liderlik', emoji: '👑' },
  { id: 'creativity', label: 'Ijodkorlik', emoji: '🎨' },
];
