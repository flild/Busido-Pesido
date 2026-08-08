'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Eye, ArrowRight, Lock, Star, TrendingUp, Clock } from 'lucide-react';
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
  main_image?: string | null; 
  reads_count?: number;      
}

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
  const [sort, setSort] = useState<'newest' | 'popular'>('newest');

  // Фильтрация и умная сортировка
  const processedArticles = useMemo(() => {
    let result = initialArticles.filter(art => {
      if (filter === 'all') return true;
      if (filter === 'premium') return art.is_premium === 1;
      if (filter === 'free') return art.is_premium === 0;
      return art.category?.includes(filter);
    });

    if (sort === 'popular') {
      result.sort((a, b) => {
        // Умная сортировка: если есть дочитывания (reads_count), приоритет им, иначе по просмотрам
        const scoreA = (a.reads_count || 0) * 2 + (a.views || 0);
        const scoreB = (b.reads_count || 0) * 2 + (b.views || 0);
        return scoreB - scoreA;
      });
    } else {
      // newest (по дате)
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialArticles, filter, sort]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        {/* Фильтры */}
        <div className="flex flex-wrap gap-2.5">
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

        {/* Сортировка */}
        <div className="flex bg-snow rounded-full p-1 border border-forest/10">
          <button 
            onClick={() => setSort('newest')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all ${sort === 'newest' ? 'bg-white text-coal shadow-sm' : 'text-coal/50 hover:text-coal'}`}
          >
            <Clock size={14} /> Свежее
          </button>
          <button 
            onClick={() => setSort('popular')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all ${sort === 'popular' ? 'bg-white text-coal shadow-sm' : 'text-coal/50 hover:text-coal'}`}
          >
            <TrendingUp size={14} /> Популярное
          </button>
        </div>
      </div>

      {processedArticles.length === 0 ? (
        <div className="p-16 text-center border border-forest/15 rounded-[32px] bg-white text-coal/50 font-medium">
          По этому фильтру пока нет статей.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 items-stretch">
          <AnimatePresence mode="popLayout">
            {processedArticles.map((art) => {
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
                      
                      {/* Обложка (Фотография ИЛИ Градиент) */}
                      <div className={`h-[180px] relative overflow-hidden shrink-0 ${!art.main_image ? `bg-gradient-to-br ${getGradient(art.id)}` : 'bg-snow'}`}>
                        {art.main_image ? (
                          <Image 
                            src={art.main_image} 
                            alt={art.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,theme(colors.coal)_2px,transparent_0)] bg-[length:16px_16px]"></div>
                        )}
                        
                        {/* Бэйджи сверху (поверх фото или градиента) */}
                        <div className="absolute top-5 left-5 right-5 flex justify-between items-start gap-2 z-10">
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