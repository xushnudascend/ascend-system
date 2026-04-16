export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  keyIdea: string;
  rating: number;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  bookTitle?: string;
  category: string;
}

export const bookCategories = [
  'Intizom', 'Psixologiya', 'Moliya', 'Sog\'lomlik', 'Liderlik', 'Ijodkorlik', 'Munosabatlar', 'Biznes', 'Falsafa', 'Aql'
];

export const books: Book[] = [
  { id: '1', title: 'Atomic Habits', author: 'James Clear', category: 'Intizom', keyIdea: "Kichik o'zgarishlar katta natijalarga olib keladi. 1% yaxshilanish har kuni — 1 yilda 37 marta yaxshilanish.", rating: 5 },
  { id: '2', title: 'Can\'t Hurt Me', author: 'David Goggins', category: 'Intizom', keyIdea: "Siz o'z imkoniyatlaringizning faqat 40% ni ishlatayapsiz. Og'riq — bu kuchayish vositasi.", rating: 5 },
  { id: '3', title: 'The 5 AM Club', author: 'Robin Sharma', category: 'Intizom', keyIdea: "Ertalab 5da turish — 20/20/20 formula: 20 min sport, 20 min o'rganish, 20 min reja.", rating: 4 },
  { id: '4', title: 'Deep Work', author: 'Cal Newport', category: 'Aql', keyIdea: "Chuqur konsentratsiya — 21-asrning eng qimmatli ko'nikmasi. Shallow work ni minimallang.", rating: 5 },
  { id: '5', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', category: 'Psixologiya', keyIdea: "Ikki tizim: Tezkor (hissiy) va Sekin (mantiqiy). Ko'p xatolarimiz 1-tizimdan.", rating: 5 },
  { id: '6', title: 'The Power of Habit', author: 'Charles Duhigg', category: 'Psixologiya', keyIdea: "Odat loop: Trigger → Routine → Reward. Loopni tushunsangiz, o'zgartirasiz.", rating: 5 },
  { id: '7', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Moliya', keyIdea: "Boylar aktivlar sotib oladi, kambag'allar passivlar. Pul sizga ishlashi kerak.", rating: 4 },
  { id: '8', title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Moliya', keyIdea: "Pul bilan munosabat — texnik emas, psixologik masala. Sabr eng kuchli vosita.", rating: 5 },
  { id: '9', title: 'Why We Sleep', author: 'Matthew Walker', category: "Sog'lomlik", keyIdea: "8 soat uyqu = eng kuchli supplement. Kamuyqu hamma sohaga zarar.", rating: 5 },
  { id: '10', title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', category: 'Psixologiya', keyIdea: "Hamma narsaga ahamiyat bermang. Faqat muhim narsalarga. Og'riq = o'sish.", rating: 4 },
  { id: '11', title: 'Meditations', author: 'Marcus Aurelius', category: 'Falsafa', keyIdea: "Nazorat qila oladigan narsaga konsentratsiya. Qolganini qo'y.", rating: 5 },
  { id: '12', title: 'Man\'s Search for Meaning', author: 'Viktor Frankl', category: 'Falsafa', keyIdea: "Eng og'ir vaziyatda ham ma'no topsa bo'ladi. Ma'no = motivatsiya.", rating: 5 },
  { id: '13', title: '12 Rules for Life', author: 'Jordan Peterson', category: 'Psixologiya', keyIdea: "Tartibni xaosdan boshlang: xonangizni yig'ishtiring, keyin dunyoni.", rating: 4 },
  { id: '14', title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', category: 'Liderlik', keyIdea: "Proaktiv bo'ling. Maqsadni aniqlang. Muhimni birinchi qiling.", rating: 5 },
  { id: '15', title: 'Discipline Equals Freedom', author: 'Jocko Willink', category: 'Intizom', keyIdea: "Intizom = erkinlik. Qanchalik intizomli bo'lsangiz, shunchalik erkin.", rating: 5 },
  { id: '16', title: 'The Compound Effect', author: 'Darren Hardy', category: 'Intizom', keyIdea: "Kichik qarorlar vaqt o'tishi bilan ulkan natijalar beradi.", rating: 4 },
  { id: '17', title: 'Mindset', author: 'Carol Dweck', category: 'Psixologiya', keyIdea: "Growth mindset vs Fixed mindset. Qobiliyat emas, harakat muhim.", rating: 5 },
  { id: '18', title: 'Flow', author: 'Mihaly Csikszentmihalyi', category: 'Aql', keyIdea: "Flow holati — qobiliyat va qiyinlik muvozanati. Bu yerda eng yaxshi ish chiqadi.", rating: 4 },
  { id: '19', title: 'The War of Art', author: 'Steven Pressfield', category: 'Ijodkorlik', keyIdea: "Resistance — har bir professional dushman. Har kuni o'tirib ishla.", rating: 5 },
  { id: '20', title: 'Grit', author: 'Angela Duckworth', category: 'Intizom', keyIdea: "Talent emas, azm muhim. Passion + Perseverance = Grit.", rating: 5 },
  { id: '21', title: 'The Obstacle Is the Way', author: 'Ryan Holiday', category: 'Falsafa', keyIdea: "To'siq — bu yo'l. Muammoni imkoniyatga aylantiring.", rating: 4 },
  { id: '22', title: 'Never Split the Difference', author: 'Chris Voss', category: 'Biznes', keyIdea: "Muzokarada hissiyotni tushunish mantiqdan muhimroq.", rating: 5 },
  { id: '23', title: 'Think and Grow Rich', author: 'Napoleon Hill', category: 'Moliya', keyIdea: "Fikr → Ishonch → Harakat → Natija. Maqsadni aniq qo'ying.", rating: 4 },
  { id: '24', title: 'The Lean Startup', author: 'Eric Ries', category: 'Biznes', keyIdea: "Build-Measure-Learn. Tez sinab, tez o'rganing.", rating: 4 },
  { id: '25', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Aql', keyIdea: "Insoniyat tarixi — hikoya aytish qobiliyati asosida qurilgan.", rating: 5 },
  { id: '26', title: 'Outliers', author: 'Malcolm Gladwell', category: 'Psixologiya', keyIdea: "10,000 soat qoidasi. Muvaffaqiyat = Imkoniyat + Mehnat.", rating: 4 },
  { id: '27', title: 'The 4-Hour Workweek', author: 'Tim Ferriss', category: 'Biznes', keyIdea: "80/20 qoidasi. Kam ishlang, ko'p natija oling. Avtomatlashtiring.", rating: 4 },
  { id: '28', title: 'Influence', author: 'Robert Cialdini', category: 'Psixologiya', keyIdea: "6 ta ta'sir printsipi: reciprocity, commitment, social proof, authority, liking, scarcity.", rating: 5 },
  { id: '29', title: 'How to Win Friends', author: 'Dale Carnegie', category: 'Munosabatlar', keyIdea: "Odamlarni tushunish — eng kuchli ko'nikma. Eshiting, hurmat qiling.", rating: 5 },
  { id: '30', title: 'The Almanack of Naval Ravikant', author: 'Eric Jorgenson', category: 'Moliya', keyIdea: "Boylik = Specific knowledge + Leverage + Judgment.", rating: 5 },
];

export const quotes: Quote[] = [
  { id: '1', text: "Intizom — bu erga qo'ngan narsani bajarish, kayfiyatingiz qanday bo'lishidan qat'i nazar.", author: "Jocko Willink", category: 'Intizom' },
  { id: '2', text: "Siz bir kunning mahsuli emassiz. Siz ko'p yillik odatlarning mahsulisiz.", author: "James Clear", bookTitle: 'Atomic Habits', category: 'Intizom' },
  { id: '3', text: "Qiyinchilik — bu yo'l. Osonlik — bu tuzoq.", author: "Ryan Holiday", category: 'Falsafa' },
  { id: '4', text: "Ertaga kuchli bo'lish uchun bugun og'riqni qabul qiling.", author: "David Goggins", category: 'Intizom' },
  { id: '5', text: "Muvaffaqiyat — bu oddiy narsalarni g'ayrioddiy izchillik bilan bajarish.", author: "Jim Rohn", category: 'Intizom' },
  { id: '6', text: "O'zingiz o'ylagan narsa — o'zingiz bo'lasiz.", author: "Buddha", category: 'Psixologiya' },
  { id: '7', text: "Eng yaxshi vaqt 20 yil oldin edi. Ikkinchi eng yaxshi vaqt — hozir.", author: "Xitoy maqoli", category: 'Falsafa' },
  { id: '8', text: "Pul — xo'jayin uchun yomon, lekin qul uchun a'lo.", author: "Francis Bacon", category: 'Moliya' },
  { id: '9', text: "Sog'lig'ingiz — birinchi boyligingiz.", author: "Ralph Waldo Emerson", category: "Sog'lomlik" },
  { id: '10', text: "Uxlagan odam hech qachon baliq tutmaydi.", author: "Xalq maqoli", category: 'Intizom' },
  { id: '11', text: "Ko'pchilik 1 yilda qila oladigan narsani oshirib baholaydi, 10 yilda qila oladigan narsani kamsitiadi.", author: "Bill Gates", category: 'Biznes' },
  { id: '12', text: "Kuchli odam — o'z nafsini yenggan odam.", author: "Hadis", category: 'Intizom' },
  { id: '13', text: "Har bir usta bir vaqtlar yangi boshlovchi edi.", author: "Noma'lum", category: 'Falsafa' },
  { id: '14', text: "Sizning tarmoqingiz — sizning boyligingiz.", author: "Porter Gale", category: 'Biznes' },
  { id: '15', text: "Qo'rquv — uni orqali o'tganingizda boshqa tomonida nima borligini bilasiz.", author: "Noma'lum", category: 'Psixologiya' },
  { id: '16', text: "Eng qiyin qadam — birinchi qadam.", author: "Noma'lum", category: 'Intizom' },
  { id: '17', text: "Aqlli odam o'rganadi, dono odam o'rgatadi.", author: "Noma'lum", category: 'Aql' },
  { id: '18', text: "Tanangizga yaxshi munosabatda bo'ling. Bu sizning yagona yashash joyingiz.", author: "Jim Rohn", category: "Sog'lomlik" },
  { id: '19', text: "Muvaffaqiyatsizlik — bu boshidan boshlash imkoniyati, faqat bu safar aqlliroq.", author: "Henry Ford", category: 'Biznes' },
  { id: '20', text: "O'qish — bu o'zingiz bilan suhbat.", author: "Noma'lum", category: 'Aql' },
];
