// components/CaseInteractive.tsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors } from '@/lib/theme';
import { ArrowRight } from 'lucide-react';

export interface CaseStep {
  label: string; // Желательно использовать "Ситуация (До)", "Гипотеза", "Результат (После)"
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
  image_before?: string | null;
  image_after?: string | null;
}

export function CaseInteractive({ initialCases }: { initialCases: CaseData[] }) {
  const [activeCaseId, setActiveCaseId] = useState<string>(initialCases?.[0]?.id || '');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  if (!initialCases || initialCases.length === 0) {
    return <div className="mt-10 p-10 text-center text-coal/50 border border-forest/15 rounded-3xl bg-white">Кейсов пока нет</div>;
  }

  const activeCase = initialCases.find((c) => c.id === activeCaseId) || initialCases[0];
  const activeStep = activeCase.steps[activeStepIndex];
  
  const activeThemeKey = activeCase.theme as keyof typeof themeColors;
  const theme = themeColors[activeThemeKey] || themeColors.matcha;

  const handleTabChange = (id: string) => {
    setActiveCaseId(id);
    setActiveStepIndex(0); // Сбрасываем на первый шаг (До)
  };

  return (
    <div className="mt-10 overflow-hidden">
      {/* Навигация по кейсам */}
      <div className="flex flex-wrap max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-4 gap-2.5 mb-8 custom-scrollbar">
        {initialCases.map((c: CaseData) => {
          const isActive = activeCaseId === c.id;
          const themeKey = c.theme as keyof typeof themeColors;
          const tMap = themeColors[themeKey] || themeColors.matcha;
          
          return (
            <button 
              key={c.id}
              onClick={() => handleTabChange(c.id)}
              className={`px-4 py-2.5 rounded-full font-[820] text-[15px] border cursor-pointer transition-all duration-300 whitespace-nowrap max-md:shrink-0 ${isActive ? tMap.tabActive : tMap.tabInactive}`}
            >
              {c.tab_title}
            </button>
          );
        })}
      </div>

      <div className="rounded-[36px] bg-white border border-forest/10 shadow-lg overflow-hidden flex flex-col">
        
        {/* Заголовок кейса */}
        <div className={`p-8 tablet:p-6 border-b border-forest/10 bg-gradient-to-r ${theme.gradient} to-transparent`}>
           <span className={`inline-block mb-4 px-3 py-1 rounded-full text-[12px] font-[900] tracking-widest uppercase bg-white border border-forest/10 ${theme.text}`}>
              Анализ случая
            </span>
            <h3 className="text-[28px] tablet:text-[22px] font-[750] leading-tight text-coal max-w-[800px]">
              {activeCase.main_title}
            </h3>
        </div>

        <div className="grid grid-cols-[280px_1fr] tablet:grid-cols-1">
          {/* Боковая навигация ДО / ПОСЛЕ */}
          <div className="bg-snow/40 p-8 border-r border-forest/10 tablet:border-r-0 tablet:border-b tablet:flex tablet:overflow-x-auto tablet:p-6 custom-scrollbar">
            <div className="flex flex-col gap-3 tablet:flex-row tablet:min-w-max tablet:gap-4">
              {activeCase.steps.map((step: CaseStep, i: number) => {
                const isActive = i === activeStepIndex;
                const isResult = i === activeCase.steps.length - 1; // Последний шаг считаем результатом
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setActiveStepIndex(i)}
                    className={`relative w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 border ${isActive ? `bg-white border-forest/20 shadow-sm ${theme.text}` : 'bg-transparent border-transparent text-coal/60 hover:bg-white/50 hover:text-coal'}`}
                  >
                    <span className="block text-[11px] font-[900] tracking-widest uppercase mb-1 opacity-60">
                      {isResult ? "Итог работы" : `Этап 0${i + 1}`}
                    </span>
                    <span className="block font-[820] text-[16px]">
                      {step.label}
                    </span>
                    {isActive && <ArrowRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 tablet:hidden" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Контентная область */}
          <div className="p-12 tablet:p-8 mobile:p-6 bg-white min-h-[400px] flex flex-col justify-center">
            {activeStep ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCase.id}-${activeStepIndex}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-[700px]"
                >
                  <h4 className="text-[24px] max-md:text-[20px] font-[800] text-coal mb-5">
                    {activeStep.headline}
                  </h4>
                  
                  <p className="text-[17px] max-md:text-[15px] leading-[1.7] text-coal/80 mb-8 whitespace-pre-wrap">
                    {activeStep.text}
                  </p>

                  {activeStep.highlight && (
                    <div className="p-6 max-md:p-5 rounded-2xl bg-snow border border-forest/10">
                      <strong className={`block text-[12px] font-[900] uppercase tracking-wider mb-3 ${theme.text}`}>
                        Ключевой фактор
                      </strong>
                      <p className="text-[15px] max-md:text-[14px] font-[500] leading-relaxed text-coal m-0">
                        {activeStep.highlight}
                      </p>
                    </div>
                  )}
                </motion.div>
                {/* Фотографии выводятся только на последнем шаге */}
                {(activeStepIndex === activeCase.steps.length - 1) && (activeCase.image_before || activeCase.image_after) && (
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-forest/10 max-sm:grid-cols-1">
                    {activeCase.image_before && (
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[12px] font-[900] uppercase tracking-wider text-coal/50">Ситуация до</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={activeCase.image_before} alt="Было" className="rounded-xl w-full h-auto object-cover aspect-video shadow-sm border border-forest/10" />
                      </div>
                    )}
                    {activeCase.image_after && (
                      <div className="flex flex-col gap-2.5">
                        <span className={`text-[12px] font-[900] uppercase tracking-wider ${theme.text}`}>Результат работы</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={activeCase.image_after} alt="Стало" className="rounded-xl w-full h-auto object-cover aspect-video shadow-sm border border-forest/10" />
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            ) : (
              <div className="text-coal/50">Данные этапа отсутствуют.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}