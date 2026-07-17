'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNav = () => setIsOpen(!isOpen);
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-snow/92 backdrop-blur-md border-b border-forest/10 after:absolute after:inset-x-[8%] after:-bottom-[1px] after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-matcha after:to-transparent after:opacity-30">
      <div className="container flex items-center gap-[15px] min-h-[88px]">
        <Link className="flex flex-col items-start gap-1 shrink-0 min-w-[210px]" href="/">
          <span className="text-forest text-2xl font-[760] tracking-[0.025em] leading-none drop-shadow-sm">
            BUSIDO-PESIDO
          </span>
          <span className="text-[9px] uppercase tracking-[0.13em] text-coal/60 font-[650] mobile:hidden">
            поведение · состояние · благополучие
          </span>
        </Link>
        
        <button 
          className="hidden mobile:block ml-auto border border-forest/15 bg-white px-3 py-2 rounded-xl text-sm font-bold"
          aria-expanded={isOpen} 
          onClick={toggleNav}
        >
          Меню
        </button>

        <nav className={`flex flex-1 justify-center items-center mobile:fixed mobile:inset-x-5 mobile:top-[114px] mobile:flex-col mobile:items-stretch mobile:bg-white mobile:p-4 mobile:rounded-2xl mobile:shadow-[0_24px_70px_rgba(30,43,14,0.12)] mobile:hidden ${isOpen ? 'mobile:!flex' : ''}`}>
          {[
            { path: '/', label: 'Главная' },
            { path: '/services', label: 'Услуги и цены' },
            { path: '/support', label: 'Сопровождение' },
            { path: '/complex-cases', label: 'Сложные случаи' },
            { path: '/free-consultations', label: 'Бесплатные' },
            { path: '/library', label: 'Библиотека' },
            { path: '/cats', label: 'Кошки' },
            { path: '/professionals', label: 'Специалистам' },
            { path: '/blog', label: 'Блог' },
          ].map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`relative px-2 py-2 text-[11px] font-[650] whitespace-nowrap transition-colors hover:text-coal after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-dopamine after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 ${isActive(link.path) ? 'text-coal after:scale-x-100' : 'text-matcha'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link className="button button-dark h-[42px] px-[18px] text-[14px] whitespace-nowrap shrink-0 ml-auto mobile:hidden" href="/booking">
          Записаться
        </Link>
      </div>
    </header>
  );
}