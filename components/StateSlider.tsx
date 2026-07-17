'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { TiltCard } from './TiltCard';

// Компонент для физичной анимации чисел (без Hydration Mismatch)
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, { bounce: 0, duration: 0.6 });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{value}</span>;
}

const STATE_ZONES = [
  { 
    max: 23, 
    label: "ВОССТАНОВЛЕНИЕ", 
    title: "Главная задача — сохранить спокойное состояние", 
    text: "Подойдут сон, свободное исследование, спокойный контакт и отсутствие новых требований.", 
    priority: "сон · безопасность · предсказуемость", 
    bg: "radial-gradient(circle at 80% 10%,rgba(216,211,179,.28),transparent 27%),linear-gradient(145deg,#2F3F17,#1E2B0E)", 
    badgeText: "text-oat", 
    badgeBg: "bg-white/5 border-white/10" 
  },
  { 
    max: 57, 
    label: "РАБОЧИЙ ДИАПАЗОН", 
    title: "Доступны короткие и понятные задачи", 
    text: "Можно обучать, сохраняя высокую частоту подкрепления, небольшие шаги и возможность сделать паузу.", 
    priority: "ясность · короткая серия · восстановление", 
    bg: "radial-gradient(circle at 80% 10%,rgba(111,143,191,.24),transparent 27%),radial-gradient(circle at 12% 88%,rgba(198,142,107,.24),transparent 29%),linear-gradient(145deg,#1E2B0E,#141414)", 
    badgeText: "text-ice", 
    badgeBg: "bg-ice/10 border-ice/20" 
  },
  { 
    max: 82, 
    label: "ВЫСОКАЯ АКТИВАЦИЯ", 
    title: "Сначала снижаем сложность и увеличиваем дистанцию", 
    text: "Формальные задачи становятся менее надёжными. Приоритетом становятся управление, движение, дистанция и выход из ситуации.", 
    priority: "дистанция · упрощение · прекращение серии", 
    bg: "radial-gradient(circle at 80% 10%,rgba(240,114,150,.31),transparent 30%),linear-gradient(145deg,#571F0B,#141414)", 
    badgeText: "text-caramel", 
    badgeBg: "bg-caramel/10 border-caramel/20" 
  },
  { 
    max: 100, 
    label: "ПЕРЕГРУЗКА", 
    title: "Обучение временно недоступно", 
    text: "Нужны безопасность, прекращение воздействия, выход из контекста и последующее восстановление. Проверка навыка откладывается.", 
    priority: "безопасность · выход · восстановление", 
    bg: "radial-gradient(circle at 80% 10%,rgba(225,77,117,.38),transparent 31%),radial-gradient(circle at 12% 88%,rgba(111,143,191,.22),transparent 29%),linear-gradient(145deg,#141414,#571F0B)", 
    badgeText: "text-rose", 
    badgeBg: "bg-rose/10 border-rose/20" 
  }
];

const actionButtons = [
  { label: "После сна", val: 18, bgClass: "bg-white text-forest border-forest/15 hover:border-forest/40" },
  { label: "Новая среда", val: 45, bgClass: "bg-oat/55 text-forest border-forest/15 hover:border-forest/40" },
  { label: "Сложная встреча", val: 76, bgClass: "bg-caramel/20 text-espresso border-caramel/30 hover:border-caramel/50" },
  { label: "Острый эпизод", val: 94, bgClass: "bg-rose/15 text-rose border-rose/30 hover:border-rose/50" },
];

