'use client';
import { useState } from 'react';

const factorDescriptions: Record<string, [string, string]> = {
  pain: ["БОЛЬ И ДИСКОМФОРТ", "Боль может снижать переносимость контакта, менять движение, сон, мотивацию и скорость восстановления."],
  sleep: ["СОН И ВОССТАНОВЛЕНИЕ", "Недостаток сна повышает реактивность, ухудшает внимание и делает сложные контексты менее доступными."],
  load: ["СУММАРНАЯ НАГРУЗКА", "Учитываются прогулки, новизна, социальные контакты, процедуры, шум и накопление событий за несколько дней."],
  environment: ["СРЕДА", "Расстояние, ресурсы, маршруты, возможность уйти и предсказуемость человека меняют вероятность реакции."],
  learning: ["ИСТОРИЯ ОБУЧЕНИЯ", "Поведение зависит от того, какие действия раньше приводили к доступу, дистанции, прекращению давления или контакту."],
  motivation: ["МОТИВАЦИЯ", "Ценность еды, движения, дистанции, игры, запахов и социального контакта меняется вместе с состоянием."],
  contact: ["ВЗАИМОДЕЙСТВИЕ", "Движение, взгляд, прикосновения, поводок и последовательность действий человека становятся частью контекста."],
  history: ["ИНДИВИДУАЛЬНАЯ ИСТОРИЯ", "Возраст, опыт, медицинские события и предшествующие способы обучения влияют на текущую реакцию."]
};

const factors = [
  { id: 'pain', label: 'боль', colorClass: 'bg-rose/25 hover:bg-berry' },
  { id: 'sleep', label: 'сон', colorClass: 'bg-ice/25 hover:bg-berry' },
  { id: 'load', label: 'нагрузка', colorClass: 'bg-caramel/25 hover:bg-berry' },
  { id: 'environment', label: 'среда', colorClass: 'bg-matcha/30 hover:bg-berry' },
  { id: 'learning', label: 'обучение', colorClass: 'bg-rose/25 hover:bg-berry' },
  { id: 'motivation', label: 'мотивация', colorClass: 'bg-caramel/25 hover:bg-berry' },
  { id: 'contact', label: 'контакт', colorClass: 'bg-matcha/30 hover:bg-berry' },
  { id: 'history', label: 'история', colorClass: 'bg-ice/25 hover:bg-berry' },
];

export function FactorCloud() {
  const [activeFactor, setActiveFactor] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 relative z-10 mobile:grid-cols-2" id="factorCloud">
        {factors.map(f => {
          const isActive = activeFactor === f.id;
          return (
            <button 
              key={f.id}
              type="button" 
              className={`min-h-[42px] px-2.5 py-2 rounded-full border border-snow/10 text-white text-[11px] font-[650] cursor-pointer transition-all duration-200 ${isActive ? 'bg-berry shadow-[0_10px_24px_rgba(225,77,117,0.2)] -translate-y-[3px] scale-[1.025]' : f.colorClass} hover:-translate-y-[3px] hover:scale-[1.025] hover:shadow-[0_10px_24px_rgba(225,77,117,0.2)]`}
              onClick={() => setActiveFactor(f.id)}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      
      {/* Жесткая высота и flex-центрирование, чтобы текст не рвал блок */}
      <div className="h-[108px] flex flex-col justify-center mt-3.5 p-[14px_16px] rounded-[17px] bg-gradient-to-br from-snow/95 to-fog/90 text-coal relative z-10" id="factorResponse">
        {activeFactor ? (
          <>
            <span className="text-[9px] tracking-[0.12em] font-[800] text-forest">{factorDescriptions[activeFactor][0]}</span>
            <p className="mt-1.5 text-xs leading-[1.48]">{factorDescriptions[activeFactor][1]}</p>
          </>
        ) : (
          <>
            <span className="text-[9px] tracking-[0.12em] font-[800] text-forest">НАЖМИТЕ НА ФАКТОР</span>
            <p className="mt-1.5 text-xs leading-[1.48]">Сайт покажет, как он может менять доступность поведения и обучения.</p>
          </>
        )}
      </div>
    </>
  );
}