// app/admin/cases/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteCase } from './actions';

export default async function AdminCases() {
  const cases = db.prepare('SELECT * FROM cases ORDER BY sort_order ASC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Кейсы</h1>
        <Link 
          href="/admin/cases/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-matcha to-forest text-white font-bold hover:-translate-y-0.5 transition-transform"
        >
          <Plus size={18} /> Добавить кейс
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-snow border-b border-forest/15">
              <th className="p-4 text-[13px] font-bold text-coal/60 uppercase">ID</th>
              <th className="p-4 text-[13px] font-bold text-coal/60 uppercase">Вкладка</th>
              <th className="p-4 text-[13px] font-bold text-coal/60 uppercase">Заголовок</th>
              <th className="p-4 text-[13px] font-bold text-coal/60 uppercase">Сортировка</th>
              <th className="p-4 w-[100px]"></th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-10 text-coal/60">Кейсов пока нет</td></tr>
            ) : (
              cases.map(c => (
                <tr key={c.id} className="border-b border-forest/5 hover:bg-snow/50">
                  <td className="p-4 font-bold text-coal">{c.id}</td>
                  <td className="p-4">
                    <span className="block font-bold text-coal">{c.tab_title}</span>
                    <small className="text-coal/50">Тема: {c.theme}</small>
                  </td>
                  <td className="p-4 text-coal text-sm max-w-[300px] truncate">{c.main_title}</td>
                  <td className="p-4 text-coal">{c.sort_order}</td>
                  <td className="p-4">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/admin/cases/${c.id}/edit`} className="p-2 text-coal/60 hover:text-forest">
                        <Pencil size={18} />
                      </Link>
                      <form action={deleteCase}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="p-2 text-coal/60 hover:text-rose cursor-pointer border-none bg-transparent" onClick={(e) => !confirm('Точно снести?') && e.preventDefault()}>
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}