import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "uz" | "en" | "ru" | "tr";

const dict: Record<Lang, Record<string, string>> = {
  uz: {
    dashboard: "Boshqaruv", courses: "Kurslar", books: "Kutubxona",
    analytics: "Analitika", community: "Davra", profile: "Profil",
    leaderboard: "Reyting", aiMentor: "AI Mentor", logout: "Chiqish",
    todayTasks: "Bugungi vazifalar", disciplineScore: "Intizom balli",
    streak: "Streak", days: "kun", level: "Daraja", xp: "XP",
    addHabit: "Odat qo'shish", sections: "Bo'limlar",
    weeklyProgress: "Haftalik progress", bmiCalc: "BMI Kalkulyator",
    weight: "Vazn (kg)", height: "Bo'y (sm)", yourBmi: "Sizning BMI",
    askQuestion: "Savol bering, sovuq maslahat oling",
    write: "Yozing...", post: "Post yuborish", noPosts: "Hozircha postlar yo'q. Birinchi bo'ling!",
    rank: "Daraja", search: "Qidirish...", all: "Hammasi",
    quotes: "Iqtiboslar", essays: "Insholar", books_label: "Kitoblar",
    pricing: "Narxlar", free: "Bepul", premium: "Premium",
    upgrade: "Premium-ga o'tish", login: "Kirish", signup: "Ro'yxatdan o'tish",
    home: "Bosh sahifa", start: "Boshlash", continue: "Davom etish",
    friends: "Do'stlar", settings: "Sozlamalar",
  },
  en: {
    dashboard: "Dashboard", courses: "Courses", books: "Library",
    analytics: "Analytics", community: "Community", profile: "Profile",
    leaderboard: "Leaderboard", aiMentor: "AI Mentor", logout: "Sign out",
    todayTasks: "Today's habits", disciplineScore: "Discipline score",
    streak: "Streak", days: "d", level: "Level", xp: "XP",
    addHabit: "Add habit", sections: "Sections",
    weeklyProgress: "Weekly progress", bmiCalc: "BMI Calculator",
    weight: "Weight (kg)", height: "Height (cm)", yourBmi: "Your BMI",
    askQuestion: "Ask. Get cold advice.",
    write: "Write...", post: "Post", noPosts: "No posts yet. Be first!",
    rank: "Rank", search: "Search...", all: "All",
    quotes: "Quotes", essays: "Essays", books_label: "Books",
    pricing: "Pricing", free: "Free", premium: "Premium",
    upgrade: "Upgrade to Premium", login: "Sign in", signup: "Sign up",
    home: "Home", start: "Start", continue: "Continue",
    friends: "Friends", settings: "Settings",
  },
  ru: {
    dashboard: "Дашборд", courses: "Курсы", books: "Библиотека",
    analytics: "Аналитика", community: "Сообщество", profile: "Профиль",
    leaderboard: "Рейтинг", aiMentor: "AI Ментор", logout: "Выйти",
    todayTasks: "Привычки на сегодня", disciplineScore: "Дисциплина",
    streak: "Стрик", days: "дн", level: "Уровень", xp: "XP",
    addHabit: "Добавить привычку", sections: "Разделы",
    weeklyProgress: "Неделя", bmiCalc: "Калькулятор BMI",
    weight: "Вес (кг)", height: "Рост (см)", yourBmi: "Ваш BMI",
    askQuestion: "Задайте вопрос — получите жёсткий совет",
    write: "Напишите...", post: "Опубликовать", noPosts: "Постов пока нет. Будьте первым!",
    rank: "Ранг", search: "Поиск...", all: "Все",
    quotes: "Цитаты", essays: "Эссе", books_label: "Книги",
    pricing: "Цены", free: "Бесплатно", premium: "Премиум",
    upgrade: "Перейти на Премиум", login: "Войти", signup: "Регистрация",
    home: "Главная", start: "Старт", continue: "Продолжить",
    friends: "Друзья", settings: "Настройки",
  },
  tr: {
    dashboard: "Pano", courses: "Kurslar", books: "Kütüphane",
    analytics: "Analitik", community: "Topluluk", profile: "Profil",
    leaderboard: "Sıralama", aiMentor: "AI Mentor", logout: "Çıkış",
    todayTasks: "Bugünkü görevler", disciplineScore: "Disiplin puanı",
    streak: "Seri", days: "gün", level: "Seviye", xp: "XP",
    addHabit: "Alışkanlık ekle", sections: "Bölümler",
    weeklyProgress: "Haftalık ilerleme", bmiCalc: "BMI Hesaplayıcı",
    weight: "Kilo (kg)", height: "Boy (cm)", yourBmi: "BMI'niz",
    askQuestion: "Sorun, soğuk tavsiye alın",
    write: "Yazın...", post: "Gönder", noPosts: "Henüz gönderi yok. İlk siz olun!",
    rank: "Rütbe", search: "Ara...", all: "Tümü",
    quotes: "Alıntılar", essays: "Denemeler", books_label: "Kitaplar",
    pricing: "Fiyatlar", free: "Ücretsiz", premium: "Premium",
    upgrade: "Premium'a geç", login: "Giriş", signup: "Kayıt ol",
    home: "Anasayfa", start: "Başla", continue: "Devam",
    friends: "Arkadaşlar", settings: "Ayarlar",
  },
};

interface I18nCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; }
const I18nContext = createContext<I18nCtx | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("ascend_lang") as Lang) || "uz");
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("ascend_lang", l); document.documentElement.lang = l; };
  const t = (k: string) => dict[lang][k] ?? dict.en[k] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
};
