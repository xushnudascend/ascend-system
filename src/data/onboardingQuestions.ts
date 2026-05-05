export interface Question {
  id: number;
  category: 'discipline' | 'focus' | 'fitness' | 'addiction' | 'finance' | 'mental' | 'profile' | 'badhabits';
  text: string;
  type?: 'choice' | 'number' | 'sex' | 'multi';
  options?: { label: string; score: number; value?: string }[];
  unit?: string;
}

export const questions: Question[] = [
  {
    id: 1, category: 'discipline',
    text: "Ertalab soatnik chalinganda nima qilasiz?",
    options: [
      { label: "Darhol turaman", score: 10 },
      { label: "5-10 daqiqa snooze bosaman", score: 6 },
      { label: "Bir necha marta snooze bosaman", score: 3 },
      { label: "Soatnikni o'chirib, yana uxlayman", score: 0 },
    ],
  },
  {
    id: 2, category: 'discipline',
    text: "O'zingizga bergan va'dalaringizni qanchalik bajarasiz?",
    options: [
      { label: "Deyarli har doim", score: 10 },
      { label: "Ko'pincha", score: 7 },
      { label: "Ba'zan", score: 4 },
      { label: "Kam hollarda", score: 1 },
    ],
  },
  {
    id: 3, category: 'focus',
    text: "Telefoningizni tekshirmasdan qancha vaqt ishlaysiz?",
    options: [
      { label: "2+ soat", score: 10 },
      { label: "1-2 soat", score: 7 },
      { label: "30-60 daqiqa", score: 4 },
      { label: "30 daqiqadan kam", score: 1 },
    ],
  },
  {
    id: 4, category: 'focus',
    text: "Muhim ish paytida ijtimoiy tarmoqlarni tekshirasizmi?",
    options: [
      { label: "Yo'q, hech qachon", score: 10 },
      { label: "Kamdan-kam", score: 7 },
      { label: "Tez-tez", score: 3 },
      { label: "Doimiy", score: 0 },
    ],
  },
  {
    id: 5, category: 'fitness',
    text: "Haftada necha marta sport bilan shug'ullanasiz?",
    options: [
      { label: "5+ marta", score: 10 },
      { label: "3-4 marta", score: 7 },
      { label: "1-2 marta", score: 4 },
      { label: "Umuman emas", score: 0 },
    ],
  },
  {
    id: 6, category: 'fitness',
    text: "Kunlik jismoniy faolligingiz qanday?",
    options: [
      { label: "Juda faol (piyoda, sport, ish)", score: 10 },
      { label: "O'rtacha faol", score: 7 },
      { label: "Kam faol", score: 3 },
      { label: "Asosan o'tirib ishlayman", score: 0 },
    ],
  },
  {
    id: 7, category: 'addiction',
    text: "Kuniga qancha vaqt ijtimoiy tarmoqlarda o'tkazasiz?",
    options: [
      { label: "1 soatdan kam", score: 10 },
      { label: "1-3 soat", score: 6 },
      { label: "3-5 soat", score: 3 },
      { label: "5+ soat", score: 0 },
    ],
  },
  {
    id: 8, category: 'addiction',
    text: "Fast food va shirinliklarni qanchalik iste'mol qilasiz?",
    options: [
      { label: "Deyarli hech qachon", score: 10 },
      { label: "Haftada 1-2 marta", score: 7 },
      { label: "Har kuni", score: 3 },
      { label: "Kuniga bir necha marta", score: 0 },
    ],
  },
  {
    id: 9, category: 'addiction',
    text: "O'yinlar (gaming) bilan qanchalik shug'ullanasiz?",
    options: [
      { label: "O'ynamayman", score: 10 },
      { label: "Haftada 1-2 soat", score: 7 },
      { label: "Har kuni 1-3 soat", score: 3 },
      { label: "Har kuni 3+ soat", score: 0 },
    ],
  },
  {
    id: 10, category: 'finance',
    text: "Oylik daromadingizni qanday boshqarasiz?",
    options: [
      { label: "Aniq budjet va tejash rejam bor", score: 10 },
      { label: "Taxminan kuzataman", score: 6 },
      { label: "Hech narsa rejalashtirmayman", score: 3 },
      { label: "Doim qarzga botaman", score: 0 },
    ],
  },
  {
    id: 11, category: 'finance',
    text: "Impulse xaridlar qilasizmi?",
    options: [
      { label: "Yo'q, faqat rejalashtirilgan", score: 10 },
      { label: "Kamdan-kam", score: 7 },
      { label: "Tez-tez", score: 3 },
      { label: "Doimiy", score: 0 },
    ],
  },
  {
    id: 12, category: 'mental',
    text: "Uxlashdan oldin nima qilasiz?",
    options: [
      { label: "Kitob o'qiyman / meditatsiya", score: 10 },
      { label: "Oilam bilan vaqt o'tkazaman", score: 7 },
      { label: "Telefon ko'raman", score: 3 },
      { label: "Kechgacha serial / o'yin", score: 0 },
    ],
  },
  {
    id: 13, category: 'mental',
    text: "Stressni qanday boshqarasiz?",
    options: [
      { label: "Sport / meditatsiya / yozish", score: 10 },
      { label: "Do'stlar bilan gaplashaman", score: 7 },
      { label: "Ovqat / tarmoqlar orqali", score: 3 },
      { label: "Boshqara olmayman", score: 0 },
    ],
  },
  {
    id: 14, category: 'discipline',
    text: "Yangi odatni boshlashda qancha davom ettirasiz?",
    options: [
      { label: "30+ kun", score: 10 },
      { label: "2-3 hafta", score: 7 },
      { label: "1 hafta", score: 3 },
      { label: "2-3 kun", score: 0 },
    ],
  },
  {
    id: 15, category: 'mental',
    text: "Har kuni nima qilishni aniq bilasizmi?",
    options: [
      { label: "Ha, aniq rejam bor", score: 10 },
      { label: "Taxminan bilaman", score: 6 },
      { label: "Yo'q, vaziyatga qarab", score: 3 },
      { label: "Umuman yo'q", score: 0 },
    ],
  },
  // ==== Personal profile (5 new) ====
  {
    id: 16, category: 'profile', type: 'number',
    text: "Yoshingiz nechada?", unit: "yosh",
  },
  {
    id: 17, category: 'profile', type: 'number',
    text: "Bo'yingiz qancha?", unit: "sm",
  },
  {
    id: 18, category: 'profile', type: 'number',
    text: "Vazningiz qancha?", unit: "kg",
  },
  {
    id: 19, category: 'profile', type: 'sex',
    text: "Jinsingiz?",
    options: [
      { label: "♂ Erkak", score: 0, value: "m" },
      { label: "♀ Ayol", score: 0, value: "f" },
    ],
  },
  {
    id: 20, category: 'badhabits', type: 'multi',
    text: "Sizda qaysi yomon odatlar bor? (bir nechtasini tanlang)",
    options: [
      { label: "📱 Telefon/Tarmoqlar (3+ soat)", score: 0, value: "phone" },
      { label: "🍔 Fast food / shirinlik", score: 0, value: "junkfood" },
      { label: "🎮 O'yin (3+ soat)", score: 0, value: "gaming" },
      { label: "🚬 Chekish / vape", score: 0, value: "smoking" },
      { label: "😴 Kech yotish (00:00+)", score: 0, value: "latesleep" },
      { label: "🍕 Ortiqcha ovqat", score: 0, value: "overeating" },
      { label: "📺 Serial / YouTube binge", score: 0, value: "binge" },
      { label: "💤 Snooze / kech turish", score: 0, value: "snooze" },
      { label: "🤥 Bahonalar / kechiktirish", score: 0, value: "procrastination" },
      { label: "🎰 Pornografiya / qimor", score: 0, value: "porn" },
    ],
  },
];

