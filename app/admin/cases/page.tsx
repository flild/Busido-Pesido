import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import { CaseRow } from './CaseRow';

export const dynamic = 'force-dynamic';

export default async function AdminCases() {
  const cases = db.prepare('SELECT * FROM cases ORDER BY sort_order ASC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Кейсы</h1>
        <Link 
          href="/admin/cases/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-matcha to-forest text-white font-bold hover:-translate-y-0.5 transition-transform shadow-[0_10px_20px_rgba(47,63,23,0.15)]"
        >
          <Plus size={18} /> Добавить кейс
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">ID (URL)</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Вкладка / Тема</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Главный заголовок</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">Сортировка</th>
                <th className="p-4 w-[120px] text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-10 text-coal/60 font-medium">Кейсов пока нет</td></tr>
              ) : (
                cases.map(c => <CaseRow key={c.id} c={c} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}