//app/admin/layout.tsx
'use client';

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
  Layers
} from 'lucide-react';

// Выносим конфиг меню, чтобы не плодить HTML-лапшу
const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/applications', label: 'Заявки', icon: Users },
  { href: '/admin/schedule', label: 'Бесплатные места', icon: CalendarDays },
  { href: '/admin/articles', label: 'Блог и статьи', icon: FileText },
  { href: '/admin/cases', label: 'Кейсы', icon: FolderKanban },
  { href: '/admin/reviews', label: 'Отзывы', icon: MessageSquare },
  { href: '/admin/navigator', label: 'Навигатор', icon: Map },
  { href: '/admin/services', label: 'Услуги и Цены', icon: Layers }, // Заодно добавил услуги, которые есть в базе
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-snow">
      {/* 
        Добавили sticky top-0 и h-screen, 
        чтобы сайдбар не улетал при скролле длинных таблиц 
      */}
      <aside className="w-[260px] bg-white border-r border-forest/15 py-6 flex flex-col shrink-0 max-md:hidden sticky top-0 h-screen overflow-y-auto custom-scrollbar z-50">
        <div className="px-6 pb-6 border-b border-forest/15 mb-6">
          <h2 className="text-[20px] font-bold text-coal mb-3 m-0">Busido Admin</h2>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-[13px] text-coal/60 font-bold hover:text-forest transition-colors"
          >
            <ArrowLeft size={16} /> На сайт
          </Link>
        </div>
        
        <nav className="flex flex-col px-3 gap-1.5">
          {NAV_ITEMS.map((item) => {
            // Для главной админки нужно точное совпадение, для остальных — startsWith (чтобы подсвечивало и страницы /edit)
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link 
                key={item.href}
                href={item.href} 
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
      
      <main className="flex-1 p-[42px] max-md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}