'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FolderOpen, Eye, FileText, ChevronDown } from 'lucide-react';

export function AfterConsultation() {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    { num: '01', title: 'Понятная гипотеза', desc: 'Что запускает и поддерживает поведение.', accentText: 'text-matcha', accentBg: 'bg-matcha', gradient: 'from-matcha/10', watermark: 'group-hover:text-matcha/[0.07]' },
    { num: '02', title: 'План среды и режима', desc: 'Что изменить дома и на прогулке.', accentText: 'text-caramel', accentBg: 'bg-caramel', gradient: 'from-caramel/10', watermark: 'group-hover:text-caramel/[0.07]' },
    { num: '03', title: 'Пошаговые упражнения', desc: 'Последовательность, критерии и признаки остановки.', accentText: 'text-rose', accentBg: 'bg-rose', gradient: 'from-rose/10', watermark: 'group-hover:text-rose/[0.07]' },
    { num: '04', title: 'Маршрут помощи', desc: 'Когда нужен ветеринарный врач или другой специалист.', accentText: 'text-ice', accentBg: 'bg-ice', gradient: 'from-ice/10', watermark: 'group-hover:text-ice/[0.07]' }
  ];

  return (
    <section className="py-[92px] mobile:py-[64px] bg-white relative overflow-hidden">
      <div className="container relative z-10">
        
        {/* Заголовок */}
        <ScrollReveal className="max-w-[820px] mb-[52px]">
          <span className="kicker">ПОСЛЕ КОНСУЛЬТАЦИИ</span>
          <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
            У вас остаётся рабочая система
          </h2>
        </ScrollReveal>

        {/* Сетка шагов */}
        <div className="grid grid-cols-4 gap-5 tablet:grid-cols-2 mobile:grid-cols-1 items-stretch">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i} className="flex h-full">
              <article className="group relative w-full flex flex-col p-8 mobile:p-6 rounded-[28px] bg-snow border border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default hover:-translate-y-1.5">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${step.gradient} to-transparent transition-opacity duration-700 pointer-events-none`} />
                <span className={`absolute -bottom-8 -right-4 text-[140px] font-black leading-none text-coal/[0.02] ${step.watermark} transition-colors duration-500 pointer-events-none select-none`}>
                  {step.num}
                </span>
                <div className={`absolute top-0 left-0 h-1.5 w-12 ${step.accentBg} rounded-br-full transition-all duration-500 group-hover:w-full`} />
                <div className="relative z-10 flex flex-col h-full mt-3">
                  <strong className={`text-[13px] font-[900] tracking-widest uppercase ${step.accentText} mb-6 block`}>
                    Шаг {step.num}
                  </strong>
                  <h3 className="text-[22px] leading-tight mb-4 text-coal">
                    {step.title}
                  </h3>
                  <p className="text-coal/65 leading-relaxed mt-auto">
                    {step.desc}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* НОВЫЙ БЛОК: Интерактивная плашка с показом папки/PDF */}
        <ScrollReveal delay={4} className="mt-8">
          <div
            className={`relative bg-snow border transition-colors duration-300 rounded-[32px] p-8 mobile:p-6 cursor-pointer overflow-hidden ${
              isOpen ? 'border-matcha/30 shadow-md' : 'border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-lg'
            }`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Шапка плашки (видима всегда) */}
            <div className="flex items-center justify-between gap-6 max-md:flex-col max-md:items-start max-md:text-left">
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-2xl text-white shrink-0 transition-colors ${isOpen ? 'bg-matcha' : 'bg-coal'}`}>
                  <FolderOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-coal mb-1">Персональный протокол</h3>
                  <p className="text-sm text-coal/70 leading-relaxed max-w-xl">
                    Все указания, схемы и упражнения мы собираем в аккуратную физическую папку (или PDF), которая останется у вас как пошаговая инструкция.
                  </p>
                </div>
              </div>
              <button className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isOpen ? 'bg-matcha/10 text-matcha' : 'bg-white border border-forest/15 text-coal hover:bg-snow'
              }`}>
                <Eye size={16} />
                {isOpen ? 'Скрыть пример' : 'Посмотреть пример'}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Скрытый контент (Анимация раскрытия) */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="w-full aspect-[21/9] max-md:aspect-[4/3] bg-white rounded-2xl border border-forest/10 flex items-center justify-center relative overflow-hidden group">
                    
                    {/* 👇 ТУТ БУДЕТ ТВОЯ КАРТИНКА ПАПКИ ИЛИ СКРИНШОТ ПДФ */}
                    <img src="/uploads/your-folder-photo.jpg" alt="Пример папки" className="absolute inset-0 w-full h-full object-cover" />
                    
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}