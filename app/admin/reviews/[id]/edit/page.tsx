import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { saveReview } from '../../actions';

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  // Достаем ID из урла (в Next 15 params нужно await-ить)
  const { id } = await params;
  
  // Ищем отзыв в базе
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) as any;
  
  // Если кто-то ввел кривой ID — кидаем на страницу 404
  if (!review) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к отзывам
      </Link>
      
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Редактировать отзыв</h1>

      <form action={saveReview} className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
        {/* Скрытое поле с ID, чтобы action понял, что это обновление, а не создание */}
        <input type="hidden" name="id" value={review.id} />

        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Категория (ID)
            <select name="category" className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" required defaultValue={review.category}>
              <option value="dog">Собаки (dog)</option>
              <option value="cat">Кошки (cat)</option>
              <option value="support">Сопровождение (support)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Тег
            <input name="tag" type="text" required defaultValue={review.tag} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Имя питомца
            <input name="pet_name" type="text" required defaultValue={review.pet_name} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Порода
            <input name="breed" type="text" required defaultValue={review.breed} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Имя автора
            <input name="author" type="text" required defaultValue={review.author} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Формат работы
            <input name="format" type="text" required defaultValue={review.format} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Текст отзыва
          <textarea name="text" rows={5} required defaultValue={review.text} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 resize-none"></textarea>
        </label>

        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            URL изображения
            <input name="image_url" type="text" defaultValue={review.image_url} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Сортировка
            <input name="sort_order" type="number" defaultValue={review.sort_order} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>
        </div>

        <button type="submit" className="mt-4 px-6 py-3 rounded-xl bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform">
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}