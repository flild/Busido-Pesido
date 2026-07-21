'use client';
import { useState, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavStep {
  key: string;
  title: string;
  options: [string, string, string][];
}

// Пустышки для обохода гидратации
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Анимационные варианты для Framer Motion (направление сдвига)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0
  })
};

export function Navigator({ initialSteps }: { initialSteps: NavStep[] }) {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const navSteps = initialSteps && initialSteps.length > 0 ? initialSteps : [];
  
  const [navState, setNavState] = useState<{ index: number; answers: Record<string, string> }>(() => {
    if (typeof window === 'undefined') return { index: 0, answers: {} };
    const saved = window.localStorage.getItem("bpV11Navigator");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            index: typeof parsed.index === 'number' ? parsed.index : 0,
            answers: typeof parsed.answers === 'object' && parsed.answers !== null ? parsed.answers : {}
          };
        }
      } catch (e) {
        window.localStorage.removeItem("bpV11Navigator");
      }
    }
    return { index: 0, answers: {} };
  });

  
  const [showResult, setShowResult] = useState(false);
  // Состояние направления (1 - вперед, -1 - назад) для правильной анимации слайдов
  const [direction, setDirection] = useState(1);

  const saveState = useCallback((newState: { index: number; answers: Record<string, string> }) => {
    setNavState(newState);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("bpV11Navigator", JSON.stringify(newState));
    }
  }, []);
  if (navSteps.length === 0) {
      return <div className="p-10 text-center border rounded-3xl">Конфигурация навигатора не найдена</div>;
    }
  const handleChoice = (val: string) => {
    const step = navSteps[navState.index];
    saveState({ ...navState, answers: { ...navState.answers, [step.key]: val } });
  };

  const handleNext = () => {
    setDirection(1);
    if (navState.index < navSteps.length - 1) {
      saveState({ ...navState, index: navState.index + 1 });
    } else {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (showResult) {
      setShowResult(false);
    } else if (navState.index > 0) {
      saveState({ ...navState, index: navState.index - 1 });
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-[470px] p-[42px] max-md:p-[27px] flex items-center justify-center border border-forest/15 rounded-[38px] bg-white shadow-[0_30px_80px_rgba(30,43,14,0.14)]" aria-busy="true">
        <span className="text-forest font-bold animate-pulse">Загрузка...</span>
      </div>
    );
  }

  const step = navSteps[navState.index];
  const progress = showResult ? 100 : ((navState.index + 1) / navSteps.length) * 100;
  const hasAnswer = !!navState.answers[step.key];

  // Простая хардкод-логика результатов (до переезда на бэкенд)
  let resultTitle = "Онлайн-консультация", price = "6 000 ₽", text = "Полный разбор одного животного и одного основного запроса с письменным планом и обратной связью.", alt = "Альтернатива: сопровождение, если потребуется регулярная корректировка.";
  
  const a = navState.answers;
  if (a.health === "yes" && a.change === "sudden") {
    resultTitle = "Ветеринарное второе мнение"; price = "2 500 ₽"; text = "Сначала целесообразно разобрать медицинские документы и определить необходимость дополнительной диагностики."; alt = "После медицинского маршрута можно перейти к поведенческой консультации.";
  } else if (a.risk === "high") {
    resultTitle = a.format === "offline" ? "Очная / выездная консультация" : "Первичный онлайн-разбор безопасности"; price = a.format === "offline" ? "8 000 ₽" : "6 000 ₽"; text = "Первым этапом нужен анализ риска, управления средой и безопасного маршрута дальнейшей работы."; alt = "При необходимости работа продолжается в сопровождении.";
  } else if (a.depth === "support") {
    resultTitle = a.format === "offline" ? "Сопровождение с выездами" : "Онлайн-сопровождение"; price = a.format === "offline" ? "30 000 ₽" : "22 000 ₽"; text = "Формат включает домашние задания, проверку видео и регулярную корректировку плана."; alt = "Оплату можно разделить на части по согласованному графику.";
  }

  return (
    <div className="grid grid-cols-[310px_1fr] max-lg:grid-cols-1 overflow-hidden rounded-[38px] bg-white border border-forest/15 shadow-[0_30px_80px_rgba(30,43,14,0.14)]">
      
      {/* Сайдбар прогресса */}
      <aside className="p-[34px] bg-[radial-gradient(circle_at_86%_12%,rgba(240,114,150,0.26),transparent_28%),linear-gradient(150deg,theme(colors.forest),theme(colors.soldier))] text-white">
        <div className="h-[7px] bg-white/15 rounded-full overflow-hidden">
          <i className="block h-full bg-gradient-dopamine transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></i>
        </div>
        <small className="block mt-4 text-oat font-semibold text-sm">
          {showResult ? "Готово" : `Шаг ${navState.index + 1} из ${navSteps.length}`}
        </small>
        <h3 className="text-[30px] my-7 leading-tight font-bold">Подбор формата</h3>
        <p className="text-white/70 text-sm">Ответы сохраняются в браузере до завершения маршрута.</p>
      </aside>
      
      {/* Основная рабочая зона */}
      <div className="min-h-[470px] p-[42px] max-md:p-[27px] flex flex-col relative overflow-hidden">
        
        <div className="flex-1 relative">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {showResult ? (
              <motion.div 
                key="result"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 rounded-[28px] bg-gradient-to-br from-fog/30 to-snow border border-forest/10"
              >
                <span className="block text-[10px] font-black text-matcha tracking-widest uppercase mb-2">РЕКОМЕНДУЕМЫЙ СЛЕДУЮЩИЙ ШАГ</span>
                <h3 className="text-[40px] max-md:text-[32px] my-3 leading-tight text-coal">{resultTitle}</h3>
                <div className="text-[34px] font-black tracking-tighter mb-4 text-coal">{price}</div>
                <p className="text-coal/80 mb-2">{text}</p>
                <p className="text-coal font-medium"><strong>{alt}</strong></p>
                <div className="mt-8">
                  <Link className="button button-dark" href="/booking">Перейти к записи</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={navState.index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h3 className="text-[36px] max-md:text-[28px] mb-[26px] leading-tight font-bold text-coal">{step.title}</h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[14px]">
                  {step.options.map((o) => {
                    const isSelected = navState.answers[step.key] === o[0];
                    // Единый строгий стиль для выбранной опции
                    const activeClass = isSelected 
                      ? "bg-forest text-white border-forest shadow-[0_8px_20px_rgba(47,63,23,0.15)] ring-2 ring-forest/20 scale-[0.98]" 
                      : "bg-snow text-coal border-forest/10 hover:border-forest/30 hover:bg-fog/30";

                    return (
                      <button 
                        key={o[0]}
                        className={`min-h-[96px] p-5 border rounded-[22px] text-left font-[850] cursor-pointer transition-all duration-200 ${activeClass}`}
                        onClick={() => handleChoice(o[0])}
                        aria-pressed={isSelected}
                      >
                        <span className="block text-lg mb-1">{o[1]}</span>
                        <small className={`block font-medium text-sm leading-snug ${isSelected ? "text-white/80" : "text-coal/60"}`}>
                          {o[2]}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Панель управления навигацией */}
        <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-forest/10 z-10 bg-white">
          <button 
            className="button button-ghost disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
            onClick={handleBack} 
            disabled={navState.index === 0 && !showResult}
          >
            Назад
          </button>
          {!showResult && (
            <button 
              className="button button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
              onClick={handleNext} 
              disabled={!hasAnswer}
            >
              {navState.index === navSteps.length - 1 ? "Показать результат" : "Продолжить"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}