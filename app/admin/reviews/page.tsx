// app/admin/reviews/page.tsx
import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteReview } from './actions';

export default async function AdminReviews() {
  const reviews = db.prepare('SELECT * FROM reviews ORDER BY sort_order ASC, id DESC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Отзывы</h1>
        <Link 
          href="/admin/reviews/new" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-matcha to-forest text-white font-bold hover:-translate-y-0.5 transition-transform shadow-[0_10px_20px_rgba(47,63,23,0.15)]"
        >
          <Plus size={18} /> Добавить отзыв
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Питомец</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Текст</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Автор / Формат</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Сортировка</th>
                <th className="p-4 w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-coal/60 font-medium">Отзывов пока нет</td>
                </tr>
              ) : (
                reviews.map(rev => (
                  <tr key={rev.id} className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
                    <td className="p-4 text-coal font-medium">{rev.id}</td>
                    <td className="p-4 text-coal">
                      <strong className="block font-bold">{rev.pet_name}</strong>
                      <small className="text-coal/60">{rev.breed}</small>
                    </td>
                    <td className="p-4 text-coal/80 text-sm max-w-[300px] truncate" title={rev.text}>
                      {rev.text}
                    </td>
                    <td className="p-4 text-coal">
                      <span className="block">{rev.author}</span>
                      <small className="text-coal/60">{rev.format}</small>
                    </td>
                    <td className="p-4 text-coal font-medium">{rev.sort_order}</td>
                    <td className="p-4">
                      <div className="flex gap-1 justify-end">
                        <Link 
                          href={`/admin/reviews/${rev.id}/edit`} 
                          className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors"
                        >
                          <Pencil size={18} />
                        </Link>
                        <form action={deleteReview}>
                          <input type="hidden" name="id" value={rev.id} />
                          <button 
                            type="submit"
                            className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors cursor-pointer border-none bg-transparent"
                            // Хак для конфирма без useState
                            onClick={(e) => !confirm('Удалить отзыв?') && e.preventDefault()}
                          >
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
      </div>
    </>
  );
}