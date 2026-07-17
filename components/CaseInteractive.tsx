'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors, type BrandTheme } from '@/lib/theme';
import { casesData } from '@/data/cases';

/*
 * ============================================================================
 * СТРУКТУРА ДЛЯ ВЕТЕРИНАРА
 * ============================================================================
 * У каждого этапа теперь есть понятные ключи:
 * - label: Название шага на таймлайне (слева).
 * - headline: Заголовок внутри карточки.
 * - text: Основное описание.
 * - highlight: (опционально) Экспертный вывод или акцент для красивой цитаты.
 */

export function CaseInteractive() {
  const [activeCaseId, setActiveCaseId] = useState(casesData[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeCase = casesData.find(c => c.id === activeCaseId) || casesData[0];
  const activeStep = activeCase.steps[activeStepIndex];
  const theme = themeColors[activeCase.theme];

  const handleTabChange = (id: string) => {
    setActiveCaseId(id);
    setActiveStepIndex(0);
  };

  return (
    <div className="mt-10">
      {/* Навигация по кейсам (Табы) */}
      <div className="flex flex-wrap gap-2.5 mb-8">
        {casesData.map((c) => {
          const isActive = activeCaseId === c.id;
          const tMap = themeColors[c.theme];
          
          return (
            <button 
              key={c.id}
              onClick={() => handleTabChange(c.id)}
              className={`px-4 py-2.5 rounded-full font-[820] text-[15px] border cursor-pointer transition-all duration-300 ${isActive ? tMap.tabActive : tMap.tabInactive}`}
            >
              {c.tabTitle}
            </button>
          );
        })}
      </div>

      {/* Основной блок */}
      <div className="grid grid-cols-[320px_1fr] overflow-hidden rounded-[36px] bg-white border border-forest/10 shadow-[0_35px_80px_rgba(30,43,14,0.08)] tablet:grid-cols-1">
        
        {/* Боковой Таймлайн */}
        <div className="bg-snow/60 p-8 border-r border-forest/10 tablet:border-r-0 tablet:border-b tablet:overflow-x-auto tablet:p-6">
          <div className="tablet:flex tablet:gap-6 tablet:min-w-max">
            {activeCase.steps.map((step, i) => {
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
        {/* Добавили flex и flex-col, чтобы контролировать высоту */}
        <div className="relative p-12 tablet:p-8 mobile:p-6 bg-white overflow-hidden flex flex-col">
          
          <div className={`absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl ${theme.gradient} to-transparent opacity-[0.07] blur-3xl pointer-events-none transition-colors duration-1000`} />

          <div className="shrink-0 relative z-10">
            <span className={`inline-block mb-6 px-3 py-1 rounded-full text-[12px] font-[900] tracking-widest uppercase bg-snow border border-forest/10 ${theme.text}`}>
              {activeCase.tabTitle}
            </span>

            <h3 className="text-[34px] tablet:text-[28px] font-[750] leading-tight text-coal mb-10 max-w-[90%]">
              {activeCase.mainTitle}
            </h3>
          </div>
          <div className="relative z-10 flex-grow min-h-[350px] tablet:min-h-[350px] mobile:min-h-[400px]">
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
                
                <p className="text-[17px] leading-[1.6] text-coal/75 mb-6">
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
          </div>

        </div>
      </div>
    </div>
  );
}