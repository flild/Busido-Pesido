'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from './TiltCard';

const FACTORS = [
  { 
    id: 'pain', 
    height: 42, 
    label: 'Боль', 
    color: 'bg-matcha', 
    textColor: 'text-matcha', 
    title: 'Скрытая боль и дискомфорт', 
    desc: 'Проблемы с ЖКТ, зубами или суставами радикально снижают порог терпимости. Животное быстрее срывается в агрессию или избегает контакта.' 
  },
  { 
    id: 'sleep', 
    height: 68, 
    label: 'Сон', 
    color: 'bg-caramel', 
    textColor: 'text-espresso', 
    title: 'Дефицит качественного сна', 
    desc: 'Нехватка глубокого сна истощает нервную систему. Отсюда гиперактивность, раздражительность и неспособность концентрироваться на прогулке.' 
  },
  { 
    id: 'stress', 
    height: 54, 
    label: 'Стресс', 
    color: 'bg-rose', 
    textColor: 'text-rose', 
    title: 'Хроническое напряжение', 
    desc: 'Фоновый стресс держит организм в режиме выживания. Животное постоянно ожидает угрозу и слишком остро реагирует на обычные раздражители.' 
  },
  { 
    id: 'environment', 
    height: 88, 
    label: 'Среда', 
    color: 'bg-ice', 
    textColor: 'text-ice', 
    title: 'Давление среды', 
    desc: 'Отсутствие укрытий, скользкий пол, шум или конкуренция за ресурсы дома ежедневно, по капле, провоцируют защитное или избегающее поведение.' 
  },
  { 
    id: 'history', 
    height: 72, 
    label: 'Опыт', 
    color: 'bg-berry', 
    textColor: 'text-berry', 
    title: 'История обучения', 
    desc: 'Прошлый пугающий опыт или случайно закрепленные реакции заставляют животное выбирать уже проверенные (хоть и неудобные для вас) стратегии.' 
  },
];

export function ClinicalBehaviorChart() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const activeFactor = FACTORS[activeIndex];

  // Автоматическое переключение, пока мышь не на карточке
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FACTORS.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <TiltCard className="p-10 max-md:p-7 rounded-[42px] bg-white shadow-2xl bg-[radial-gradient(circle_at_82%_10%,rgba(240,114,150,0.12),transparent_35%),linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.08))] flex flex-col h-full min-h-[460px]">
      <div 
        className="flex flex-col h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Заголовок теперь не отрывается от карточки */}
        <div className="shrink-0 mb-2">
          <span className="block text-[10px] font-black tracking-[0.14em] text-forest mb-2">CLINICAL BEHAVIOR</span>
          <h3 className="text-[32px] max-md:text-[28px] leading-tight font-bold text-coal max-w-[12ch]">Поведение — это симптомы</h3>
        </div>

        {/* Область графика: занимает всё пустое место (flex-1) */}
        <div className="relative flex-1 flex flex-col justify-end mt-4 mb-8">
          
          {/* Декоративная фоновая сетка осей (убивает "белое бельмо") */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 py-2">
            <i className="w-full border-b border-forest/10 border-dashed opacity-60"></i>
            <i className="w-full border-b border-forest/10 border-dashed opacity-60"></i>
            <i className="w-full border-b border-forest/10 border-dashed opacity-60"></i>
            <i className="w-full border-b border-forest/10 border-solid opacity-60"></i>
          </div>

          {/* Интерактивные столбцы (сделали стройнее и аккуратнее) */}
          <div className="h-[300px] w-full max-w-[520px] mx-auto flex items-end gap-3 max-md:gap-2 relative z-10 group pt-6">
            {FACTORS.map((factor, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={factor.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsPaused(true);
                  }}
                  className={`relative flex-1 rounded-t-xl rounded-b-[4px] transition-all duration-300 cursor-pointer border-none outline-none overflow-hidden ${factor.color} ${isActive ? 'shadow-[0_-5px_15px_rgba(0,0,0,0.1)] scale-y-110 origin-bottom' : 'opacity-25 hover:opacity-60 group-hover:opacity-40 hover:scale-y-100 origin-bottom'}`}
                  style={{ height: `${factor.height}%` }}
                  aria-pressed={isActive}
                >
                  {/* Блик активности */}
                  {isActive && (
                    <motion.div 
                      layoutId="chartHighlight"
                      className="absolute inset-0 bg-gradient-to-t from-transparent to-white/40"
                    />
                  )}
                  <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider transition-opacity duration-200 ${isActive ? 'opacity-100 text-coal' : 'opacity-0'}`}>
                    {factor.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Динамическое описание (зафиксировали минимальную высоту, чтобы контент центрировался) */}
        <div className="min-h-[115px] rounded-[20px] bg-snow p-5 border border-forest/5 relative overflow-hidden shrink-0 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFactor.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <h4 className={`text-[16px] font-[850] mb-1.5 ${activeFactor.textColor}`}>
                {activeFactor.title}
              </h4>
              <p className="text-coal/80 text-[14px] leading-snug">
                {activeFactor.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
}