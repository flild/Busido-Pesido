'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Eye, ArrowRight, Lock, Star } from 'lucide-react';
import { TiltCard } from './TiltCard';

export interface ArticlePreview {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tag: string;
  views: number;
  is_premium: number;
  created_at: string;
}

// Генератор красивых градиентов для обложек, если нет картинки
const getGradient = (id: number) => {
  const gradients = [
    'from-matcha/40 to-forest/20',
    'from-rose/30 to-caramel/20',
    'from-ice/40 to-matcha/20',
    'from-caramel/30 to-berry/20',
    'from-fog to-snow',
  ];
  return gradients[id % gradients.length];
};

export function BlogList({ initialArticles }: { initialArticles: ArticlePreview[] }) {
  const [filter, setFilter] = useState('all');

  const filteredArticles = initialArticles.filter(art => {
    if (filter === 'all') return true;
    if (filter === 'premium') return art.is_premium === 1;
    if (filter === 'free') return art.is_premium === 0;
    return art.category?.includes(filter);
  });

  return (
    <>
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2.5 mb-12">
        {[
          { id: 'all', label: 'Все статьи' },
          { id: 'free', label: 'В открытом доступе' },
          { id: 'premium', label: 'Premium' },
          { id: 'dogs', label: 'О собаках' },
          { id: 'cats', label: 'О кошках' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-5 py-2.5 rounded-full font-bold text-[14px] transition-all duration-300 border cursor-pointer ${
              filter === btn.id 
                ? 'bg-coal text-white border-coal shadow-md' 
                : 'bg-white text-coal/70 border-forest/15 hover:bg-snow hover:border-forest/40'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="p-16 text-center border border-forest/15 rounded-[32px] bg-white text-coal/50 font-medium">
          По этому фильтру пока нет статей.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((art) => {
              const isPremium = art.is_premium === 1;
              const date = new Date(art.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <motion.div
                  key={art.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full"
                >
                  <Link href={`/blog/${art.slug}`} className="group block w-full outline-none flex h-full">
                    <TiltCard className="w-full flex flex-col h-full rounded-[28px] bg-white border border-forest/15 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(30,43,14,0.06)] group-hover:border-forest/30 overflow-hidden">
                      
                      {/* Обложка (Градиент) */}
                      <div className={`h-[160px] bg-gradient-to-br ${getGradient(art.id)} relative overflow-hidden shrink-0`}>
                        {/* Декоративный паттерн */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,theme(colors.coal)_2px,transparent_0)] bg-[length:16px_16px]"></div>
                        
                        {/* Бэйджи сверху */}
                        <div className="absolute top-5 left-5 right-5 flex justify-between items-start gap-2">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-coal shadow-sm">
                            {art.tag}
                          </span>
                          {isPremium && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                              <Star size={12} /> Pro
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Контентная часть */}
                      <div className="p-7 flex flex-col flex-grow relative">
                        <h3 className="text-[20px] font-bold leading-tight text-coal mb-3 group-hover:text-forest transition-colors">
                          {art.title}
                        </h3>

                        {/* Замануха для премиум статей */}
                        <div className="relative flex-grow mb-6">
                          <p className={`text-[14px] leading-[1.6] text-coal/70 transition-all duration-500 ${isPremium ? 'blur-[4px] select-none opacity-60 group-hover:blur-[5px]' : ''}`}>
                            {art.summary}
                          </p>
                          
                          {isPremium && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20">
                              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-sm border border-forest/10 text-coal">
                                <Lock size={20} className="text-forest" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-forest text-center leading-tight">
                                  Доступно<br/>по подписке
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Подвал карточки */}
                        <div className="mt-auto pt-5 border-t border-forest/10 flex items-center justify-between text-[12px] font-bold text-coal/40">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} /> {date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye size={14} /> {art.views || 0}
                            </span>
                          </div>
                          <span className="w-8 h-8 rounded-full bg-snow flex items-center justify-center text-coal/50 group-hover:bg-forest group-hover:text-white transition-colors">
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>

                    </TiltCard>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}