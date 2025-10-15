import { useState, useEffect } from 'react';

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  createdAt: string;
}

const QUOTES_STORAGE_KEY = 'custom-quotes';

const DEFAULT_QUOTES: Quote[] = [
  {
    id: '1',
    text: 'Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.',
    author: 'Colin Powell',
    category: 'motivasi',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Hidup adalah 10% apa yang terjadi pada kita dan 90% bagaimana kita meresponnya.',
    author: 'Charles R. Swindoll',
    category: 'hikmah',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    text: 'Tidak ada yang mustahil bagi mereka yang mau mencoba.',
    author: 'Alexander the Great',
    category: 'motivasi',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    text: 'Kesempatan tidak datang dua kali. Ambil setiap kesempatan yang ada.',
    author: 'Unknown',
    category: 'inspirasi',
    createdAt: new Date().toISOString()
  }
];

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
    if (stored) {
      setQuotes(JSON.parse(stored));
    } else {
      setQuotes(DEFAULT_QUOTES);
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(DEFAULT_QUOTES));
    }
  }, []);

  const saveQuotes = (newQuotes: Quote[]) => {
    setQuotes(newQuotes);
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(newQuotes));
  };

  const addQuote = (text: string, author: string, category: string) => {
    const newQuote: Quote = {
      id: crypto.randomUUID(),
      text,
      author,
      category,
      createdAt: new Date().toISOString()
    };
    saveQuotes([...quotes, newQuote]);
  };

  const editQuote = (id: string, text: string, author: string, category: string) => {
    const updated = quotes.map(q => 
      q.id === id ? { ...q, text, author, category } : q
    );
    saveQuotes(updated);
  };

  const deleteQuote = (id: string) => {
    saveQuotes(quotes.filter(q => q.id !== id));
  };

  const getRandomQuote = (): Quote => {
    if (quotes.length === 0) return DEFAULT_QUOTES[0];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  const getDailyQuote = (): Quote => {
    if (quotes.length === 0) return DEFAULT_QUOTES[0];
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return quotes[dayOfYear % quotes.length];
  };

  return {
    quotes,
    addQuote,
    editQuote,
    deleteQuote,
    getRandomQuote,
    getDailyQuote
  };
};