export interface TestResult {
  disciplineScore: number;
  focusScore: number;
  fitnessScore: number;
  addictionLevel: 'low' | 'mid' | 'high';
  energyLevel: 'low' | 'mid' | 'high';
  rank: 'Beginner' | 'Disciplined' | 'Elite' | 'Apex';
  overallScore: number;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  sex?: 'm' | 'f';
  badHabits?: string[];
  bmi?: number;
  bmiCategory?: string;
  recommendedHabits?: { name: string; difficulty: number; xp_reward: number; reason: string }[];
}

export function calculateResults(
  answers: Record<number, number>,
  profile?: { age?: number; height?: number; weight?: number; sex?: 'm'|'f'; badHabits?: string[] }
): TestResult {
  const catScores: Record<string, number[]> = {};
  questions.forEach((q) => {
    if (!q.options || q.type === 'number' || q.type === 'sex' || q.type === 'multi') return;
    if (!catScores[q.category]) catScores[q.category] = [];
    if (answers[q.id] !== undefined) catScores[q.category].push(answers[q.id]);
  });

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const discipline = Math.round(avg(catScores['discipline'] || []) * 10);
  const focus = Math.round(avg(catScores['focus'] || []) * 10);
  const fitness = Math.round(avg(catScores['fitness'] || []) * 10);
  const addictionRaw = avg(catScores['addiction'] || []);
  const mentalRaw = avg(catScores['mental'] || []);
  const financeRaw = avg(catScores['finance'] || []);

  const overall = Math.round((discipline + focus + fitness + addictionRaw * 10 + mentalRaw * 10 + financeRaw * 10) / 6);

  const addictionLevel = addictionRaw >= 7 ? 'low' : addictionRaw >= 4 ? 'mid' : 'high';
  const energyLevel = fitness >= 70 ? 'high' : fitness >= 40 ? 'mid' : 'low';
  const rank = overall >= 85 ? 'Apex' : overall >= 65 ? 'Elite' : overall >= 40 ? 'Disciplined' : 'Beginner';

  // BMI
  let bmi: number | undefined;
  let bmiCategory: string | undefined;
  if (profile?.weight && profile?.height) {
    const hM = profile.height / 100;
    bmi = +(profile.weight / (hM * hM)).toFixed(1);
    bmiCategory = bmi < 18.5 ? "Kam vazn" : bmi < 25 ? "Normal" : bmi < 30 ? "Ortiqcha vazn" : "Semizlik";
  }

  // Generate personalized habits based on weak areas + bad habits + profile
  const recs: { name: string; difficulty: number; xp_reward: number; reason: string }[] = [];
  if (discipline < 60) recs.push({ name: "Ertalab 6:00 da turish", difficulty: 4, xp_reward: 40, reason: "Intizom past" });
  if (focus < 60) recs.push({ name: "1 soat telefonsiz fokus bloki", difficulty: 4, xp_reward: 40, reason: "Fokus past" });
  if (fitness < 60) recs.push({ name: "30 daqiqa harakat (yurish/sport)", difficulty: 3, xp_reward: 30, reason: "Fitness past" });
  if (mentalRaw * 10 < 50) recs.push({ name: "10 daqiqa meditatsiya", difficulty: 2, xp_reward: 20, reason: "Mental darajasi past" });
  if (financeRaw * 10 < 50) recs.push({ name: "Kunlik xarajatlarni yozish", difficulty: 2, xp_reward: 20, reason: "Pul boshqaruvi zaif" });

  // BMI-based
  if (bmi && bmi >= 25) recs.push({ name: "Sahar ovqatlanmasdan 14 soat (intermittent fasting)", difficulty: 4, xp_reward: 40, reason: "Vazn ortiqcha" });
  if (bmi && bmi < 18.5) recs.push({ name: "Kuniga 3 marta to'liq ovqat + protein", difficulty: 3, xp_reward: 30, reason: "Vazn yetishmaydi" });

  // Bad habits → counter habits
  const bh = profile?.badHabits || [];
  if (bh.includes("phone") || bh.includes("binge")) recs.push({ name: "Ekran vaqti 2 soatdan kam", difficulty: 4, xp_reward: 40, reason: "Telefon/serialga bog'liqlik" });
  if (bh.includes("junkfood") || bh.includes("overeating")) recs.push({ name: "Fast food yo'q — uy ovqati", difficulty: 3, xp_reward: 30, reason: "Yomon ovqatlanish" });
  if (bh.includes("gaming")) recs.push({ name: "Maks 1 soat gaming", difficulty: 4, xp_reward: 40, reason: "Gaming bog'liqligi" });
  if (bh.includes("smoking")) recs.push({ name: "Bugun chekmaslik (kun-kun)", difficulty: 5, xp_reward: 50, reason: "Chekishni tashlash" });
  if (bh.includes("latesleep") || bh.includes("snooze")) recs.push({ name: "23:00 da yotish", difficulty: 3, xp_reward: 30, reason: "Uyqu rejimi yomon" });
  if (bh.includes("procrastination")) recs.push({ name: "Kunning eng og'ir vazifasi — birinchi", difficulty: 4, xp_reward: 40, reason: "Kechiktirish odati" });
  if (bh.includes("porn")) recs.push({ name: "Pornografiyadan tiyilish (kun-kun)", difficulty: 5, xp_reward: 50, reason: "Bog'liqlikni yengish" });

  // Always add the foundation
  if (recs.length < 3) {
    recs.push({ name: "30 min kitob o'qish", difficulty: 2, xp_reward: 20, reason: "O'rganish odati" });
    recs.push({ name: "Sovuq dush", difficulty: 3, xp_reward: 30, reason: "Iroda mashqi" });
  }

  // Limit to top 6
  const recommendedHabits = recs.slice(0, 6);

  return {
    disciplineScore: discipline, focusScore: focus, fitnessScore: fitness,
    addictionLevel, energyLevel, rank, overallScore: overall,
    age: profile?.age, heightCm: profile?.height, weightKg: profile?.weight,
    sex: profile?.sex, badHabits: profile?.badHabits, bmi, bmiCategory,
    recommendedHabits,
  };
}
