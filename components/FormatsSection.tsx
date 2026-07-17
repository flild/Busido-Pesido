'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceInteractive } from './ServiceInteractive';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { themeColors, type BrandTheme } from '@/lib/theme';
/*
 * ============================================================================
 * ПЛАН ДЛЯ АДМИНКИ (ДИНАМИЧЕСКИЕ ЦЕНЫ И ФОРМАТЫ)
 * ============================================================================
 * Этот массив `formats` нужно перенести в базу данных SQLite (таблица `services`).
 * Поля таблицы: id, slug, title, price (INT), desc, tag, is_active, steps (JSON).
 * * В админке создаем простую форму редактирования:
 * - Поле для цены (чтобы легко менять при инфляции).
 * - Поля для текста и шагов.
 * * На сервере: const formats = db.prepare('SELECT * FROM services WHERE is_active = 1').all();
 * И передаем этот массив пропсами в этот клиентский компонент.
 * ============================================================================
 */

const formats = [
  {
    id: 'online',
    title: 'Онлайн-консультация',
    price: '6 000 ₽',
    desc: 'Полный разбор одного животного и одного основного запроса, письменный план и обратная связь.',
    tag: 'Основной формат',
    link: '/booking?service=online',
    linkText: 'Записаться',
    theme: 'matcha',
    isFeatured: true,
  },
  {
    id: 'offline',
    title: 'Очная / выездная',
    price: '8 000 ₽',
    desc: 'Наблюдение в реальной среде, оценка факторов дома и на улице, работа с конкретными контекстами.',
    link: '/booking?service=offline',
    linkText: 'Выбрать дату',
    theme: 'caramel',
  },
  {
    id: 'support',
    title: 'Онлайн-сопровождение',
    price: '22 000 ₽',
    desc: 'Регулярная проверка домашних заданий, подробный анализ видео и корректировка плана работы.',
    link: '/support',
    linkText: 'Подробнее',
    theme: 'rose',
  },
  {
    id: 'second',
    title: 'Второе мнение',
    price: '2 500 ₽',
    desc: 'Детальный разбор медицинских документов, оценка результатов диагностики и текущих назначений.',
    link: '/complex-cases',
    linkText: 'Как проходит',
    theme: 'ice',
  }
];

export function FormatsSection() {
  const [activeService, setActiveService] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setActiveService(activeService === service ? null : service);
  };

  const activeFormatData = formats.find(f => f.id === activeService);
  
return (
    <section className="py-[92px] mobile:py-[64px] bg-[linear-gradient(180deg,theme(colors.snow),rgba(255,255,255,0))]">
      <div className="container">
        <ScrollReveal className="max-w-[820px] mb-[42px]">
          <span className="kicker">ФОРМАТЫ РАБОТЫ</span>
          <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
            Выберите глубину помощи
          </h2>
          <p className="text-xl text-matcha mt-4">
            Цены расположены после знакомства с подходом, чтобы формат выбирался по задаче, объёму данных и необходимой поддержке.
          </p>
        </ScrollReveal>
        
<div className="grid grid-cols-4 gap-4 tablet:grid-cols-2 mobile:grid-cols-1 items-stretch">
  {formats.map((format) => {
    const isActive = activeService === format.id;
    const theme = themeColors[format.theme as BrandTheme];
    
    return (
      <div key={format.id} className="flex h-full">
        <TiltCard 
          // 1. Вернули чистый p-8
          className={`group flex flex-col w-full h-full p-8 max-md:p-6 rounded-[32px] border relative overflow-hidden transition-all duration-300 ${format.isFeatured ? 'bg-[linear-gradient(155deg,theme(colors.snow),theme(colors.white)_65%)] border-forest/20 shadow-md' : 'bg-white border-forest/10 hover:border-forest/20 hover:shadow-xl'} ${isActive ? `ring-2 ${theme.ring} ${theme.softBg} shadow-2xl scale-[1.02] md:scale-[1.03] z-10` : ''}`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1.5 opacity-80 ${theme.bg}`}></div>

          {format.tag ? (
            <span className="inline-block self-start px-3 py-1.5 rounded-full bg-fog/70 text-espresso text-[11px] font-[950] uppercase tracking-[0.08em] mb-5">
              {format.tag}
            </span>
          ) : (
            <div className="h-[28px] mb-5" />
          )}
            
          <h3 className="text-2xl mt-0 mb-1 leading-tight text-coal">{format.title}</h3>
          <div className="text-[38px] font-black tracking-tighter mt-1 mb-4 text-coal">{format.price}</div>
          
          <p className="text-coal/60 text-[15px] leading-relaxed">
            {format.desc}
          </p>
          
          {/* 2. ИДЕАЛЬНАЯ ВЕРСТКА: mt-auto сам прижмет этот блок к низу. 
              А pt-8 гарантирует, что даже на маленьких экранах кнопки не прилипнут к тексту. */}
          <div className="mt-auto pt-8 flex flex-col gap-2 relative z-10">
            <Link 
              className={`button w-full font-[800] text-[15px] ${format.isFeatured ? 'button-primary' : 'bg-snow text-coal hover:bg-fog transition-colors border border-forest/5'}`} 
              href={format.link}
            >
              {format.linkText}
            </Link>
            
            <button 
              className={`bg-transparent border-0 p-0 text-[13px] font-[800] uppercase tracking-wider cursor-pointer transition-all duration-300 md:opacity-0 md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 h-8 flex items-center justify-center ${isActive ? `md:opacity-100 md:translate-y-0 ${theme.text}` : 'text-coal/50 hover:text-coal'}`}
              onClick={() => toggleService(format.id)}
            >
              {isActive ? 'Скрыть детали ↑' : 'Детали формата ↓'}
            </button>
          </div>
        </TiltCard>
      </div>
    )
  })}
</div>
        
        <AnimatePresence initial={false}>
          {activeService && activeFormatData && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="mt-8">
                {/* ЗДЕСЬ ПЕРЕДАЕМ БОРДЕР ИЗ ГЛОБАЛЬНОЙ ТЕМЫ */}
                <ServiceInteractive 
                  activeServiceKey={activeService} 
                  activeBorderColor={themeColors[activeFormatData.theme as BrandTheme].borderTop}
                  onClose={() => setActiveService(null)} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center mt-10">
          <Link className="inline-flex items-center gap-2 font-[950] text-forest hover:text-espresso transition-colors" href="/services">
            Все услуги, условия и цены →
          </Link>
        </p>
      </div>
    </section>
  );
}