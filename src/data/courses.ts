export interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  tasks: string[];
  exercises?: Exercise[];
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
  icon: string;
  category: string;
  weeklyPlan: DayPlan[];
  tips: string[];
  commonMistakes: string[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
}

export const categories: Category[] = [
  {
    id: 'sport',
    title: 'Sport',
    description: "Jismoniy kuch va sog'lomlik",
    icon: '💪',
    subcategories: [
      { id: 'bodybuilding', title: 'Bodybuilding', description: "Mushak o'stirish va shakl berish", courseIds: ['bb-beginner', 'bb-intermediate'] },
      { id: 'calisthenics', title: 'Calisthenics', description: "O'z tana og'irligi bilan mashqlar", courseIds: ['cal-beginner'] },
      { id: 'running', title: 'Yugurish', description: "Chidamlilik va kardio", courseIds: ['run-5k'] },
      { id: 'mma', title: 'MMA / Boks', description: "Jang san'atlari", courseIds: ['mma-basics'] },
      { id: 'weight-loss', title: 'Vazn tashlash', description: "Sog'lom usulda ozish", courseIds: ['wl-program'] },
      { id: 'weight-gain', title: "Vazn olish", description: "Mushak massasi oshirish", courseIds: ['wg-program'] },
    ],
  },
  {
    id: 'finance',
    title: 'Moliya',
    description: "Pul boshqarish va boylik",
    icon: '💰',
    subcategories: [
      { id: 'budgeting', title: 'Budjet', description: "Pul oqimini boshqarish", courseIds: ['fin-budget'] },
      { id: 'investing', title: 'Investitsiya', description: "Pulni ishlating", courseIds: ['fin-invest'] },
      { id: 'side-hustle', title: 'Qo\'shimcha daromad', description: "Daromad manbalarini ko'paytirish", courseIds: ['fin-hustle'] },
    ],
  },
  {
    id: 'mental',
    title: 'Ruhiy salomatlik',
    description: "Aql va ruh uchun",
    icon: '🧠',
    subcategories: [
      { id: 'meditation', title: 'Meditatsiya', description: "Ichki tinchlik", courseIds: ['med-start'] },
      { id: 'stress', title: 'Stress boshqarish', description: "Stress bilan kurashish", courseIds: ['stress-mgmt'] },
      { id: 'journaling', title: 'Jurnal yozish', description: "Fikrlarni tartibga solish", courseIds: ['journal-start'] },
    ],
  },
  {
    id: 'intellect',
    title: 'Aqliy rivojlanish',
    description: "Bilim va ko'nikma",
    icon: '📚',
    subcategories: [
      { id: 'reading', title: "Kitob o'qish", description: "O'qish odatini shakllantirish", courseIds: ['read-habit'] },
      { id: 'focus', title: 'Deep Work', description: "Chuqur konsentratsiya", courseIds: ['deep-work'] },
      { id: 'learning', title: "O'rganish usullari", description: "Tez va samarali o'rganish", courseIds: ['learn-methods'] },
    ],
  },
  {
    id: 'discipline',
    title: 'Intizom',
    description: "Eng asosiy ko'nikma",
    icon: '⚡',
    subcategories: [
      { id: 'habits', title: 'Odat shakllantirish', description: "21/66 kun qoidasi", courseIds: ['habit-build'] },
      { id: 'bad-habits', title: "Yomon odatlarni tashlash", description: "Trigger → Routine → Reward", courseIds: ['bad-habit-break'] },
      { id: 'morning', title: 'Ertalabki tartib', description: "Kunni g'alaba bilan boshlash", courseIds: ['morning-routine'] },
    ],
  },
  {
    id: 'university',
    title: 'Universitet tayyorgarlik',
    description: "Harvard, MIT, Stanford",
    icon: '🎓',
    subcategories: [
      { id: 'sat', title: 'SAT/IELTS', description: "Test tayyorgarlik", courseIds: ['test-prep'] },
      { id: 'essay', title: 'Essay yozish', description: "Kuchli ariza yozish", courseIds: ['essay-writing'] },
    ],
  },
];

