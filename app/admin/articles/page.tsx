import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { db } from '@/lib/db';
import { DeleteButton } from './DeleteButton';

// Next.js выполнит этот компонент на сервере
export default async function AdminArticles() {
  const articles = db.prepare('SELECT id, title, category, tag, status, created_at FROM articles ORDER BY created_at DESC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Статьи</h1>
        <Link 
          href="/admin/articles/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-matcha to-forest text-white font-bold hover:-translate-y-0.5 transition-transform shadow-[0_10px_20px_rgba(47,63,23,0.15)]"
        >
          <Plus size={18} /> Написать статью
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Дата</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Заголовок</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Категория / Тег</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Статус</th>
                <th className="p-4 w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-coal/60 font-medium">
                    Статей пока нет
                  </td>
                </tr>
              ) : (
                articles.map(art => (
                  <tr key={art.id} className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
                    <td className="p-4 text-coal font-medium">{art.id}</td>
                    <td className="p-4 text-coal">{new Date(art.created_at).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4"><strong className="text-coal font-bold">{art.title}</strong></td>
                    <td className="p-4 text-coal">
                      <span className="block">{art.category}</span>
                      <small className="text-coal/60 font-medium">{art.tag}</small>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${art.status === 'draft' ? 'bg-fog text-coal' : 'bg-matcha/10 text-forest'}`}>
                        {art.status === 'draft' ? 'Черновик' : 'Опубликована'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 justify-end">
                        <Link 
                          href={`/admin/articles/${art.id}/edit`} 
                          className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors" 
                          title="Редактировать"
                        >
                          <Pencil size={18} />
                        </Link>
                        {/* Клиентская кнопка */}
                        <DeleteButton id={art.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}