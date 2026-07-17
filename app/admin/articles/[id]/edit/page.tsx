'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'dogs',
    tag: '',
    status: 'published'
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Ошибка загрузки данных статьи');
        }
        return res.json();
      })
      .then(data => {
        setForm(data);
        setFetching(false);
      })
      .catch(err => {
        setFetchError(err.message);
        setFetching(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при сохранении изменений');
      }
      
      router.push('/admin/articles');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-forest font-bold animate-pulse">Загрузка статьи...</div>;
  if (fetchError) return <div className="p-6 rounded-xl bg-rose/10 border border-rose/20 text-rose font-medium m-10">{fetchError}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Редактирование статьи</h1>
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
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 font-bold text-coal">
            Заголовок
            <input 
              type="text" 
              required 
              value={form.title || ''} 
              onChange={e => setForm({...form, title: e.target.value})} 
              className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors"
            />
          </label>
          
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6">
            <label className="flex flex-col gap-2 font-bold text-coal">
              Slug (URL)
              <input 
                type="text" 
                required 
                value={form.slug || ''} 
                onChange={e => setForm({...form, slug: e.target.value})} 
                placeholder="my-article-url" 
                className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors"
              />
            </label>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
              <label className="flex flex-col gap-2 font-bold text-coal">
                Категория
                <select 
                  value={form.category || 'dogs'} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors cursor-pointer"
                >
                  <option value="dogs">Собаки</option>
                  <option value="cats">Кошки</option>
                  <option value="health">Здоровье</option>
                  <option value="learning">Обучение</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 font-bold text-coal">
                Статус
                <select 
                  value={form.status || 'published'} 
                  onChange={e => setForm({...form, status: e.target.value})} 
                  className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors cursor-pointer"
                >
                  <option value="published">Опубликована</option>
                  <option value="draft">Черновик</option>
                </select>
              </label>
            </div>
          </div>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Тег (отображаемый на карточке)
            <input 
              type="text" 
              required 
              value={form.tag || ''} 
              onChange={e => setForm({...form, tag: e.target.value})} 
              placeholder="Собаки · обучение" 
              className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors"
            />
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Краткое описание
            <textarea 
              rows={3} 
              required 
              value={form.summary || ''} 
              onChange={e => setForm({...form, summary: e.target.value})}
              className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors resize-y"
            ></textarea>
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            Текст статьи (Markdown)
            <textarea 
              rows={12} 
              required 
              value={form.content || ''} 
              onChange={e => setForm({...form, content: e.target.value})}
              className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors font-mono text-sm resize-y"
            ></textarea>
          </label>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex items-center justify-center min-h-[50px] px-8 rounded-full font-bold text-white bg-gradient-to-br from-matcha to-forest hover:-translate-y-0.5 transition-transform shadow-[0_14px_34px_rgba(47,63,23,0.24)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}