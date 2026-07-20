'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors } from '@/lib/theme';

// Строго описываем типы, чтобы TS не ругался на any
export interface CaseStep {
  label: string;
  headline: string;
  text: string;
  highlight?: string;
}

export interface CaseData {
  id: string;
  theme: string;
  tab_title: string;
  main_title: string;
  steps: CaseStep[];
  sort_order: number;
}

export function CaseInteractive({ initialCases }: { initialCases: CaseData[] }) {
  // 1. Хуки ВСЕГДА вызываются первыми. Никаких проверок до них.
  const [activeCaseId, setActiveCaseId] = useState<string>(initialCases?.[0]?.id || '');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // 2. Если данных нет — делаем ранний возврат ПОСЛЕ хуков. Это безопасно.
  if (!initialCases || initialCases.length === 0) {
    return <div className="mt-10 p-10 text-center text-coal/50 border border-forest/15 rounded-3xl">Кейсов пока нет</div>;
  }

  const activeCase = initialCases.find((c) => c.id === activeCaseId) || initialCases[0];
  const activeStep = activeCase.steps[activeStepIndex];
  
  // Строгая типизация ключа для объекта тем
  const activeThemeKey = activeCase.theme as keyof typeof themeColors;
  const theme = themeColors[activeThemeKey] || themeColors.matcha;

  const handleTabChange = (id: string) => {
    setActiveCaseId(id);
    setActiveStepIndex(0);
  };

  return (
    <div className="mt-10">
      {/* Навигация по кейсам (Табы) */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {initialCases.map((c: CaseData) => {
          const isActive = activeCaseId === c.id;
          const themeKey = c.theme as keyof typeof themeColors;
          const tMap = themeColors[themeKey] || themeColors.matcha;
          
          return (
            <button 
              key={c.id}
              onClick={() => handleTabChange(c.id)}
              className={`px-4 py-2.5 rounded-full font-[820] text-[15px] border cursor-pointer transition-all duration-300 ${isActive ? tMap.tabActive : tMap.tabInactive}`}
            >
              {c.tab_title}
            </button>
          );
        })}
      </div>

      {/* Основной блок */}
      <div className="grid grid-cols-[320px_1fr] overflow-hidden rounded-[36px] bg-white border border-forest/10 shadow-[0_35px_80px_rgba(30,43,14,0.08)] tablet:grid-cols-1">
        
        {/* Боковой Таймлайн */}
        <div className="bg-snow/60 p-8 border-r border-forest/10 tablet:border-r-0 tablet:border-b tablet:overflow-x-auto tablet:p-6">
          <div className="tablet:flex tablet:gap-6 tablet:min-w-max">
            {activeCase.steps.map((step: CaseStep, i: number) => {
              const isActive = i === activeStepIndex;
              const isPast = i < activeStepIndex;
              
              return (
                <button 
                  key={i} 
                  onClick={() => setActiveStepIndex(i)}
                  className="group relative w-full text-left flex items-start gap-4 mb-7 last:mb-0 cursor-pointer border-0 bg-transparent tablet:w-auto tablet:mb-0"
                >
                  {/* Линия связи */}
                  {i !== activeCase.steps.length - 1 && (
                    <div className="absolute left-[11px] top-[30px] bottom-[-34px] w-[2px] bg-forest/5 tablet:hidden" />
                  )}
                  
                  {/* Точка таймлайна */}
                  <div className={`relative z-10 shrink-0 w-[24px] h-[24px] rounded-full mt-0.5 border-2 flex items-center justify-center transition-colors duration-300 ${isActive ? `border-transparent ${theme.bg} ring-4 ${theme.ring}` : isPast ? `border-transparent bg-coal` : `border-forest/20 bg-white group-hover:border-forest/40`}`}>
                    {(isActive || isPast) && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Текст шага */}
                  <div>
                    <span className="block text-[11px] font-[900] tracking-widest text-coal/40 uppercase mb-0.5">
                      Шаг {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`block font-[820] text-[16px] transition-colors duration-300 ${isActive ? 'text-coal' : 'text-coal/60 group-hover:text-coal'}`}>
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Контентная область */}
        <div className="relative p-12 tablet:p-8 mobile:p-6 bg-white overflow-hidden flex flex-col">
          
          <div className={`absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl ${theme.gradient} to-transparent opacity-[0.07] blur-3xl pointer-events-none transition-colors duration-1000`} />

          <div className="shrink-0 relative z-10">
            <span className={`inline-block mb-6 px-3 py-1 rounded-full text-[12px] font-[900] tracking-widest uppercase bg-snow border border-forest/10 ${theme.text}`}>
              {activeCase.tab_title}
            </span>

            <h3 className="text-[34px] tablet:text-[28px] font-[750] leading-tight text-coal mb-10 max-w-[90%]">
              {activeCase.main_title}
            </h3>
          </div>
          <div className="relative z-10 flex-grow min-h-[350px] tablet:min-h-[350px] mobile:min-h-[400px]">
            {/* Если шагов нет, выводим фоллбек, чтобы не падало */}
            {activeStep ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCase.id}-${activeStepIndex}`}
                  initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="max-w-[700px] absolute inset-0"
                >
                  <h4 className="text-[22px] font-[700] text-coal mb-4">
                    {activeStep.headline}
                  </h4>
                  
                  <p className="text-[17px] leading-[1.6] text-coal/75 mb-6 whitespace-pre-wrap">
                    {activeStep.text}
                  </p>

                  {activeStep.highlight && (
                    <div className={`p-5 rounded-2xl bg-snow border-l-4 border-l-current ${theme.text}`}>
                      <strong className="block text-[13px] font-[900] uppercase tracking-wider mb-2 text-coal">Обратите внимание</strong>
                      <p className="text-[15px] font-[500] leading-snug text-coal/80 m-0">
                        {activeStep.highlight}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-coal/50">Шаги не заполнены.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}