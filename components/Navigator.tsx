'use client';
import { useState, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors, type BrandTheme } from '@/lib/theme';

export interface NavStep {
  key: string;
  title: string;
  options: [string, string, string][];
}

// Интерфейс формата из базы данных
export interface ServiceFormat {
  id: string;
  title: string;
  price: string;
  description: string;
  theme: string;
  link_text: string;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 40 : -40, opacity: 0 })
};

export function Navigator({ initialSteps, formats }: { initialSteps: NavStep[], formats: ServiceFormat[] }) {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const navSteps = initialSteps && initialSteps.length > 0 ? initialSteps : [];
  
  const [navState, setNavState] = useState<{ index: number; answers: Record<string, string> }>(() => {
    if (typeof window === 'undefined') return { index: 0, answers: {} };
    const saved = window.localStorage.getItem("bpV11Navigator");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null && parsed.index < navSteps.length) {
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
  const [direction, setDirection] = useState(1);

  const saveState = useCallback((newState: { index: number; answers: Record<string, string> }) => {
    setNavState(newState);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("bpV11Navigator", JSON.stringify(newState));
    }
  }, []);

  if (navSteps.length === 0) {
    return <div className="p-10 text-center border border-forest/15 rounded-3xl text-coal/50">Конфигурация навигатора не найдена</div>;
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

  const handleReset = () => {
    setDirection(-1);
    setShowResult(false);
    saveState({ index: 0, answers: {} });
  };

  if (!isClient) {
    return (
      <div className="min-h-[470px] p-[42px] max-md:p-[27px] flex items-center justify-center border border-forest/15 rounded-[38px] bg-white shadow-[0_30px_80px_rgba(30,43,14,0.14)]">
        <span className="text-forest font-bold animate-pulse">Загрузка навигатора...</span>
      </div>
    );
  }

  const safeIndex = Math.min(navState.index, navSteps.length - 1);
  const step = navSteps[safeIndex];
  const progress = showResult ? 100 : ((safeIndex + 1) / navSteps.length) * 100;
  const hasAnswer = !!navState.answers[step.key];

  // ============================================================================
  // ЛОГИКА ОПРЕДЕЛЕНИЯ ФОРМАТА (Эвристика)
  // ============================================================================
  const a = navState.answers;
  let recommendedServiceId = 'online'; // Базовый формат по умолчанию

  // 1. Проверяем маркеры здоровья (если есть ключи health, vet, внезапные изменения)
  if (a.health === "yes" || a.vet === "yes" || a.change === "sudden" || a.symptoms === "yes") {
    recommendedServiceId = 'second'; // Второе мнение
  } 
  // 2. Проверяем маркеры риска и агрессии (укусы, безопасность)
  else if (a.risk === "high" || a.aggression === "yes" || a.bites === "yes") {
    recommendedServiceId = 'offline'; // Очная встреча для безопасности
  } 
  // 3. Проверяем маркеры необходимости долгого контроля (тревога расставания, щенки)
  else if (a.support === "yes" || a.duration === "long" || a.problem === "separation") {
    recommendedServiceId = 'support'; // Онлайн-сопровождение
  }

  // Находим реальные данные услуги из базы (если не найдено - берем первую попавшуюся как фоллбэк)
  const resultFormat = formats?.find(f => f.id === recommendedServiceId) || formats?.[0];
  
  // Достаем цвета для оформления результата
  const theme = resultFormat ? themeColors[resultFormat.theme as BrandTheme] : themeColors.matcha;

  // Формируем умную ссылку на бронирование с передачей параметров
  // Ищем ответ на вопрос о питомце (обычно ключ 'species' со значениями 'dog' или 'cat')
  const petParam = a.species === 'cat' ? 'cat' : (a.species === 'dog' ? 'dog' : '');
  const bookingUrl = resultFormat ? `/booking?service=${resultFormat.id}${petParam ? `&pet=${petParam}` : ''}` : '/booking';

  return (
    <div className="grid grid-cols-[310px_1fr] max-lg:grid-cols-1 overflow-hidden rounded-[38px] bg-white border border-forest/15 shadow-[0_30px_80px_rgba(30,43,14,0.14)]">
      
      <aside className="p-[34px] bg-[radial-gradient(circle_at_86%_12%,rgba(240,114,150,0.26),transparent_28%),linear-gradient(150deg,theme(colors.forest),theme(colors.soldier))] text-white flex flex-col">
        <div className="h-[7px] bg-white/15 rounded-full overflow-hidden shrink-0">
          <i className="block h-full bg-gradient-dopamine transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></i>
        </div>
        <small className="block mt-4 text-oat font-semibold text-sm shrink-0">
          {showResult ? "Готово" : `Шаг ${safeIndex + 1} из ${navSteps.length}`}
        </small>
        <h3 className="text-[30px] my-7 leading-tight font-bold shrink-0">Подбор формата</h3>
        <p className="text-white/70 text-sm flex-grow">Ответы сохраняются в браузере до завершения маршрута.</p>
        
        {safeIndex > 0 && !showResult && (
          <button onClick={handleReset} className="mt-6 text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 self-start">
            Начать заново
          </button>
        )}
      </aside>
      
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
                className={`p-8 rounded-[28px] border relative overflow-hidden bg-white shadow-xl ${theme.ring} ring-2`}
              >
                {/* Декоративный фон на основе темы результата */}
                <div className={`absolute inset-0 opacity-10 ${theme.bg} pointer-events-none`} />
                
                <div className="relative z-10">
                  <span className={`block text-[10px] font-black tracking-widest uppercase mb-2 ${theme.text}`}>РЕКОМЕНДУЕМЫЙ ФОРМАТ</span>
                  <h3 className="text-[40px] max-md:text-[32px] my-3 leading-tight text-coal font-bold">
                    {resultFormat?.title || "Индивидуальный формат"}
                  </h3>
                  <div className="text-[34px] font-black tracking-tighter mb-4 text-coal">
                    {resultFormat?.price || "По запросу"}
                  </div>
                  
                  <p className="text-coal/80 mb-6 text-[17px] leading-relaxed">
                    {resultFormat?.description || "Специалист свяжется с вами для уточнения деталей."}
                  </p>
                  
                  <div className="mt-8 flex gap-3 flex-wrap">
                    <Link 
                      className={`button font-[800] text-[15px] border-none shadow-md hover:-translate-y-0.5 transition-transform ${theme.tabActive}`} 
                      href={bookingUrl}
                    >
                      Перейти к записи
                    </Link>
                    <button onClick={handleReset} className="button button-ghost">Пройти заново</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={safeIndex}
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
        
        <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-forest/10 z-10 bg-white">
          <button 
            className="button button-ghost disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
            onClick={handleBack} 
            disabled={safeIndex === 0 && !showResult}
          >
            Назад
          </button>
          {!showResult && (
            <button 
              className="button button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
              onClick={handleNext} 
              disabled={!hasAnswer}
            >
              {safeIndex === navSteps.length - 1 ? "Показать результат" : "Продолжить"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}