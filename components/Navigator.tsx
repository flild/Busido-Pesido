'use client';
import { useState, useCallback, useSyncExternalStore, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { themeColors, type BrandTheme } from '@/lib/theme';

export interface ServiceFormat {
  id: string;
  title: string;
  price: string;
  description: string;
  theme: string;
  link_text: string;
}

export interface GraphData {
  nodes: any[];
  edges: any[];
}

interface NavState {
  currentNodeId: string | null;
  history: string[]; // Для кнопки "Назад"
  answers: Record<string, string>; // ID узла -> ID выбранного ответа
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 40 : -40, opacity: 0 })
};

export function Navigator({ initialSteps, formats }: { initialSteps: GraphData | any, formats: ServiceFormat[] }) {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  
  // Нормализуем данные, так как в пропсы прилетает JSON из базы
  const nodes = initialSteps?.nodes || [];
  const edges = initialSteps?.edges || [];
  
  // Ищем корневой узел (тот, в который никто не входит)
  const rootNodeId = useMemo(() => {
    if (nodes.length === 0) return null;
    const targetIds = new Set(edges.map((e: any) => e.target));
    const root = nodes.find((n: any) => !targetIds.has(n.id) && n.type === 'question');
    return root ? root.id : nodes.find((n: any) => n.type === 'question')?.id || null;
  }, [nodes, edges]);

  const [navState, setNavState] = useState<NavState>(() => {
    if (typeof window === 'undefined') return { currentNodeId: rootNodeId, history: [], answers: {} };
    
    const saved = window.localStorage.getItem("bpV12NavigatorGraph");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.currentNodeId) {
          // Защита от битых данных: проверяем, жив ли еще сохраненный узел в новой схеме
          if (nodes.some((n: any) => n.id === parsed.currentNodeId)) {
            return parsed;
          }
        }
      } catch (e) {
        window.localStorage.removeItem("bpV12NavigatorGraph");
      }
    }
    return { currentNodeId: rootNodeId, history: [], answers: {} };
  });

  const [direction, setDirection] = useState(1);

  const saveState = useCallback((newState: NavState) => {
    setNavState(newState);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("bpV12NavigatorGraph", JSON.stringify(newState));
    }
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-[470px] p-[42px] max-md:p-[27px] flex items-center justify-center border border-forest/15 rounded-[38px] bg-white shadow-[0_30px_80px_rgba(30,43,14,0.14)]">
        <span className="text-forest font-bold animate-pulse">Загрузка навигатора...</span>
      </div>
    );
  }

  if (nodes.length === 0 || !rootNodeId) {
    return <div className="p-10 text-center border border-forest/15 rounded-3xl text-coal/50">Конфигурация графа не найдена. Настройте навигатор в админке.</div>;
  }

  const currentNode = nodes.find((n: any) => n.id === navState.currentNodeId);
  const isResult = currentNode?.type === 'result';
  const hasAnswer = !!navState.answers[currentNode?.id];
  
  // Эвристика прогресса (глубина графа неизвестна, опираемся на историю)
  const currentStepNum = navState.history.length + 1;
  const progress = isResult ? 100 : Math.min((currentStepNum / 5) * 100, 95); 

  const handleChoice = (optionId: string) => {
    if (!currentNode) return;
    saveState({ ...navState, answers: { ...navState.answers, [currentNode.id]: optionId } });
  };

  const handleNext = () => {
    if (!currentNode) return;
    const selectedOptionId = navState.answers[currentNode.id];
    
    // Ищем связь, которая ведет от выбранного ответа к следующему узлу
    const edge = edges.find((e: any) => e.source === currentNode.id && e.sourceHandle === selectedOptionId);
    
    if (edge) {
      setDirection(1);
      saveState({
        ...navState,
        currentNodeId: edge.target,
        history: [...navState.history, currentNode.id]
      });
    } else {
      console.warn("Тупик в графе: нет связи для этого варианта ответа");
    }
  };

  const handleBack = () => {
    if (navState.history.length === 0) return;
    setDirection(-1);
    
    const newHistory = [...navState.history];
    const prevNodeId = newHistory.pop()!;
    
    saveState({
      ...navState,
      currentNodeId: prevNodeId,
      history: newHistory
    });
  };

  const handleReset = () => {
    setDirection(-1);
    saveState({ currentNodeId: rootNodeId, history: [], answers: {} });
  };

  // ============================================================================
  // ЛОГИКА РЕНДЕРА РЕЗУЛЬТАТА
  // ============================================================================
  const resultFormat = isResult 
    ? formats?.find(f => f.id === currentNode?.data?.serviceId) || formats?.[0]
    : null;

  const theme = resultFormat ? themeColors[resultFormat.theme as BrandTheme] : themeColors.matcha;

  // Ищем ответ на вопрос о виде животного (по ключу 'species' в data.questionKey)
  // Чтобы прокинуть параметр ?pet=dog/cat в бронирование
  const speciesAnswerNode = nodes.find((n: any) => n.data?.questionKey === 'species');
  const speciesValue = speciesAnswerNode ? navState.answers[speciesAnswerNode.id] : '';
  const petParam = speciesValue === 'cat' ? 'cat' : (speciesValue === 'dog' ? 'dog' : '');
  
  const bookingUrl = resultFormat ? `/booking?service=${resultFormat.id}${petParam ? `&pet=${petParam}` : ''}` : '/booking';

  return (
    <div className="grid grid-cols-[310px_1fr] max-lg:grid-cols-1 overflow-hidden rounded-[38px] bg-white border border-forest/15 shadow-[0_30px_80px_rgba(30,43,14,0.14)]">
      
      <aside className="p-[34px] bg-[radial-gradient(circle_at_86%_12%,rgba(240,114,150,0.26),transparent_28%),linear-gradient(150deg,theme(colors.forest),theme(colors.soldier))] text-white flex flex-col">
        <div className="h-[7px] bg-white/15 rounded-full overflow-hidden shrink-0">
          <i className="block h-full bg-rose transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></i>
        </div>
        <small className="block mt-4 text-oat font-semibold text-sm shrink-0">
          {isResult ? "Готово" : `Шаг ${currentStepNum}`}
        </small>
        <h3 className="text-[30px] my-7 leading-tight font-bold shrink-0">Подбор формата</h3>
        <p className="text-white/70 text-sm flex-grow">Ответы сохраняются в браузере до завершения маршрута.</p>
        
        {navState.history.length > 0 && !isResult && (
          <button onClick={handleReset} className="mt-6 text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 self-start">
            Начать заново
          </button>
        )}
      </aside>
      
      <div className="min-h-[470px] p-[42px] max-md:p-[27px] flex flex-col relative overflow-hidden">
        <div className="flex-1 relative">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {isResult ? (
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
            ) : currentNode ? (
              <motion.div
                key={currentNode.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h3 className="text-[36px] max-md:text-[28px] mb-[26px] leading-tight font-bold text-coal">
                  {currentNode.data?.title || 'Без заголовка'}
                </h3>
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[14px]">
                  {currentNode.data?.options?.map((opt: any) => {
                    const isSelected = navState.answers[currentNode.id] === opt.id;
                    const activeClass = isSelected 
                      ? "bg-forest text-white border-forest shadow-[0_8px_20px_rgba(47,63,23,0.15)] ring-2 ring-forest/20 scale-[0.98]" 
                      : "bg-snow text-coal border-forest/10 hover:border-forest/30 hover:bg-fog/30";

                    return (
                      <button 
                        key={opt.id}
                        className={`min-h-[96px] p-5 border rounded-[22px] text-left font-[850] cursor-pointer transition-all duration-200 ${activeClass}`}
                        onClick={() => handleChoice(opt.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="block text-lg mb-1">{opt.title}</span>
                        {opt.desc && (
                          <small className={`block font-medium text-sm leading-snug ${isSelected ? "text-white/80" : "text-coal/60"}`}>
                            {opt.desc}
                          </small>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-forest/10 z-10 bg-white">
          <button 
            className="button button-ghost disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
            onClick={handleBack} 
            disabled={navState.history.length === 0 && !isResult}
          >
            Назад
          </button>
          {!isResult && (
            <button 
              className="button button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
              onClick={handleNext} 
              disabled={!hasAnswer}
            >
              Продолжить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}