export const courses: Record<string, CourseDetail> = {
  'bb-beginner': {
    id: 'bb-beginner', title: "Bodybuilding: Boshlang'ich", description: "Mushak o'stirishni noldan boshlang", duration: '8 hafta', difficulty: 'Oson', icon: '🏋️', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Ko'krak va Triceps", tasks: ["10 daqiqa isitish", "Bench press 3x12", "Dumbbell fly 3x15", "Tricep dips 3x10", "Cho'zish 5 daqiqa"], exercises: [
        { name: 'Bench Press', sets: '3', reps: '12', notes: "Yengil vazndan boshlang" },
        { name: 'Dumbbell Fly', sets: '3', reps: '15', notes: "Sekin bajaring" },
        { name: 'Tricep Dips', sets: '3', reps: '10', notes: "To'liq amplituda" },
      ]},
      { day: 2, title: "Orqa va Biceps", tasks: ["Pull-ups 3x8", "Barbell row 3x12", "Bicep curl 3x15", "5 daqiqa cho'zish"] },
      { day: 3, title: "Dam olish", tasks: ["Yengil yurish 30 daqiqa", "Cho'zish 15 daqiqa", "Ko'p suv ichish"] },
      { day: 4, title: "Oyoq va Yelka", tasks: ["Squat 3x12", "Leg press 3x15", "Shoulder press 3x12", "Lateral raise 3x15"] },
      { day: 5, title: "To'liq tana", tasks: ["Deadlift 3x8", "Push-ups 3x20", "Plank 3x1 daqiqa"] },
      { day: 6, title: "Kardio", tasks: ["30 daqiqa yugurish", "10 daqiqa cho'zish"] },
      { day: 7, title: "Dam olish", tasks: ["To'liq dam olish", "Toza ovqat", "8 soat uyqu"] },
    ],
    tips: ["Vaznni asta-sekin oshiring", "Har mashqda to'g'ri texnikaga e'tibor bering", "Proteinli ovqat kuniga 1.6-2g/kg tana vazniga", "8 soat uyqu — mushak dam olishda o'sadi"],
    commonMistakes: ["Juda og'ir vazn olish", "Isitishni o'tkazib yuborish", "Dam olish kunlarini e'tiborsiz qoldirish"],
  },
  'bb-intermediate': {
    id: 'bb-intermediate', title: "Bodybuilding: O'rta daraja", description: "Mushak massasini jiddiy oshiring", duration: '12 hafta', difficulty: "O'rta", icon: '💪', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Push Day", tasks: ["Bench press 4x8", "Incline dumbbell 4x10", "OHP 3x10", "Cable fly 3x15", "Tricep pushdown 4x12"] },
      { day: 2, title: "Pull Day", tasks: ["Deadlift 4x6", "Barbell row 4x8", "Pull-ups 4x10", "Face pulls 3x15", "Bicep curl 4x12"] },
      { day: 3, title: "Legs", tasks: ["Squat 4x8", "Romanian DL 3x10", "Leg press 4x12", "Calf raise 4x15", "Leg curl 3x12"] },
      { day: 4, title: "Dam olish + Kardio", tasks: ["LISS kardio 40 daqiqa", "Cho'zish 20 daqiqa"] },
      { day: 5, title: "Push Day 2", tasks: ["OHP 4x8", "Dumbbell press 4x10", "Lateral raise 4x15", "Dips 3x12"] },
      { day: 6, title: "Pull Day 2", tasks: ["Weighted pull-ups 4x6", "Cable row 4x10", "Hammer curl 3x12", "Shrugs 3x15"] },
      { day: 7, title: "Dam olish", tasks: ["To'liq tiklash", "Stretching", "Meal prep"] },
    ],
    tips: ["Progressive overload — har hafta biroz ko'proq", "Trening jurnali yuring", "Kaloriya surplus: +300-500 kcal"],
    commonMistakes: ["Ego lifting", "Oyoq kunini o'tkazish", "Kam uxlash"],
  },
  'cal-beginner': {
    id: 'cal-beginner', title: "Calisthenics: Asoslar", description: "O'z tana og'irligi bilan kuchli bo'ling", duration: '6 hafta', difficulty: 'Oson', icon: '🤸', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Push mashqlari", tasks: ["Push-ups 4x15", "Diamond push-ups 3x10", "Pike push-ups 3x8", "Plank 3x45s"] },
      { day: 2, title: "Pull mashqlari", tasks: ["Pull-ups 3x5 (yordam bilan)", "Inverted rows 3x12", "Dead hang 3x30s"] },
      { day: 3, title: "Oyoq", tasks: ["Squat 4x20", "Lunge 3x12 har oyoq", "Calf raise 3x20", "Wall sit 3x30s"] },
      { day: 4, title: "Dam olish", tasks: ["Yurish 30 daqiqa", "Cho'zish"] },
      { day: 5, title: "To'liq tana", tasks: ["Burpees 3x10", "Mountain climbers 3x20", "Push-ups 3x15", "Pull-ups 3x5"] },
      { day: 6, title: "Skill work", tasks: ["Handstand amaliyot 15 daqiqa", "L-sit progressiya 10 daqiqa"] },
      { day: 7, title: "Dam olish", tasks: ["Yoga/cho'zish"] },
    ],
    tips: ["Har harakatda to'liq amplituda", "Sekin-sekin qiyinlashtiring", "Skill work muntazam"],
    commonMistakes: ["Texnikani buzish", "Juda tez qiyinlashtirish"],
  },
  'run-5k': {
    id: 'run-5k', title: "5K Yugurish rejasi", description: "8 haftada 5 km yuguring", duration: '8 hafta', difficulty: 'Oson', icon: '🏃', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Yugurish/yurish", tasks: ["1 min yugurish + 2 min yurish × 8"] },
      { day: 2, title: "Dam olish", tasks: ["Cho'zish 15 min"] },
      { day: 3, title: "Yugurish", tasks: ["2 min yugurish + 1 min yurish × 8"] },
      { day: 4, title: "Cross-training", tasks: ["Velosiped 30 min yoki suzish"] },
      { day: 5, title: "Yugurish", tasks: ["3 min yugurish + 1 min yurish × 6"] },
      { day: 6, title: "Dam olish", tasks: ["Faol dam olish"] },
      { day: 7, title: "Uzoq yugurish", tasks: ["20 daqiqa uzluksiz, tezlikni o'zingiz tanlang"] },
    ],
    tips: ["Sekin boshlang", "To'g'ri poyafzal tanlang", "Suv rejimiga amal qiling"],
    commonMistakes: ["Juda tez boshlash", "Dam olishni e'tiborsiz qoldirish"],
  },
  'mma-basics': {
    id: 'mma-basics', title: "MMA asoslari", description: "Jang san'atlari bilan tanishing", duration: '8 hafta', difficulty: "O'rta", icon: '🥊', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Boks asoslari", tasks: ["Jab-cross 3x3 min", "Hook texnikasi 3x2 min", "Footwork drill 10 min", "Jump rope 3x3 min"] },
      { day: 2, title: "Kuch mashqlari", tasks: ["Push-ups 4x20", "Pull-ups 3x10", "Squat 4x15", "Plank 3x1 min"] },
      { day: 3, title: "Muay Thai", tasks: ["Tepa texnikasi", "Elbow strike", "Clinch work", "Bag work 5x3 min"] },
      { day: 4, title: "Dam olish", tasks: ["Cho'zish", "Mobility work"] },
      { day: 5, title: "Wrestling", tasks: ["Takedown drills", "Scramble work", "Guard passing"] },
      { day: 6, title: "Kardio", tasks: ["Sparring/mitt work 30 min", "Conditioning"] },
      { day: 7, title: "Dam olish", tasks: ["Recovery"] },
    ],
    tips: ["Texnika > kuch", "Sparringda nazorat", "Flexibility muhim"],
    commonMistakes: ["Faqat kuchga ishonish", "Cardioni e'tiborsiz qoldirish"],
  },
  'wl-program': {
    id: 'wl-program', title: "Vazn tashlash: 12 hafta", description: "Sog'lom usulda ortiqcha vazndan xalos bo'ling", duration: '12 hafta', difficulty: "O'rta", icon: '🔥', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "HIIT + Kuch", tasks: ["HIIT 20 min", "Full body strength 30 min"] },
      { day: 2, title: "Kardio", tasks: ["45 daqiqa tez yurish yoki yugurish"] },
      { day: 3, title: "Kuch mashqlari", tasks: ["Upper body 40 min"] },
      { day: 4, title: "Faol dam olish", tasks: ["Yoga 30 min", "Yurish"] },
      { day: 5, title: "HIIT", tasks: ["Tabata 4x4 min", "Core 15 min"] },
      { day: 6, title: "Kuch + Kardio", tasks: ["Lower body 30 min", "Treadmill 20 min"] },
      { day: 7, title: "Dam olish", tasks: ["Meal prep", "Recovery"] },
    ],
    tips: ["Kaloriya defitsiti: -500 kcal/kun", "Protein yuqori saqlang", "Suv: 3+ litr", "Uyqu: 7-9 soat"],
    commonMistakes: ["Juda kam yeyish", "Faqat kardio qilish", "Sabrsizlik"],
  },
  'wg-program': {
    id: 'wg-program', title: "Vazn olish dasturi", description: "Mushak massasini sog'lom oshiring", duration: '12 hafta', difficulty: "O'rta", icon: '📈', category: 'sport',
    weeklyPlan: [
      { day: 1, title: "Ko'krak + Triceps", tasks: ["Bench press 4x8-10", "Incline DB press 3x12", "Cable fly 3x15", "Tricep pushdown 4x12"] },
      { day: 2, title: "Orqa + Biceps", tasks: ["Deadlift 4x6", "Lat pulldown 4x10", "Barbell row 3x10", "Bicep curl 4x12"] },
      { day: 3, title: "Dam olish", tasks: ["Yuqori kaloriyali ovqat tayyorlash", "Light stretching"] },
      { day: 4, title: "Oyoq", tasks: ["Squat 4x8", "Leg press 4x12", "Romanian DL 3x10", "Calf raise 4x15"] },
      { day: 5, title: "Yelka + Qo'l", tasks: ["OHP 4x8", "Lateral raise 4x15", "Hammer curl 3x12", "Close grip bench 3x10"] },
      { day: 6, title: "Dam olish yoki yengil kardio", tasks: ["20 min yurish"] },
      { day: 7, title: "Dam olish", tasks: ["Tiklash kunni"] },
    ],
    tips: ["Kaloriya surplus: +300-500 kcal", "Har 2 soatda ovqatlaning", "Creatine 5g/kun", "Progressive overload"],
    commonMistakes: ["Kam yeyish", "Junk food bilan vazn olish", "Dam olmaslik"],
  },
  'fin-budget': {
    id: 'fin-budget', title: "Budjet boshqarish", description: "Pulingizni nazorat qiling", duration: '4 hafta', difficulty: 'Oson', icon: '📊', category: 'finance',
    weeklyPlan: [
      { day: 1, title: "Hozirgi holatni baholash", tasks: ["Barcha daromadlarni yozing", "Barcha xarajatlarni yozing", "Sof balansni hisoblang"] },
      { day: 2, title: "50/30/20 qoidasi", tasks: ["50% zaruriy xarajatlar", "30% istaklar", "20% tejash/investitsiya", "Kategoriyalarga bo'ling"] },
      { day: 3, title: "Xarajatlarni kuzatish", tasks: ["Har bir xarajatni yozing", "Haftada bir marta tekshiruv", "Keraksiz xarajatlarni aniqlang"] },
      { day: 4, title: "Favqulodda fond", tasks: ["3-6 oylik xarajatlar miqdorini hisoblang", "Avtomatik o'tkazma o'rnating", "Sarflamaslik qoidalari"] },
      { day: 5, title: "Qarz boshqarish", tasks: ["Barcha qarzlarni ro'yxatlang", "Snowball yoki Avalanche usuli", "Qarzni kamaytirish rejasi"] },
      { day: 6, title: "Tahlil", tasks: ["Haftalik xarajatlar tahlili", "Tejash imkoniyatlarini toping"] },
      { day: 7, title: "Reja yangilash", tasks: ["Keyingi hafta uchun budjet tuzish"] },
    ],
    tips: ["Har kuni xarajat yozing", "Naqd pul ishlatishga o'ting", "Kichik maqsadlardan boshlang"],
    commonMistakes: ["Budjetni yozmaslik", "Juda qattiq cheklov", "Favqulodda fondni yaratmaslik"],
  },
  'fin-invest': {
    id: 'fin-invest', title: "Investitsiya asoslari", description: "Pulingizni ishlating", duration: '6 hafta', difficulty: "O'rta", icon: '📈', category: 'finance',
    weeklyPlan: [
      { day: 1, title: "Investitsiya turlari", tasks: ["Aksiyalar", "Obligatsiyalar", "ETF/Index fondlar", "Ko'chmas mulk", "Kripto asoslari"] },
      { day: 2, title: "Risk boshqarish", tasks: ["Diversifikatsiya", "Risk tolerantligi aniqlash", "Dollar-cost averaging"] },
      { day: 3, title: "Brokerage ochish", tasks: ["Platformani tanlash", "Demo hisob ochish", "Asosiy orderlarni o'rganish"] },
      { day: 4, title: "ETF portfel", tasks: ["3-fond portfel strategiyasi", "Xarajat koeffitsientini tekshirish"] },
      { day: 5, title: "Fundamental tahlil", tasks: ["P/E, P/B ratio", "Daromad hisobotini o'qish"] },
      { day: 6, title: "Amaliyot", tasks: ["Demo hisobda savdo"] },
      { day: 7, title: "Tahlil", tasks: ["Haftalik natijalar tahlili"] },
    ],
    tips: ["Uzoq muddatli fikrlang", "Hissiyotga berilmang", "Tushunadigan narsaga investitsiya qiling"],
    commonMistakes: ["FOMO bilan xarid", "Diversifikatsiya qilmaslik", "Qisqa muddatli fikrlash"],
  },
  'fin-hustle': {
    id: 'fin-hustle', title: "Qo'shimcha daromad", description: "Yangi daromad manbalari yarating", duration: '8 hafta', difficulty: "O'rta", icon: '💵', category: 'finance',
    weeklyPlan: [
      { day: 1, title: "Ko'nikmalaringiz auditi", tasks: ["Nima qila olishingizni ro'yxatlang", "Bozorda talab borlarini aniqlang"] },
      { day: 2, title: "Freelancing", tasks: ["Upwork/Fiverr profil yarating", "Portfolio tayyorlang", "3 ta loyihaga ariza bering"] },
      { day: 3, title: "Online savdo", tasks: ["Mahsulot tanlash", "Platforma tanlash"] },
      { day: 4, title: "Kontent yaratish", tasks: ["YouTube/Blog boshlash", "Niche tanlash", "Reja tuzish"] },
      { day: 5, title: "Mijozlar topish", tasks: ["Tarmoqlash", "Sovuq xatlar yozish"] },
      { day: 6, title: "Avtomatlashtirish", tasks: ["Takroriy jarayonlarni toping", "Vaqtni tejang"] },
      { day: 7, title: "Tahlil va reja", tasks: ["Haftalik daromad tahlili", "Keyingi qadam"] },
    ],
    tips: ["Bittasiga konsentratsiya qiling", "Sifatli ish", "Sabr bilan davom eting"],
    commonMistakes: ["Ko'p narsani birvarakayiga boshlash", "Past narx qo'yish", "Marketing qilmaslik"],
  },
  'med-start': {
    id: 'med-start', title: "Meditatsiya boshlash", description: "Ichki tinchlik va diqqat", duration: '4 hafta', difficulty: 'Oson', icon: '🧘', category: 'mental',
    weeklyPlan: [
      { day: 1, title: "Nafas olish", tasks: ["5 daqiqa nafas meditatsiyasi", "4-7-8 texnikasi", "Tinch joyda o'tiring"] },
      { day: 2, title: "Body scan", tasks: ["10 daqiqa body scan", "Oyoqdan boshga diqqat"] },
      { day: 3, title: "Mindfulness", tasks: ["Ovqatlanishda mindfulness", "5 daqiqa hozirgi lahzaga diqqat"] },
      { day: 4, title: "Ertalab meditatsiya", tasks: ["Uyg'ongandan so'ng 10 daqiqa", "Kun maqsadlarini o'ylash"] },
      { day: 5, title: "Minnatdorlik", tasks: ["3 ta minnatdorlik yozing", "5 daqiqa minnatdorlik meditatsiyasi"] },
      { day: 6, title: "Yurish meditatsiyasi", tasks: ["15 daqiqa ongni haydash", "Tabiatda yurish"] },
      { day: 7, title: "Dam olish", tasks: ["Erkin shakl", "O'zingizga ma'qul usulni tanlang"] },
    ],
    tips: ["Har kuni bir xil vaqtda", "Kutmang, kuzating", "Sabr qiling"],
    commonMistakes: ["'Noto'g'ri qilyapman' deb o'ylash", "Juda uzoq boshlash", "Muntazam emaslik"],
  },
  'stress-mgmt': {
    id: 'stress-mgmt', title: "Stress boshqarish", description: "Stressni nazorat qiling", duration: '4 hafta', difficulty: 'Oson', icon: '🌊', category: 'mental',
    weeklyPlan: [
      { day: 1, title: "Stress audit", tasks: ["Stress manbalarini yozing", "Tana reaksiyalarini kuzating"] },
      { day: 2, title: "Nafas texnikalari", tasks: ["Box breathing: 4-4-4-4", "Parasimpatik aktivatsiya"] },
      { day: 3, title: "Jismoniy chiqarish", tasks: ["Sport 30 min", "Cold shower 2 min"] },
      { day: 4, title: "Vaqt boshqarish", tasks: ["Priority matrix", "Yo'q deyishni o'rganing"] },
      { day: 5, title: "Ijtimoiy qo'llab-quvvatlash", tasks: ["Ishonchli odamga gaplashing", "Yolg'iz vaqt ham ajrating"] },
      { day: 6, title: "Uyqu gigiena", tasks: ["Ekran vaqtini kamaytiring", "Uyqu tartibi o'rnating"] },
      { day: 7, title: "Haftalik tahlil", tasks: ["Stress darajasini baholang", "Eng samarali usulni aniqlang"] },
    ],
    tips: ["Stressni to'liq yo'q qilish mumkin emas — boshqarishni o'rganing", "Muntazamlik muhim"],
    commonMistakes: ["Stressni inkor qilish", "Faqat bitta usulga tayanish"],
  },
  'journal-start': {
    id: 'journal-start', title: "Jurnal yozish", description: "Fikrlarni tartibga soling", duration: '3 hafta', difficulty: 'Oson', icon: '📝', category: 'mental',
    weeklyPlan: [
      { day: 1, title: "Ertalabki sahifalar", tasks: ["3 sahifa erkin yozing", "Hech narsani filtrlamang"] },
      { day: 2, title: "Minnatdorlik jurnali", tasks: ["3 ta minnatdorlik", "1 ta bugun uchun maqsad"] },
      { day: 3, title: "Refleksiya", tasks: ["Kecha nimani yaxshi qildim?", "Nimani o'zgartirishim kerak?"] },
      { day: 4, title: "Maqsad jurnali", tasks: ["1-3-5 yillik maqsadlar", "Bugungi qadamlar"] },
      { day: 5, title: "Hissiyot jurnali", tasks: ["Bugungi kayfiyat", "Nima sababchi?", "Qanday javob berdim?"] },
      { day: 6, title: "Muammo yechish", tasks: ["Muammoni yozing", "5 ta yechim topingp", "Eng yaxshisini tanlang"] },
      { day: 7, title: "Haftalik tahlil", tasks: ["Hafta xulosaslari", "Eng muhim darslar"] },
    ],
    tips: ["Har kuni bir xil vaqtda", "Grammatikani tashvishlamang", "Haqiqiy bo'ling"],
    commonMistakes: ["Bir necha kun o'tkazib yuborish", "Faqat ijobiy narsalar yozish"],
  },
  'habit-build': {
    id: 'habit-build', title: "Odat shakllantirish", description: "21-66 kun qoidasi bilan yangi odat yarating", duration: '9 hafta', difficulty: "O'rta", icon: '🔄', category: 'discipline',
    weeklyPlan: [
      { day: 1, title: "Maqsadni aniqlash", tasks: ["Qanday odat?", "Nima uchun?", "Qachon va qayerda?"] },
      { day: 2, title: "Muhit dizayni", tasks: ["Trigger yarating", "Osonlashtiring", "Frictionni kamaytiring"] },
      { day: 3, title: "2 daqiqa qoidasi", tasks: ["Odatni eng kichik versiyasini bajaring", "Faqat 2 daqiqa"] },
      { day: 4, title: "Habit stacking", tasks: ["Mavjud odatga bog'lang", 'Formulа: "X qilgandan keyin Y qilaman"'] },
      { day: 5, title: "Tracking", tasks: ["Kuningizni belgilang", "Streakni boshlang"] },
      { day: 6, title: "Muvaffaqiyatsizlik rejasi", tasks: ["Agar bajarmasam nima?", "Zaxira reja"] },
      { day: 7, title: "Tahlil", tasks: ["Hafta qanday o'tdi?", "Nimani o'zgartirish kerak?"] },
    ],
    tips: ["Kichikdan boshlang", "Hech qachon 2 kunni o'tkazib yubormang", "Muhitni boshqaring"],
    commonMistakes: ["Juda ko'p odatni birvarakayiga boshlash", "Motivatsiyaga tayanish"],
  },
  'bad-habit-break': {
    id: 'bad-habit-break', title: "Yomon odatlarni tashlash", description: "Trigger-Routine-Reward tizimini buzish", duration: '6 hafta', difficulty: 'Qiyin', icon: '🚫', category: 'discipline',
    weeklyPlan: [
      { day: 1, title: "Odatni aniqlash", tasks: ["Aniq yomon odatni yozing", "Qachon paydo bo'ladi?", "Nima trigger?"] },
      { day: 2, title: "Trigger xaritasi", tasks: ["Har safar trigger bo'lganda yozing", "Vaqt, joy, kayfiyat, odamlar"] },
      { day: 3, title: "Mukofot aniqlash", tasks: ["Bu odat sizga nima beradi?", "Haqiqiy ehtiyoj nima?"] },
      { day: 4, title: "O'rnini bosuvchi", tasks: ["Sog'lom alternativa topang", "Huddi shunday mukofot beruvchi"] },
      { day: 5, title: "Muhit o'zgartirish", tasks: ["Triggerlarni olib tashlang", "Yangi muhit yarating"] },
      { day: 6, title: "Accountability", tasks: ["Birovga ayting", "Jazo/mukofot tizimi"] },
      { day: 7, title: "Tahlil", tasks: ["Necha marta bajardingiz?", "Nima yordam berdi?"] },
    ],
    tips: ["Bitta odatga konsentratsiya", "Sabr — 66 kun kerak bo'lishi mumkin", "O'zingizni ayblashni to'xtating"],
    commonMistakes: ["Bir kunda tashlashga urinish", "Triggerlarni e'tiborsiz qoldirish", "Yolg'iz kurashish"],
  },
  'morning-routine': {
    id: 'morning-routine', title: "Ertalabki tartib", description: "Kunni g'alaba bilan boshlang", duration: '3 hafta', difficulty: 'Oson', icon: '🌅', category: 'discipline',
    weeklyPlan: [
      { day: 1, title: "5:30 uyg'onish", tasks: ["Snooze bosmasdan turish", "Suv ichish", "10 daqiqa cho'zish"] },
      { day: 2, title: "Harakat", tasks: ["20 min mashq yoki yugurish", "Sovuq dush 2 min"] },
      { day: 3, title: "Ong", tasks: ["5 min meditatsiya", "3 ta minnatdorlik yozish", "Kun maqsadlarini belgilash"] },
      { day: 4, title: "Bilim", tasks: ["20 min kitob o'qish", "Muhim narsalarni yozish"] },
      { day: 5, title: "Reja", tasks: ["Top 3 vazifa belgilash", "Kalendarni tekshirish", "Kechqurungi uyqu vaqtini belgilash"] },
      { day: 6, title: "To'liq tartib", tasks: ["Hammasini birlashtiring", "Vaqtni o'lchang"] },
      { day: 7, title: "Tahlil", tasks: ["Nima ishladi?", "Nimani o'zgartirish kerak?"] },
    ],
    tips: ["Kechqurun 10da uxlang", "Telefonni xonadan chiqaring", "Har kuni bir xil tartib"],
    commonMistakes: ["Uyqu kamayishi", "Juda ko'p narsani qo'shish", "Dam olish kunlarida buzish"],
  },
  'read-habit': {
    id: 'read-habit', title: "Kitob o'qish odati", description: "Kuniga 30 daqiqa o'qishni odat qiling", duration: '4 hafta', difficulty: 'Oson', icon: '📖', category: 'intellect',
    weeklyPlan: [
      { day: 1, title: "Kitob tanlash", tasks: ["Qiziqishingizga mos kitob", "Juda oson emas, juda qiyin emas"] },
      { day: 2, title: "10 daqiqa", tasks: ["Faqat 10 daqiqa o'qing", "Vaqt va joyni belgilang"] },
      { day: 3, title: "15 daqiqa", tasks: ["Vaqtni oshiring", "Eslatmalar yozing"] },
      { day: 4, title: "20 daqiqa", tasks: ["Diqqatni saqlang", "Telefonni olib qo'ying"] },
      { day: 5, title: "25 daqiqa", tasks: ["Active reading: savol bering", "Muhim joylarni belgilang"] },
      { day: 6, title: "30 daqiqa", tasks: ["Maqsadga yetdingiz!", "Sifatli o'qing"] },
      { day: 7, title: "Tahlil", tasks: ["Nima o'rgandingiz?", "Hayotga qanday qo'llay olasiz?"] },
    ],
    tips: ["Uxlashdan oldin o'qing", "Doim kitob olib yuring", "Yoqmagan kitobni tashlang"],
    commonMistakes: ["Juda qiyin kitob tanlash", "Muntazam emaslik"],
  },
  'deep-work': {
    id: 'deep-work', title: "Deep Work", description: "Chuqur konsentratsiya qobiliyatini oshiring", duration: '6 hafta', difficulty: "O'rta", icon: '🎯', category: 'intellect',
    weeklyPlan: [
      { day: 1, title: "25 min blok", tasks: ["Pomodoro: 25 min ish + 5 min dam", "Telefonni o'chiring", "Bir vazifaga konsentratsiya"] },
      { day: 2, title: "Muhit tayyorlash", tasks: ["Quloqchin", "Shovqin yo'q", "Barcha notificationlarni o'chiring"] },
      { day: 3, title: "45 min blok", tasks: ["Vaqtni oshiring", "Bir mavzuga chuqur kiring"] },
      { day: 4, title: "Raqamli detox", tasks: ["2 soat telefonsiz", "Faqat bitta vazifa"] },
      { day: 5, title: "60 min blok", tasks: ["1 soatlik uzluksiz ish", "Natijani yozing"] },
      { day: 6, title: "90 min blok", tasks: ["Maqsad: 90 min deep work", "Eng muhim vazifada"] },
      { day: 7, title: "Tahlil", tasks: ["Eng samarali qachon?", "Nima chalg'itdi?"] },
    ],
    tips: ["Ertalab deep work qiling", "Ritual yarating", "Natijani o'lchang"],
    commonMistakes: ["Multitasking", "Notificationlarni o'chirmaslik"],
  },
  'learn-methods': {
    id: 'learn-methods', title: "Samarali o'rganish", description: "Ilmiy asoslangan o'rganish usullari", duration: '4 hafta', difficulty: "O'rta", icon: '🧪', category: 'intellect',
    weeklyPlan: [
      { day: 1, title: "Spaced Repetition", tasks: ["Anki/flashcard yarating", "Interval: 1-3-7-14 kun"] },
      { day: 2, title: "Active Recall", tasks: ["O'qigandan so'ng kitobni yoping", "Eslab qolganingizni yozing"] },
      { day: 3, title: "Feynman texnikasi", tasks: ["Mavzuni 5 yoshli bolaga tushuntiring", "Tushunamaganingizni aniqlang"] },
      { day: 4, title: "Pomodoro + Interleaving", tasks: ["25 min bloklarda", "Mavzularni almashtiring"] },
      { day: 5, title: "Mind mapping", tasks: ["Mavzuni vizual xaritalang", "Bog'lanishlarni toping"] },
      { day: 6, title: "O'rgatish orqali o'rganish", tasks: ["Birovga tushuntiring", "Savollarga javob bering"] },
      { day: 7, title: "Tahlil", tasks: ["Qaysi usul eng samarali?", "Keyingi hafta rejasi"] },
    ],
    tips: ["Turli usullarni aralshtiring", "Uyquni e'tiborsiz qoldirmang", "Faol o'rganing, passiv emas"],
    commonMistakes: ["Faqat qayta o'qish", "Highlighting = o'rganish deb o'ylash"],
  },
  'test-prep': {
    id: 'test-prep', title: "SAT/IELTS tayyorgarlik", description: "Top universitetlarga kirish", duration: '12 hafta', difficulty: 'Qiyin', icon: '🎯', category: 'university',
    weeklyPlan: [
      { day: 1, title: "Diagnostika testi", tasks: ["Practice test yeching", "Zaif tomonlarni aniqlang"] },
      { day: 2, title: "Matematika/Reading", tasks: ["2 soat amaliyot", "Xatolarni tahlil qiling"] },
      { day: 3, title: "Writing/Listening", tasks: ["Essay yozing", "Feedback oling"] },
      { day: 4, title: "Lug'at", tasks: ["20 ta yangi so'z", "Flashcard yarating"] },
      { day: 5, title: "Practice test", tasks: ["Vaqtni hisoblab yeching", "Natijani yozing"] },
      { day: 6, title: "Zaif tomonlar", tasks: ["Faqat zaif sohada ishlang"] },
      { day: 7, title: "Dam olish + Tahlil", tasks: ["Haftalik progress", "Keyingi hafta reja"] },
    ],
    tips: ["Har kuni 2+ soat", "Xatolardan o'rganing", "Mock testlar muhim"],
    commonMistakes: ["Faqat kuchli tomonlarni mashq qilish", "Vaqtni boshqarmaslik"],
  },
  'essay-writing': {
    id: 'essay-writing', title: "Kuchli essay yozish", description: "Harvard darajasida ariza yozing", duration: '6 hafta', difficulty: 'Qiyin', icon: '✍️', category: 'university',
    weeklyPlan: [
      { day: 1, title: "Hikoyangizni toping", tasks: ["O'zingiz haqida 10 ta noyob narsa yozing", "Eng kuchli tajribangiz"] },
      { day: 2, title: "Structure", tasks: ["Hook + Body + Conclusion", "Show, don't tell"] },
      { day: 3, title: "Birinchi qoralama", tasks: ["To'xtovsiz yozing", "Tahrirlamang"] },
      { day: 4, title: "Tahrir", tasks: ["Keraksiz so'zlarni olib tashlang", "Faol fe'l ishlating"] },
      { day: 5, title: "Feedback", tasks: ["3 kishiga ko'rsating", "Fikrlarni yig'ing"] },
      { day: 6, title: "Qayta yozish", tasks: ["Feedbackni qo'llang", "Yakuniy versiya"] },
      { day: 7, title: "Tahlil", tasks: ["Boshqa muvaffaqiyatli essaylarni o'qing"] },
    ],
    tips: ["Haqiqiy bo'ling", "Aniq misol keltiring", "Oddiy til ishlating"],
    commonMistakes: ["Umumiy yozish", "Ko'p mavzu aralshtirish", "Deadline oldidan boshlash"],
  },
};
