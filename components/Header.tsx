'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNav = () => setIsOpen(!isOpen);
  const isActive = (path: string) => pathname === path;

  // Выносим конфиг меню для чистоты кода
  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/services', label: 'Услуги и цены' },
    { path: '/specialists', label: 'Специалисты' }, 
    { path: '/support', label: 'Сопровождение' },
    { path: '/complex-cases', label: 'Сложные случаи' },
    { path: '/free-consultations', label: 'Бесплатные' },
    {
      label: 'Питомцы',
      subLinks: [
        { path: '/dogs', label: 'Для собак' },
        { path: '/cats', label: 'Для кошек' }
      ]
    },
    { path: '/professionals', label: 'Специалистам' },
    { path: '/blog', label: 'Блог' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-snow/92 backdrop-blur-md border-b border-forest/10 after:absolute after:inset-x-[8%] after:-bottom-[1px] after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-matcha after:to-transparent after:opacity-30">
      <div className="container flex items-center gap-[15px] min-h-[88px]">
        <Link className="flex flex-col items-start gap-1 shrink-0 min-w-[210px]" href="/">
          <span className="text-forest text-2xl font-[760] tracking-[0.025em] leading-none drop-shadow-sm">
            Бусидо-Пёсидо
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
          {navLinks.map((link) => {
            // Рендер выпадающего списка
            if (link.subLinks) {
              const isSubActive = link.subLinks.some(sub => isActive(sub.path));
              return (
                <div key={link.label} className="relative group mobile:w-full">
                  <button className={`w-full flex items-center justify-between gap-1 px-2 py-2 text-[11px] font-[650] whitespace-nowrap transition-colors hover:text-coal relative after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-dopamine after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 mobile:after:hidden ${isSubActive ? 'text-coal after:scale-x-100' : 'text-matcha'}`}>
                    {link.label} 
                    <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[140px] bg-white rounded-2xl shadow-[0_16px_45px_rgba(20,20,20,0.08)] border border-forest/10 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 flex flex-col overflow-hidden mobile:static mobile:w-full mobile:opacity-100 mobile:visible mobile:translate-y-0 mobile:translate-x-0 mobile:shadow-none mobile:border-none mobile:mt-1 mobile:pl-4 mobile:bg-transparent">
                    {link.subLinks.map(sub => (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        onClick={() => setIsOpen(false)} // Закрываем моб. меню при клике
                        className={`block px-4 py-2.5 text-[11px] font-[750] hover:bg-snow hover:text-coal transition-colors ${isActive(sub.path) ? 'text-coal bg-snow' : 'text-matcha'}`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // Рендер обычной ссылки
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                onClick={() => setIsOpen(false)} // Закрываем моб. меню при клике
                className={`relative px-2 py-2 text-[11px] font-[650] whitespace-nowrap transition-colors hover:text-coal after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-dopamine after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 mobile:after:hidden ${isActive(link.path) ? 'text-coal after:scale-x-100' : 'text-matcha'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link className="button button-dark h-[42px] px-[18px] text-[14px] whitespace-nowrap shrink-0 ml-auto mobile:hidden" href="/booking">
          Записаться
        </Link>
      </div>
    </header>
  );
}