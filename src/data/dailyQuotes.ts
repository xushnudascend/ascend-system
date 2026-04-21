export const dailyQuotes = [
  { text: "Sen o'ylagan narsang sen bo'lasan.", author: "Marcus Aurelius" },
  { text: "Disciplina — bu o'zingni sevishning eng yuqori shakli.", author: "Anonymous" },
  { text: "Eng kuchli odam — o'zini yenga olgan odam.", author: "Lao Tzu" },
  { text: "Bahonadan ko'ra natija qadrli.", author: "David Goggins" },
  { text: "Har kuni 1% yaxshilan — bir yilda 37x bo'lasan.", author: "James Clear" },
  { text: "Miya — sening eng yaxshi do'sting yoki eng yomon dushmaning.", author: "Naval Ravikant" },
  { text: "Kim erta turolmasa — hayotni boshqara olmaydi.", author: "Robin Sharma" },
  { text: "Qiyinchilik — bu sening haqiqiy o'zingni ko'rsatadigan oyna.", author: "Epictetus" },
  { text: "Vaqt — eng qimmat valyuta. Uni isrof qilma.", author: "Seneca" },
  { text: "Sen yiqilgan joyingdan emas — yana qancha turganingdan tanilasan.", author: "Vince Lombardi" },
  { text: "Qo'rquv — yolg'on. Harakat — haqiqat.", author: "Anonymous" },
  { text: "Komfort — sening dushmaning. Diskomfortni sev.", author: "Jocko Willink" },
  { text: "Bugun qiyin bo'lsa — ertaga oson bo'ladi. Bugun oson bo'lsa — ertaga qiyin.", author: "Jerzy Gregorek" },
  { text: "Sen — sening eng yomon kunlaringning yig'indisi emas. Sen — qancha marta turganingsan.", author: "Anonymous" },
  { text: "Erkinlik — bu istaganini qilish emas. Kerakli narsani qilish.", author: "Stoic" },
  { text: "Pul ishlash — ko'nikma. O'rganilmaganlar uchun lotereya.", author: "Naval" },
  { text: "O'qigan kitobing — sening kelajakdagi miya.", author: "Charlie Munger" },
  { text: "Bo'sh ekran oldida 4 soat — har kuni — sen mediokrsan.", author: "Anonymous" },
  { text: "Mukammal reja kechqurun emas. Yomon reja hozir.", author: "George Patton" },
  { text: "Sen niyatlaring emas — odatlaringsan.", author: "Aristotel" },
];

export function getQuoteOfDay() {
  const day = Math.floor(Date.now() / 86400000);
  return dailyQuotes[day % dailyQuotes.length];
}