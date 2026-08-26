'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

type TabId = 'state' | 'environment' | 'load' | 'recovery' | 'learning';

const approachData: Record<TabId, { n: string, title: string, text: string, list: string[], accent: string, bgAccent: string }> = {
  state: { 
    n: "01", title: "Состояние определяет доступность поведения", text: "Оцениваются сон, боль, зуд, ЖКТ, аппетит, движение, сенсорная нагрузка, лекарства и способность возвращаться к спокойному состоянию.", list: ["Что изменилось вместе с поведением", "Какие признаки требуют медицинской проверки", "Какая нагрузка сейчас доступна"], 
    accent: "text-matcha", bgAccent: "bg-matcha" 
  },
  environment: { 
    n: "02", title: "Среда ежедневно поддерживает или снижает напряжение", text: "Разбираются пространство, ресурсы, дистанция, маршруты, режим, шум, контакты и возможность уйти из взаимодействия.", list: ["Где реакция появляется чаще", "Какие условия усиливают напряжение", "Что можно изменить до тренинга"], 
    accent: "text-caramel", bgAccent: "bg-caramel" 
  },
  load: { 
    n: "03", title: "Нагрузка оценивается в сумме, а не по одному событию", text: "Учитываются прогулки, социальные контакты, новизна, бытовые процедуры, дефицит сна и накопление сложных эпизодов.", list: ["Как быстро растёт возбуждение", "Сколько длится восстановление", "Какие нагрузки стоит сократить"], 
    accent: "text-rose", bgAccent: "bg-rose" 
  },
  recovery: { 
    n: "04", title: "Восстановление создаёт основу для обучения", text: "Проверяются качество сна, спокойные зоны, ритуалы, исследовательская активность и способность делать паузу после событий.", list: ["Есть ли полноценный сон", "Может ли животное прекращать активность", "Что возвращает спокойствие"], 
    accent: "text-ice", bgAccent: "bg-ice" 
  },
  learning: { 
    n: "05", title: "Обучение строится внутри доступного уровня сложности", text: "Навык дробится на этапы, формируются ясные критерии, учитываются мотивация, контекст и последствия каждого действия.", list: ["Как выглядит исходное поведение", "Какой следующий шаг реалистичен", "По каким данным повышать сложность"], 
    accent: "text-forest", bgAccent: "bg-forest" 
  }
};

const tabs: { id: TabId; num: string; label: string }[] = [
  { id: 'state', num: '01', label: 'Состояние' },
  { id: 'environment', num: '02', label: 'Среда' },
  { id: 'load', num: '03', label: 'Нагрузка' },
  { id: 'recovery', num: '04', label: 'Восстановление' },
  { id: 'learning', num: '05', label: 'Обучение' },
];

export function ApproachTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('state');
  const d = approachData[activeTab];

  return (
    <div className="rounded-[40px] mobile:rounded-[28px] bg-white text-coal shadow-[0_32px_64px_rgba(30,43,14,0.12)] border border-forest/10 p-4 overflow-hidden">
      
      {/* Навигация (Табы) */}
      <div className="bg-fog/40 p-2 rounded-[32px] mobile:rounded-[20px] flex overflow-x-auto custom-scrollbar snap-x relative z-20">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const currentAccent = approachData[tab.id].accent;
          
          return (
            <button 
              key={tab.id}
              className={`relative flex-1 min-w-[150px] p-[16px_20px] rounded-[24px] mobile:rounded-[14px] text-left font-[800] transition-all duration-300 snap-center outline-none ${isActive ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-white/40'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={`block text-[11px] font-[950] mb-1 transition-colors ${isActive ? currentAccent : 'text-coal/40'}`}>
                Шаг {tab.num}
              </span>
              <span className={`block text-[15px] transition-colors ${isActive ? 'text-coal' : 'text-coal/60'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Контентная часть */}
      <div className="p-[48px_32px] mobile:p-[32px_16px] min-h-[400px] flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-[1.1fr_0.9fr] gap-[60px] tablet:grid-cols-1 tablet:gap-[40px] relative z-10"
          >
            {/* Левая колонка: Текст */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-[12px] font-black ${d.bgAccent}`}>
                  {d.n}
                </span>
                <span className={`text-[12px] font-[900] tracking-widest uppercase ${d.accent}`}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </span>
              </div>
              <h3 className="text-[34px] mobile:text-[26px] font-[800] leading-[1.15] text-coal mb-6">
                {d.title}
              </h3>
              <p className="text-[17px] mobile:text-[15px] leading-relaxed text-coal/70">
                {d.text}
              </p>
            </div>

            {/* Правая колонка: Чеклист */}
            <div className="flex flex-col gap-3 justify-center">
              {d.list.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-4 p-5 mobile:p-4 rounded-[24px] bg-snow border border-forest/5 shadow-sm"
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-sm border border-forest/10 ${d.accent}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="font-[700] text-[15px] leading-snug text-coal pt-0.5">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Декоративный фон для текущего таба */}
        <div className={`absolute -right-[10%] -bottom-[20%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-[0.08] pointer-events-none transition-colors duration-500 ${d.bgAccent}`} />
      </div>
    </div>
  );
}