// components/ReviewCarousel.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { TiltCard } from './TiltCard';
import Image from 'next/image';

export interface Review {
  id: number;
  category: string;
  tag: string;
  pet_name: string;
  breed: string;
  text: string;
  author: string;
  format: string;
  image_url: string;
}

const filterTabs = [
  { id: 'all', label: 'Все истории', activeColor: 'bg-coal text-white border-coal' },
  { id: 'dog', label: 'Собаки', activeColor: 'bg-matcha text-white border-matcha' },
  { id: 'cat', label: 'Кошки', activeColor: 'bg-ice text-white border-ice' },
  { id: 'support', label: 'Сопровождение', activeColor: 'bg-rose text-white border-rose' }
];

export function ReviewCarousel({ initialReviews }: { initialReviews: Review[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const filteredReviews = initialReviews.filter(
    (review) => activeCategory === 'all' || review.category === activeCategory
  );

  const currentReview = filteredReviews[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const handleFilter = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentIndex(0);
    setDirection(1);
  };

  const slideVariants: Variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: [0.2, 0.75, 0.2, 1] }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      filter: 'blur(4px)',
      transition: { duration: 0.3, ease: 'easeIn' }
    })
  };

  if (!currentReview) return <div className="text-center p-10 text-coal/50">Отзывов пока нет.</div>;

  return (
    <>
      {/* ... Верхний блок с фильтрами и кнопками остается без изменений ... */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 max-md:mb-8">
        <div className="flex gap-2.5 flex-wrap">
          {filterTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => handleFilter(tab.id)}
                className={`px-4 py-2.5 border rounded-full font-[820] text-[14px] cursor-pointer transition-all duration-300 ${isActive ? tab.activeColor : 'bg-white text-coal/70 border-forest/15 hover:bg-snow hover:text-coal'}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 max-md:hidden">
          <button onClick={handlePrev} className="w-[46px] h-[46px] rounded-full border border-forest/15 bg-white text-coal flex items-center justify-center cursor-pointer transition-colors hover:bg-snow hover:border-forest/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={handleNext} className="w-[46px] h-[46px] rounded-full border border-forest/15 bg-white text-coal flex items-center justify-center cursor-pointer transition-colors hover:bg-snow hover:border-forest/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <TiltCard className="w-full min-h-[420px] max-md:min-h-[480px] rounded-[38px] bg-white border border-forest/10 shadow-[0_28px_70px_rgba(30,43,14,0.06)] relative overflow-hidden" initialRotateZ={0}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(240,114,150,0.08),transparent_22rem),radial-gradient(circle_at_88%_80%,rgba(111,143,191,0.08),transparent_23rem)] pointer-events-none" />
        <div className="absolute -top-4 -right-2 text-[240px] font-serif leading-none text-forest/[0.03] pointer-events-none select-none">&rdquo;</div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentReview.id}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 flex flex-col h-full p-12 max-md:p-8"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="relative w-[72px] h-[72px] rounded-[20px] overflow-hidden bg-fog shrink-0 shadow-sm">
                {/* Исправлено на image_url из БД */}
                <Image src={currentReview.image_url} alt={currentReview.pet_name} fill className="object-cover" sizes="72px" />
              </div>
              <div>
                <span className="inline-block mb-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-snow text-coal/60 border border-forest/10">
                  {currentReview.tag}
                </span>
                {/* Исправлено на pet_name */}
                <h4 className="text-[19px] font-bold text-coal leading-none mb-1">{currentReview.pet_name}</h4>
                <p className="text-[13px] font-medium text-coal/50">{currentReview.breed}</p>
              </div>
            </div>

            <blockquote className="text-[24px] max-md:text-[20px] leading-[1.45] font-[500] tracking-tight text-coal mb-10 flex-grow">
              «{currentReview.text}»
            </blockquote>

            <div className="mt-auto pt-6 border-t border-forest/10 flex flex-wrap items-center justify-between gap-4">
              <div className="font-[800] text-[15px] text-coal">{currentReview.author}</div>
              <div className="text-[13px] font-[700] text-coal/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-caramel"></span>
                {currentReview.format}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Индикаторы */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 max-md:hidden">
          {filteredReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-coal' : 'w-1.5 bg-coal/20 hover:bg-coal/40'}`}
              aria-label={`Перейти к отзыву ${i + 1}`}
            />
          ))}
        </div>
      </TiltCard>

      {/* Мобильная навигация остается без изменений */}
      <div className="hidden max-md:flex items-center justify-between mt-6">
        <button onClick={handlePrev} className="px-6 py-3 rounded-full border border-forest/15 bg-white font-bold text-coal shadow-sm hover:bg-snow active:scale-95 transition-all">← Назад</button>
        <div className="flex gap-1.5">
          {filteredReviews.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-5 bg-coal' : 'w-1.5 bg-coal/20'}`} />
          ))}
        </div>
        <button onClick={handleNext} className="px-6 py-3 rounded-full border border-forest/15 bg-white font-bold text-coal shadow-sm hover:bg-snow active:scale-95 transition-all">Вперед →</button>
      </div>
    </>
  );
}