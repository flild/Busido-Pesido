'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  FolderKanban,
  Map,
  BadgeCheck,
  Layers,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/applications', label: 'Заявки', icon: Users },
  { href: '/admin/schedule', label: 'Бесплатные места', icon: CalendarDays },
  { href: '/admin/articles', label: 'Блог и статьи', icon: FileText },
  { href: '/admin/cases', label: 'Кейсы', icon: FolderKanban },
  { href: '/admin/reviews', label: 'Отзывы', icon: MessageSquare },
  { href: '/admin/navigator', label: 'Навигатор', icon: Map },
  { href: '/admin/specialists', label: 'Специалисты', icon: BadgeCheck },
  { href: '/admin/services', label: 'Услуги и Цены', icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-snow max-md:flex-col relative">
      
      {/* МОБИЛЬНАЯ ШАПКА */}
      <div className="hidden max-md:flex items-center justify-between p-4 bg-white border-b border-forest/15 sticky top-0 z-40 shadow-sm">
        <h2 className="text-[18px] font-bold text-coal m-0">Busido Admin</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-coal/80 hover:bg-snow rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ОВЕРЛЕЙ ДЛЯ МОБИЛОК */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-coal/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* САЙДБАР */}
      <aside className={`
        w-[260px] bg-white border-r border-forest/15 py-6 flex flex-col shrink-0 
        sticky top-0 h-screen overflow-y-auto custom-scrollbar z-50 transition-transform duration-300
        max-md:fixed max-md:left-0 max-md:top-0 max-md:bottom-0 max-md:shadow-2xl max-md:w-[280px]
        ${isMobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
      `}>
        <div className="px-6 pb-6 border-b border-forest/15 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-coal mb-3 m-0">Busido Admin</h2>
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-[13px] text-coal/60 font-bold hover:text-forest transition-colors"
            >
              <ArrowLeft size={16} /> На сайт
            </Link>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-coal/60 hover:bg-snow rounded-xl"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col px-3 gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-forest text-white shadow-md' 
                    : 'text-coal hover:bg-snow hover:text-forest'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors ${
                    isActive ? 'text-white' : 'text-coal/50 group-hover:text-forest'
                  }`} 
                /> 
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      
      <main className="flex-1 p-[42px] max-md:p-4 overflow-x-hidden w-full">
        {children}
      </main>
    </div>
  );
}