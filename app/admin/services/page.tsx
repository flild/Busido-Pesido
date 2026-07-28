import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import { ServiceRow } from './ServiceRow';

export const dynamic = 'force-dynamic';

export default async function AdminServices() {
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Услуги и Цены</h1>
        <Link 
          href="/admin/services/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-matcha to-forest text-white font-bold hover:-translate-y-0.5 transition-transform shadow-[0_10px_20px_rgba(47,63,23,0.15)]"
        >
          <Plus size={18} /> Добавить услугу
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">ID (URL)</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Название / Тема</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[140px]">Цена</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Краткое описание</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">Сортировка</th>
                <th className="p-4 w-[120px] text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-10 text-coal/60 font-medium">Услуг пока нет</td></tr>
              ) : (
                services.map(s => <ServiceRow key={s.id} s={s} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}