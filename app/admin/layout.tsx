import Link from 'next/link';
import { LayoutDashboard, FileText, Users, ArrowLeft,CalendarDays } from 'lucide-react';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-snow">
      <aside className="w-[260px] bg-white border-r border-forest/15 py-6 flex flex-col shrink-0 max-md:hidden">
        <div className="px-6 pb-6 border-b border-forest/15 mb-6">
          <h2 className="text-[20px] font-bold text-coal mb-3 m-0">Busido Admin</h2>
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-[13px] text-coal/60 font-bold hover:text-forest transition-colors"
          >
            <ArrowLeft size={16} /> На сайт
          </Link>
        </div>
        
        <nav className="flex flex-col px-3 gap-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-coal font-bold text-sm transition-colors hover:bg-snow hover:text-forest group"
          >
            <LayoutDashboard size={18} className="text-coal/60 group-hover:text-forest transition-colors" /> 
            Дашборд
          </Link>
          <Link 
            href="/admin/applications" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-coal font-bold text-sm transition-colors hover:bg-snow hover:text-forest group"
          >
            <Users size={18} className="text-coal/60 group-hover:text-forest transition-colors" /> 
            Заявки
          </Link>
          <Link 
            href="/admin/articles" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-coal font-bold text-sm transition-colors hover:bg-snow hover:text-forest group"
          >
            <FileText size={18} className="text-coal/60 group-hover:text-forest transition-colors" /> 
            Статьи
          </Link>

          <Link 
            href="/admin/schedule" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-coal font-bold text-sm transition-colors hover:bg-snow hover:text-forest group"
          >
            <CalendarDays size={18} className="text-coal/60 group-hover:text-forest transition-colors" /> 
            Расписание бесплатных консультаций
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 p-[42px] max-md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}