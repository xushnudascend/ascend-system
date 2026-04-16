import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { books, quotes, bookCategories } from "@/data/books";
import { ArrowLeft, Star, BookOpen, Quote as QuoteIcon, Search } from "lucide-react";

export default function BooksPage() {
  const [tab, setTab] = useState<'books' | 'quotes'>('books');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const filteredBooks = books.filter(b => {
    const matchCat = !selectedCategory || b.category === selectedCategory;
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredQuotes = quotes.filter(q => {
    const matchCat = !selectedCategory || q.category === selectedCategory;
    const matchSearch = !search || q.text.toLowerCase().includes(search.toLowerCase()) || q.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="font-heading font-bold">Kutubxona</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('books')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'books' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
            <BookOpen className="w-4 h-4 inline mr-1" /> Kitoblar
          </button>
          <button onClick={() => setTab('quotes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'quotes' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
            <QuoteIcon className="w-4 h-4 inline mr-1" /> Iqtiboslar
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
            Hammasi
          </button>
          {bookCategories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
              {c}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'books' ? (
            <motion.div key="books" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {filteredBooks.map((book, i) => (
                <motion.div key={book.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-5 rounded-xl border border-border bg-card card-hover">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: book.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">{book.category}</span>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    <span className="text-foreground font-medium">Asosiy g'oya: </span>{book.keyIdea}
                  </p>
                </motion.div>
              ))}
              {filteredBooks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Kitob topilmadi</p>
              )}
            </motion.div>
          ) : (
            <motion.div key="quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {filteredQuotes.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-5 rounded-xl border border-border bg-card">
                  <p className="text-foreground leading-relaxed italic">"{q.text}"</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-primary font-medium">— {q.author}</p>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{q.category}</span>
                  </div>
                  {q.bookTitle && <p className="text-xs text-muted-foreground mt-1">📖 {q.bookTitle}</p>}
                </motion.div>
              ))}
              {filteredQuotes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Iqtibos topilmadi</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
