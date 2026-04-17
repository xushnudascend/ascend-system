import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "uz" | "en" | "ru";

const dict: Record<Lang, Record<string, string>> = {
  uz: {
    dashboard: "Dashboard", courses: "Kurslar", books: "Kitoblar",
    analytics: "Analitika", community: "Davra", profile: "Profil",
    leaderboard: "Reyting", aiMentor: "AI Mentor", logout: "Chiqish",
    todayTasks: "Bugungi vazifalar", disciplineScore: "Intizom balli",
    streak: "Streak", days: "kun", level: "Daraja",
    addHabit: "Odat qo'shish", sections: "Bo'limlar",
    weeklyProgress: "Haftalik progress", bmiCalc: "BMI Kalkulyator",
    weight: "Vazn (kg)", height: "Bo'y (sm)", yourBmi: "Sizning BMI",
    askQuestion: "Savol bering, maslahat oling",
    write: "Yozing...", post: "Post yuborish", noPosts: "Hozircha postlar yo'q. Birinchi bo'ling!",
  },
  en: {
    dashboard: "Dashboard", courses: "Courses", books: "Library",
    analytics: "Analytics", community: "Community", profile: "Profile",
    leaderboard: "Leaderboard", aiMentor: "AI Mentor", logout: "Sign out",
    todayTasks: "Today's habits", disciplineScore: "Discipline score",
    streak: "Streak", days: "d", level: "Level",
    addHabit: "Add habit", sections: "Sections",
    weeklyProgress: "Weekly progress", bmiCalc: "BMI Calculator",
    weight: "Weight (kg)", height: "Height (cm)", yourBmi: "Your BMI",
    askQuestion: "Ask, get cold advice",
    write: "Write...", post: "Post", noPosts: "No posts yet. Be first!",
  },
  ru: {
    dashboard: "Дашборд", courses: "Курсы", books: "Библиотека",
    analytics: "Аналитика", community: "Сообщество", profile: "Профиль",
    leaderboard: "Рейтинг", aiMentor: "AI Ментор", logout: "Выйти",
    todayTasks: "Привычки на сегодня", disciplineScore: "Дисциплина",
    streak: "Стрик", days: "дн", level: "Уровень",
    addHabit: "Добавить привычку", sections: "Разделы",
    weeklyProgress: "Неделя", bmiCalc: "Калькулятор BMI",
    weight: "Вес (кг)", height: "Рост (см)", yourBmi: "Ваш BMI",
    askQuestion: "Задайте вопрос — получите жёсткий совет",
    write: "Напишите...", post: "Опубликовать", noPosts: "Постов пока нет. Будьте первым!",
  },
};

interface I18nCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; }
const I18nContext = createContext<I18nCtx | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("ascend_lang") as Lang) || "uz");
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("ascend_lang", l); };
  const t = (k: string) => dict[lang][k] ?? dict.en[k] ?? k;
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
};
