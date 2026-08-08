import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Eye, ExternalLink, BookOpen, ThumbsUp, ThumbsDown, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/db';
import { DeleteButton } from './DeleteButton';
import { deleteArticle } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminArticles() {

  // Расширили SQL-запрос новыми колонками
  const articles = db.prepare('SELECT id, title, slug, category, tag, status, views, is_premium, created_at, main_image, reads_count, likes, dislikes FROM articles ORDER BY created_at DESC').all() as any[];

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
          {/* Немного увеличили min-w, чтобы метрики не сжимались */}
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[60px]">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Заголовок и обложка</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Категория / Тег</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider text-center">Метрики</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider text-center">Статус</th>
                <th className="p-4 w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-coal/60 font-medium">Статей пока нет</td>
                </tr>
              ) : (
                articles.map(art => (
                  <tr key={art.id} className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
                    <td className="p-4 text-coal font-medium">{art.id}</td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Блок миниатюры */}
                        <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-forest/10 overflow-hidden relative shadow-sm">
                          {art.main_image ? (
                            <Image 
                              src={art.main_image} 
                              alt={art.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-snow text-coal/20">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        
                        {/* Текстовая часть */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {art.is_premium === 1 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-forest text-white">
                                Pro
                              </span>
                            )}
                            <strong className="text-coal font-bold line-clamp-2" title={art.title}>
                              {art.title}
                            </strong>
                          </div>
                          <div className="text-[12px] font-medium text-coal/50">
                            {new Date(art.created_at).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4 text-coal">
                      <span className="block text-sm font-medium">{art.category}</span>
                      <small className="text-coal/50 font-medium">{art.tag}</small>
                    </td>
                    
                    <td className="p-4 text-center">
                      {/* Компактный блок метрик */}
                      <div className="inline-flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-3 text-[13px] font-bold text-coal/80">
                          <span className="flex items-center gap-1.5" title="Просмотры">
                            <Eye size={14} className="text-coal/40" /> {art.views || 0}
                          </span>
                          <span className="flex items-center gap-1.5" title="Дочитывания">
                            <BookOpen size={14} className="text-coal/40" /> {art.reads_count || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-[13px] font-bold">
                          <span className="flex items-center gap-1.5 text-matcha" title="Считают полезным">
                            <ThumbsUp size={14} /> {art.likes || 0}
                          </span>
                          <span className="flex items-center gap-1.5 text-rose/80" title="Не полезно">
                            <ThumbsDown size={14} /> {art.dislikes || 0}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${art.status === 'draft' ? 'bg-fog text-coal' : 'bg-matcha/10 text-forest'}`}>
                        {art.status === 'draft' ? 'Черновик' : 'Опубликована'}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex gap-1 justify-end">
                        <Link href={`/blog/${art.slug}`} target="_blank" className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-matcha transition-colors" title="Смотреть на сайте">
                          <ExternalLink size={18} />
                        </Link>
                        <Link href={`/admin/articles/${art.slug}/edit`} className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors" title="Редактировать">
                          <Pencil size={18} />
                        </Link>
                        <form action={deleteArticle}>
                          <input type="hidden" name="id" value={art.id} />
                          <DeleteButton />
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