import Link from 'next/link';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import { ReviewRow } from './ReviewRow';

export const dynamic = 'force-dynamic';

export default async function AdminReviews({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const currentCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : 'all';

  // Динамический SQL-запрос для фильтрации
  let query = 'SELECT * FROM reviews';
  const queryParams: any[] = [];
  
  if (currentCategory !== 'all') {
    query += ' WHERE category = ?';
    queryParams.push(currentCategory);
  }
  
  query += ' ORDER BY sort_order ASC, id DESC';
  const reviews = db.prepare(query).all(...queryParams) as any[];

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'dog', label: 'Собаки' },
    { id: 'cat', label: 'Кошки' },
    { id: 'support', label: 'Сопровождение' },
  ];

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
      
      {/* Табы фильтрации */}
      <div className="flex bg-white rounded-xl p-1 border border-forest/15 shadow-sm overflow-x-auto max-w-min mb-6">
        {filters.map(f => (
          <Link
            key={f.id}
            href={`/admin/reviews?category=${f.id}`}
            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
              currentCategory === f.id 
                ? 'bg-forest/10 text-forest' 
                : 'text-coal/60 hover:text-coal hover:bg-snow'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[60px]">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[220px]">Питомец</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Текст</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[180px]">Автор / Формат</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">Сортировка</th>
                <th className="p-4 w-[140px] text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-coal/60 font-medium">В этой категории нет отзывов</td>
                </tr>
              ) : (
                reviews.map(rev => <ReviewRow key={rev.id} rev={rev} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}