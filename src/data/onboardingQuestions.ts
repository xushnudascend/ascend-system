export interface Question {
  id: number;
  category: 'discipline' | 'focus' | 'fitness' | 'addiction' | 'finance' | 'mental';
  text: string;
  options: { label: string; score: number }[];
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
];

export interface TestResult {
  disciplineScore: number;
  focusScore: number;
  fitnessScore: number;
  addictionLevel: 'low' | 'mid' | 'high';
  energyLevel: 'low' | 'mid' | 'high';
  rank: 'Beginner' | 'Disciplined' | 'Elite' | 'Apex';
  overallScore: number;
}

export function calculateResults(answers: Record<number, number>): TestResult {
  const catScores: Record<string, number[]> = {};
  questions.forEach((q) => {
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

  return { disciplineScore: discipline, focusScore: focus, fitnessScore: fitness, addictionLevel, energyLevel, rank, overallScore: overall };
}
