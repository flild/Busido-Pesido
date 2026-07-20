// app/admin/reviews/new/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { saveReview } from '../actions';

export default function NewReviewPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к отзывам
      </Link>
      
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Новый отзыв</h1>

      <form action={saveReview} className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Категория (ID)
            <select name="category" className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" required defaultValue="dog">
              <option value="dog">Собаки (dog)</option>
              <option value="cat">Кошки (cat)</option>
              <option value="support">Сопровождение (support)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Тег (Например: Собака · Реактивность)
            <input name="tag" type="text" required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Имя питомца
            <input name="pet_name" type="text" required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Порода
            <input name="breed" type="text" required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Имя автора
            <input name="author" type="text" required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Формат работы
            <input name="format" type="text" required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Онлайн-консультация" />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Текст отзыва
          <textarea name="text" rows={5} required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 resize-none"></textarea>
        </label>

        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            URL изображения
            <input name="image_url" type="text" className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="/reviews/placeholder-dog.png" />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-coal">
            Сортировка (меньше - раньше)
            <input name="sort_order" type="number" defaultValue="0" className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
          </label>
        </div>

        <button type="submit" className="mt-4 px-6 py-3 rounded-xl bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform">
          Сохранить отзыв
        </button>
      </form>
    </div>
  );
}