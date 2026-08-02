import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Star } from 'lucide-react';
import { DeleteButton } from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function SpecialistsAdminPage() {
  const specialists = db.prepare('SELECT * FROM specialists ORDER BY sort_order ASC').all() as any[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-forest/15 shadow-sm">
        <div>
          <h1 className="text-[28px] font-bold text-coal m-0">Специалисты</h1>
          <p className="text-coal/60 mt-1">Управление командой и отображением на главной</p>
        </div>
        <Link href="/admin/specialists/new" className="button button-primary flex items-center gap-2 px-6">
          <Plus size={18} /> Добавить
        </Link>
      </div>

      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        {specialists.length === 0 ? (
          <div className="p-10 text-center text-coal/50">Список специалистов пуст.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-snow/50 border-b border-forest/10">
                <tr>
                  <th className="p-4 text-xs font-bold text-coal/50 uppercase tracking-widest w-16">Сорт.</th>
                  <th className="p-4 text-xs font-bold text-coal/50 uppercase tracking-widest">Специалист</th>
                  <th className="p-4 text-xs font-bold text-coal/50 uppercase tracking-widest">Кратко</th>
                  <th className="p-4 text-xs font-bold text-coal/50 uppercase tracking-widest text-center w-24">Статус</th>
                  <th className="p-4 text-xs font-bold text-coal/50 uppercase tracking-widest text-right w-24">Действия</th>
                </tr>
              </thead>
              <tbody>
                {specialists.map((spec) => (
                  <tr key={spec.id} className="border-b border-forest/5 hover:bg-snow/30 transition-colors">
                    <td className="p-4 font-black text-coal/30">{spec.sort_order}</td>
                    <td className="p-4">
                      <div className="font-bold text-coal text-[15px]">{spec.name}</div>
                      <div className="text-[12px] font-bold text-matcha mt-0.5 truncate max-w-[250px]">{spec.role}</div>
                    </td>
                    <td className="p-4 text-sm text-coal/70 truncate max-w-[300px]" title={spec.short_bio}>
                      {spec.short_bio}
                    </td>
                    <td className="p-4 text-center">
                      {spec.is_main === 1 && (
                        <span className="inline-flex items-center gap-1 bg-caramel/15 text-caramel px-2 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                          <Star size={12} /> Основатель
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link 
                          href={`/admin/specialists/${spec.id}/edit`}
                          className="p-2 text-coal/40 hover:text-forest hover:bg-forest/10 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit size={18} />
                        </Link>
                        <DeleteButton id={spec.id} name={spec.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}