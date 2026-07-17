'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceInteractive } from './ServiceInteractive';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { themeColors, type BrandTheme } from '@/lib/theme';

// Интерфейс полностью повторяет структуру таблицы services из SQLite
export interface ServiceFormat {
  id: string;
  title: string;
  price: string;
  description: string;
  tag: string | null;
  theme: string;
  is_featured: number;
  link: string;
  link_text: string;
  steps: string; // JSON-строка из БД
}

interface FormatsSectionProps {
  formats: ServiceFormat[];
}

export function FormatsSection({ formats }: FormatsSectionProps) {
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
                  className={`group flex flex-col w-full h-full p-8 max-md:p-6 rounded-[32px] border relative overflow-hidden transition-all duration-300 ${format.is_featured ? 'bg-[linear-gradient(155deg,theme(colors.snow),theme(colors.white)_65%)] border-forest/20 shadow-md' : 'bg-white border-forest/10 hover:border-forest/20 hover:shadow-xl'} ${isActive ? `ring-2 ${theme.ring} ${theme.softBg} shadow-2xl scale-[1.02] md:scale-[1.03] z-10` : ''}`}
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
                    {format.description}
                  </p>
                  
                  <div className="mt-auto pt-8 flex flex-col gap-2 relative z-10">
                    <Link 
                      className={`button w-full font-[800] text-[15px] ${format.is_featured ? 'button-primary' : 'bg-snow text-coal hover:bg-fog transition-colors border border-forest/5'}`} 
                      href={format.link}
                    >
                      {format.link_text}
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
                {/* Передаем ВЕСЬ объект формата вниз */}
                <ServiceInteractive 
                  format={activeFormatData} 
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