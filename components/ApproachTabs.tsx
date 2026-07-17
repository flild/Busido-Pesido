'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TabId = 'state' | 'environment' | 'load' | 'recovery' | 'learning';

const approachData: Record<TabId, { n: string, title: string, text: string, list: string[], colorClass: string }> = {
  state: { n: "01", title: "Состояние определяет доступность поведения", text: "Оцениваются сон, боль, зуд, ЖКТ, аппетит, движение, сенсорная нагрузка, лекарства и способность возвращаться к спокойному состоянию.", list: ["Что изменилось вместе с поведением", "Какие признаки требуют медицинской проверки", "Какая нагрузка сейчас доступна"], colorClass: "bg-matcha text-white" },
  environment: { n: "02", title: "Среда ежедневно поддерживает или снижает напряжение", text: "Разбираются пространство, ресурсы, дистанция, маршруты, режим, шум, контакты и возможность уйти из взаимодействия.", list: ["Где реакция появляется чаще", "Какие условия усиливают напряжение", "Что можно изменить до тренинга"], colorClass: "bg-caramel text-white" },
  load: { n: "03", title: "Нагрузка оценивается в сумме, а не по одному событию", text: "Учитываются прогулки, социальные контакты, новизна, бытовые процедуры, дефицит сна и накопление сложных эпизодов.", list: ["Как быстро растёт возбуждение", "Сколько длится восстановление", "Какие нагрузки стоит сократить"], colorClass: "bg-rose text-white" },
  recovery: { n: "04", title: "Восстановление создаёт основу для устойчивого обучения", text: "Проверяются качество сна, спокойные зоны, ритуалы, исследовательская активность и способность делать паузу после событий.", list: ["Есть ли полноценный сон", "Может ли животное прекращать активность", "Что возвращает спокойствие"], colorClass: "bg-ice text-white" },
  learning: { n: "05", title: "Обучение строится внутри доступного уровня сложности", text: "Навык дробится на этапы, формируются ясные критерии, учитываются мотивация, контекст и последствия каждого действия.", list: ["Как выглядит исходное поведение", "Какой следующий шаг реалистичен", "По каким данным повышать сложность"], colorClass: "bg-oat text-coal" }
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
    <div className="rounded-[38px] bg-white border border-forest/15 shadow-2xl overflow-hidden">
      <div className="inline-flex items-center gap-2 m-[34px_38px_0] px-3 py-2 rounded-full bg-rose/10 text-espresso text-[11px] font-[700]">
        <span className="w-2.5 h-2.5 rounded-full bg-rose shadow-[0_0_0_0_rgba(225,77,117,0.35)] animate-pulse-hint"></span>
        Нажимайте на этапы
      </div>
      
      <div className="grid grid-cols-5 gap-2 p-[18px] tablet:flex tablet:overflow-x-auto scrollbar-hide" role="tablist">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const activeColor = approachData[tab.id].colorClass;
          
          return (
            <button 
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`p-[17px_14px] border-0 rounded-[17px] text-left font-[850] cursor-pointer transition-colors tablet:min-w-[170px] ${isActive ? activeColor : 'bg-snow hover:bg-fog/50'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={`block text-[10px] mb-1.5 transition-colors ${isActive ? (tab.id === 'learning' ? 'text-forest' : 'text-oat') : 'text-matcha'}`}>
                {tab.num}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>
      
      <div className="min-h-[340px] p-[42px] bg-gradient-to-br from-snow to-fog relative overflow-hidden mobile:p-7" role="tabpanel">
        
        {/* Быстрая анимация без каскадов: только fade и легкий сдвиг */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="grid grid-cols-[1.1fr_0.9fr] gap-[34px] tablet:grid-cols-1 relative z-10"
          >
            <div>
              <span className="block text-[11px] font-[950] text-matcha mb-2">{d.n}</span>
              <h3 className="text-[39px] mobile:text-[32px] my-4 leading-tight text-coal">{d.title}</h3>
              <p className="text-[17px] text-coal/60">{d.text}</p>
            </div>

            <div className="grid content-start gap-3 mt-2 tablet:mt-0">
              {d.list.map((item, i) => (
                <span 
                  key={i} 
                  className="p-[15px_17px] rounded-2xl bg-white/70 backdrop-blur-sm border border-forest/15 font-[800] text-coal shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute w-[190px] h-[190px] -right-[75px] -bottom-[85px] rounded-full bg-gradient-to-br from-rose/20 to-ice/20 pointer-events-none"></div>
      </div>
    </div>
  );
}