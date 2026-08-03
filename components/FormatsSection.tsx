'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceInteractive } from './ServiceInteractive';
import { TiltCard } from './TiltCard';
import { ScrollReveal } from './ScrollReveal';
import { themeColors, type BrandTheme } from '@/lib/theme';

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
  steps: string;
}

interface FormatsSectionProps {
  formats: ServiceFormat[];
}

const INITIAL_COUNT = 4;

export function FormatsSection({ formats }: FormatsSectionProps) {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleService = (service: string) => {
    setActiveService(activeService === service ? null : service);
  };

  const handleToggleShowAll = () => {
    if (showAll) {
      const activeIndex = formats.findIndex(f => f.id === activeService);
      if (activeIndex >= INITIAL_COUNT) {
        setActiveService(null);
      }
    }
    setShowAll(!showAll);
  };

  const visibleFormats = showAll ? formats : formats.slice(0, INITIAL_COUNT);
  const hasMore = formats.length > INITIAL_COUNT;

  const activeFormatData = formats.find(f => f.id === activeService);
  const availableThemes = Object.keys(themeColors) as BrandTheme[];

  const getSafeThemeKey = (themeStr: string | undefined | null, fallbackIndex: number): BrandTheme => {
    if (themeStr && themeStr in themeColors) {
      return themeStr as BrandTheme;
    }
    return availableThemes[fallbackIndex % availableThemes.length];
  };
  
  return (
    <section className="py-[92px] mobile:py-[64px] bg-[linear-gradient(180deg,theme(colors.snow),rgba(255,255,255,0))] overflow-hidden">
      <div className="container">
        <ScrollReveal className="max-w-[820px] mb-[42px] max-md:mb-[32px]">
          <span className="kicker">ФОРМАТЫ РАБОТЫ</span>
          <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
            Выберите формат работы
          </h2>
          <p className="text-xl max-md:text-[16px] text-matcha mt-4">
            Цены расположены после знакомства с подходом, чтобы формат выбирался по задаче, объёму данных и необходимой поддержке.
          </p>
        </ScrollReveal>
        
        <motion.div layout className="grid grid-cols-4 gap-4 tablet:grid-cols-2 mobile:grid-cols-1 items-stretch">
          <AnimatePresence mode="popLayout">
            {visibleFormats.map((format, index) => {
              const isActive = activeService === format.id;
              const themeKey = getSafeThemeKey(format.theme, index);
              const theme = themeColors[themeKey];
              
              return (
                <motion.div 
                  key={format.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full"
                >
                  <TiltCard 
                    className={`group flex flex-col w-full h-full p-8 max-md:p-5 rounded-[32px] max-md:rounded-[24px] border relative overflow-hidden transition-all duration-300 ${format.is_featured ? 'bg-[linear-gradient(155deg,theme(colors.snow),theme(colors.white)_65%)] border-forest/20 shadow-md' : 'bg-white border-forest/10 hover:border-forest/20 hover:shadow-xl'} ${isActive ? `ring-2 ${theme.ring} ${theme.softBg} shadow-2xl scale-[1.02] md:scale-[1.03] z-10` : ''}`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 max-md:h-1 opacity-80 ${theme.bg}`}></div>

                    {/* ФИКС: Обертка фиксированной высоты для тега */}
                    <div className="h-[28px] mb-5 max-md:mb-3 flex items-start">
                      {format.tag && (
                        <span className="inline-block px-3 py-1.5 max-md:px-2.5 max-md:py-1 rounded-full bg-fog/70 text-espresso text-[11px] max-md:text-[10px] font-[950] uppercase tracking-[0.08em]">
                          {format.tag}
                        </span>
                      )}
                    </div>
                      
                    {/* ФИКС: Минимальная высота для заголовка (резервируем место под 2 строки на десктопе) */}
                    <h3 className="text-2xl max-md:text-[20px] mt-0 mb-1 max-md:mb-0.5 leading-tight text-coal md:min-h-[60px]">
                      {format.title}
                    </h3>
                    
                    <div className="text-[38px] max-md:text-[28px] font-black tracking-tighter mt-1 mb-4 max-md:mb-2 text-coal">
                      {format.price}
                    </div>
                    
                    <p className="text-coal/60 text-[15px] max-md:text-[13px] leading-relaxed max-md:leading-snug">
                      {format.description}
                    </p>
                    
                    <div className="mt-auto pt-8 max-md:pt-4 flex flex-col gap-2 relative z-10">
                      <Link 
                        className={`button w-full font-[800] text-[15px] max-md:text-[14px] max-md:py-2.5 ${format.is_featured ? 'button-primary' : 'bg-snow text-coal hover:bg-fog transition-colors border border-forest/5'}`} 
                        href={format.link}
                      >
                        {format.link_text}
                      </Link>
                      
                      <button 
                        className={`bg-transparent border-0 p-0 text-[13px] max-md:text-[11px] font-[800] uppercase tracking-wider cursor-pointer transition-all duration-300 md:opacity-0 md:-translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 h-8 max-md:h-6 max-md:mt-1 flex items-center justify-center max-md:opacity-100 max-md:translate-y-0 ${isActive ? `md:opacity-100 md:translate-y-0 ${theme.text}` : 'text-coal/50 hover:text-coal'}`}
                        onClick={() => toggleService(format.id)}
                      >
                        {isActive ? 'Скрыть детали ↑' : 'Детали формата ↓'}
                      </button>
                    </div>
                  </TiltCard>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
        
        {hasMore && (
          <motion.div layout className="flex justify-center mt-8 max-md:mt-6">
            <button 
              onClick={handleToggleShowAll}
              className="px-6 py-3 rounded-full border border-forest/20 bg-white text-[14px] max-md:text-[13px] font-[800] text-coal shadow-sm hover:shadow-md hover:border-forest/40 transition-all duration-300 max-md:w-full"
            >
              {showAll ? 'Скрыть дополнительные форматы ↑' : `Показать все форматы (${formats.length}) ↓`}
            </button>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {activeService && activeFormatData && (() => {
            const activeIndex = formats.findIndex(f => f.id === activeService);
            const activeThemeKey = getSafeThemeKey(activeFormatData.theme, Math.max(0, activeIndex));
            
            return (
              <motion.div 
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="mt-8 max-md:mt-6">
                  <ServiceInteractive 
                    format={activeFormatData} 
                    activeBorderColor={themeColors[activeThemeKey].borderTop}
                    onClose={() => setActiveService(null)} 
                  />
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
        
        <motion.p layout className="text-center mt-10 max-md:mt-6">
          <Link className="inline-flex items-center gap-2 font-[950] max-md:text-[14px] text-forest hover:text-espresso transition-colors" href="/services">
            Все услуги, условия и цены →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}