export function StateSlider() {
  const [value, setValue] = useState(28);

  const data = useMemo(() => {
    return STATE_ZONES.find(z => value <= z.max) || STATE_ZONES[STATE_ZONES.length - 1];
  }, [value]);

  return (
    <>
      <div>
        <div className="max-w-[820px] mb-[42px]">
          <span className="inline-block text-[12px] uppercase tracking-[0.14em] font-[650] text-forest mb-2">ИНТЕРАКТИВНАЯ ШКАЛА</span>
          <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">Насколько обучение доступно в текущем состоянии</h2>
          <p className="mt-4 text-matcha text-lg">Передвиньте шкалу. Она показывает, как меняются приоритеты работы по мере роста возбуждения и нагрузки.</p>
        </div>

        <div className="p-[34px] max-md:p-6 rounded-[34px] bg-white/70 border border-forest/15 shadow-[0_24px_70px_rgba(30,43,14,0.06)] backdrop-blur-md">
          <div className="flex justify-between items-end mb-6">
            <label htmlFor="stateSlider" className="block font-black text-coal text-xl">Уровень активации</label>
            <span className="font-bold text-rose text-xl">{value}/100</span>
          </div>
          
          {/* Кастомный ползунок с невидимым нативным инпутом для доступности */}
          <div className="relative w-full h-10 flex items-center group">
            <div className="absolute w-full h-3 bg-fog/50 rounded-full overflow-hidden inset-y-0 my-auto pointer-events-none">
              <motion.div
                className="h-full bg-gradient-to-r from-matcha via-caramel to-rose"
                animate={{ width: `${value}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              />
            </div>
            
            <input 
              id="stateSlider" 
              type="range" 
              min="0" 
              max="100" 
              value={value} 
              step="1"
              onChange={(e) => setValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            
            <motion.div
              className="absolute w-8 h-8 bg-white rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.18)] border border-forest/10 z-10 flex items-center justify-center pointer-events-none group-hover:scale-110 group-active:scale-95 transition-transform duration-200"
              animate={{ left: `${value}%`, x: "-50%" }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose animate-pulse" />
            </motion.div>
          </div>

          <div className="flex justify-between mt-4 text-coal/50 text-[10px] font-bold uppercase tracking-wider transition-colors">
            <span className={value <= 23 ? 'text-matcha' : ''}>восстановление</span>
            <span className={value > 23 && value <= 57 ? 'text-caramel' : ''}>рабочий диапазон</span>
            <span className={value > 82 ? 'text-rose' : ''}>перегрузка</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-6">
          {actionButtons.map(btn => (
            <button 
              key={btn.val}
              type="button" 
              onClick={() => setValue(btn.val)}
              className={`px-3.5 py-2.5 rounded-full border font-[650] text-sm transition-colors cursor-pointer ${btn.bgClass}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <TiltCard 
        className="min-h-[500px] rounded-[42px] text-white shadow-[0_35px_90px_rgba(30,43,14,0.24)] transition-all duration-300 ease-out transform-gpu preserve-3d flex flex-col relative overflow-hidden" 
      >
        {/* Плавный Crossfade фонов */}
        <AnimatePresence>
          <motion.div
            key={data.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{ background: data.bg }}
          />
        </AnimatePresence>

        <div className="relative z-10 p-10 max-md:p-7 flex flex-col h-full flex-1">
          {/* Вращается ТОЛЬКО фон с кругами */}
          <div className="relative w-[190px] h-[190px] max-md:w-[155px] max-md:h-[155px] mx-auto mb-7 grid place-items-center shrink-0">
            <motion.div 
              animate={{ rotate: value * 1.5, scale: 1 + value / 400 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="absolute inset-0 rounded-full bg-[conic-gradient(var(--matcha),var(--caramel),var(--rose),var(--ice),var(--matcha))] shadow-[0_20px_50px_rgba(0,0,0,0.24)]"
            >
              <div className="absolute inset-[15px] rounded-full bg-coal"></div>
              <i className="absolute inset-[-17px] rounded-full border border-white/20"></i>
              <i className="absolute inset-[-34px] rounded-full border border-white/20"></i>
            </motion.div>
            
            {/* Текст не вращается, только скейлится */}
            <motion.strong 
              animate={{ scale: 1 + value / 400 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="relative z-10 text-[62px] max-md:text-[48px] font-black leading-none"
            >
              <Counter value={value} />
            </motion.strong>
          </div>
          
          <div className="h-[240px] max-md:h-[260px] flex flex-col justify-end">
            {/* Blur-fade анимация смены контента */}
            <AnimatePresence mode="wait">
              <motion.div
                key={data.label}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col h-full justify-end"
              >
                <span className={`block text-[10px] tracking-[0.14em] font-extrabold mb-3 mt-auto ${data.badgeText}`}>{data.label}</span>
                <h3 className="text-[34px] max-md:text-[28px] leading-tight mb-3 text-white font-bold">{data.title}</h3>
                <p className="text-snow/80 text-base leading-relaxed">{data.text}</p>
                
                <div className={`mt-6 p-4 rounded-[17px] border backdrop-blur-md min-h-[80px] flex flex-col justify-center shrink-0 ${data.badgeBg}`}>
                  <b className="block text-[10px] text-white/50 tracking-[0.1em] uppercase">ПРИОРИТЕТ</b>
                  <span className="block mt-1 text-[13px] font-bold text-white">{data.priority}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </TiltCard>
    </>
  );
}