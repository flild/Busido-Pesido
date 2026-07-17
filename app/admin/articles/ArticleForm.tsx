'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { saveArticle } from './actions';

interface ArticleFormProps {
  initialData?: any;
}

export function ArticleForm({ initialData }: ArticleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Используем нативный action из React 18/19 для отправки FormData
  const formAction = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      // Передаем ID, если это редактирование, или null для новой
      const res = await saveArticle(initialData?.id || null, formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">
          {initialData ? 'Редактирование статьи' : 'Новая статья'}
        </h1>
        <Link href="/admin/articles" className="px-5 py-2.5 rounded-full border border-forest/15 bg-white text-coal font-bold hover:bg-snow transition-colors shadow-sm">
          Отмена
        </Link>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 max-md:p-5 shadow-sm">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-rose/10 border border-rose/20 text-rose font-medium">
            {error}
          </div>
        )}
        
        <form action={formAction} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 font-bold text-coal">
            Заголовок
            <input type="text" name="title" required defaultValue={initialData?.title} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
          </label>
          
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6">
            <label className="flex flex-col gap-2 font-bold text-coal">
              Slug (URL)
              <input type="text" name="slug" required defaultValue={initialData?.slug} placeholder="my-article-url" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
            </label>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
              <label className="flex flex-col gap-2 font-bold text-coal">
                Категория
                <select name="category" defaultValue={initialData?.category || 'dogs'} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors cursor-pointer">
                  <option value="dogs">Собаки</option>
                  <option value="cats">Кошки</option>
                  <option value="health">Здоровье</option>
                  <option value="learning">Обучение</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 font-bold text-coal">
                Статус
                <select name="status" defaultValue={initialData?.status || 'published'} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors cursor-pointer">
                  <option value="published">Опубликована</option>
                  <option value="draft">Черновик</option>
                </select>
              </label>
            </div>
          </div>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Тег (отображаемый на карточке)
            <input type="text" name="tag" required defaultValue={initialData?.tag} placeholder="Собаки · обучение" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Краткое описание
            <textarea name="summary" rows={3} required defaultValue={initialData?.summary} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors resize-y" />
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Текст статьи (Markdown/HTML)
            <textarea name="content" rows={12} required defaultValue={initialData?.content} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors font-mono text-sm resize-y" />
          </label>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isPending} 
              className="inline-flex items-center justify-center min-h-[50px] px-8 rounded-full font-bold text-white bg-gradient-to-br from-matcha to-forest hover:-translate-y-0.5 transition-transform shadow-[0_14px_34px_rgba(47,63,23,0.24)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Опубликовать')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}