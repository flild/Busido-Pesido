'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TiltCard } from './TiltCard';
import { motion, AnimatePresence } from 'framer-motion';

// Типизируем, раз уж начали наводить порядок
export interface ArticleData {
  id: number;
  slug: string;
  category: string;
  tag: string;
  title: string;
  summary: string;
  // Добавляем акценты, если их нет в БД — сгенерим на лету или добавим позже
  accent?: string; 
  textAccent?: string;
}

const filterTabs = [
  { id: 'all', label: 'Все', activeClass: 'bg-coal text-white border-coal' },
  { id: 'free', label: 'Бесплатно', activeClass: 'bg-berry text-white border-berry' },
  { id: 'subscription', label: 'По подписке', activeClass: 'bg-forest text-white border-forest' },
  { id: 'dogs', label: 'Собаки', activeClass: 'bg-caramel text-espresso border-caramel' },
  { id: 'cats', label: 'Кошки', activeClass: 'bg-ice text-white border-ice' },
  { id: 'professionals', label: 'Специалистам', activeClass: 'bg-espresso text-white border-espresso' }
];

export function LibraryInteractive({ initialArticles }: { initialArticles: ArticleData[] }) {
  const [filter, setFilter] = useState('all');

  if (!initialArticles || initialArticles.length === 0) {
    return <div className="p-10 text-center text-coal/50 border border-forest/15 rounded-3xl">Материалов пока нет</div>;
  }

  // Фильтруем. Считаем, что в category лежит строка с тегами через пробел
  const filteredMaterials = initialArticles.filter(m => filter === 'all' || (m.category && m.category.includes(filter)));
  const displayMaterials = filteredMaterials.slice(0, 6);

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-[32px]">
        {filterTabs.map((btn) => {
          const isActive = filter === btn.id;
          return (
            <button 
              key={btn.id}
              className={`px-4 py-2.5 border rounded-full font-[820] text-[14px] cursor-pointer transition-all duration-300 ${isActive ? btn.activeClass : 'bg-white text-coal border-forest/15 hover:bg-snow hover:border-forest/30 shadow-sm hover:shadow-md'}`} 
              onClick={() => setFilter(btn.id)}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
      
      {/* layout на родителе заставляет грид плавно менять высоту, 
        а не дергаться рывком при изменении количества элементов 
      */}
      <motion.div layout className="grid grid-cols-3 gap-5 tablet:grid-cols-2 mobile:grid-cols-1 items-stretch mb-10">
        <AnimatePresence mode="sync">
          {displayMaterials.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: [0.2, 0.75, 0.2, 1] }}
              className="flex h-full"
            >
              <Link href={`/library/${m.slug}`} className="group block h-full w-full outline-none">
                <TiltCard className="h-full w-full rounded-[28px] bg-white border border-forest/10 shadow-sm transition-all duration-500 relative flex flex-col overflow-hidden group-hover:-translate-y-1.5 group-hover:shadow-[0_25px_60px_rgba(30,43,14,0.08)] group-hover:border-forest/20">
                  
                  {/* Цветной корешок документа */}
                  <div className={`absolute top-0 left-0 bottom-0 w-[6px] ${m.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Декоративный круг на фоне - увеличивается при ховере */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-bl from-fog to-transparent rounded-full opacity-20 group-hover:scale-[1.8] group-hover:opacity-40 transition-all duration-700 pointer-events-none`} />

                  <div className="p-8 max-md:p-6 pl-[34px] flex flex-col h-full relative z-10">
                    <span className={`inline-block mb-4 text-[10px] font-[950] tracking-widest uppercase ${m.textAccent}`}>
                      {m.tag}
                    </span>
                    
                    <h3 className="text-[22px] max-md:text-[20px] font-bold leading-tight mb-3 text-coal group-hover:text-forest transition-colors duration-300">
                      {m.title}
                    </h3>
                    
                    <p className="text-coal/65 leading-relaxed text-[14px] flex-grow mb-6">
                      {m.summary}
                    </p>
                    
                    {/* Кнопка "Читать", стрелка уезжает при ховере на всю карточку */}
                    <div className={`self-start flex items-center gap-2 text-[13px] font-[850] uppercase tracking-wider ${m.textAccent} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      Открыть материал
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Задел на будущее: переход в полную библиотеку со всеми фильтрами и статьями */}
      <motion.div layout className="flex justify-center">
        <Link 
          href="/library" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-forest/15 bg-white text-[15px] font-[800] text-coal shadow-sm hover:bg-snow hover:border-forest/30 transition-all"
        >
          Все материалы библиотеки <span className="text-forest">→</span>
        </Link>
      </motion.div>
    </>
  );
}