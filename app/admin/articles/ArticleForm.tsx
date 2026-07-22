'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import Link from 'next/link';
import { saveArticle } from './actions';
import { uploadImageAction } from './uploadAction';
import { Eye, Calendar, AlertCircle, Image as ImageIcon, Loader2, Eraser, UploadCloud } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const generateSlug = (text: string) => {
  const cyrillic = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya', ' ': '-', '_': '-', ',': '', '.': '', '?': '', '!': '', ':': ''
  };
  return text.toLowerCase().split('').map(char => cyrillic[char as keyof typeof cyrillic] || char)
    .join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

export function ArticleForm({ initialData }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Стейты формы
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isSlugEdited, setIsSlugEdited] = useState(!!initialData?.slug);
  
  // Галерея: при загрузке вытаскиваем все уникальные картинки прямо из Markdown-текста
  const [gallery, setGallery] = useState<string[]>(() => {
    if (!initialData?.content) return [];
    // Регулярка ищет паттерн ![что-угодно](url_картинки)
    const regex = /!\[.*?\]\((.*?)\)/g;
    const matches = Array.from(initialData.content.matchAll(regex));
    // Собираем все найденные URL и убираем дубликаты через Set
    return Array.from(new Set(matches.map((m: any) => m[1])));
  });
  
  // UI Стейты
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Для Drag & Drop
  const [draftData, setDraftData] = useState<any>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DRAFT_KEY = initialData?.id ? `draft_article_${initialData.id}` : 'draft_article_new';

  // 1. Загрузка черновика (теперь с галереей)
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const initialContentLength = initialData?.content?.length || 0;
          if (parsed.content && parsed.content.length > initialContentLength) {
            setDraftData(parsed);
          }
        } catch (e) {
          console.error('Ошибка парсинга черновика');
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [DRAFT_KEY, initialData]);

  // 2. Тихое автосохранение
  useEffect(() => {
    if (draftData) return; 

    const timer = setTimeout(() => {
      if (title || content || summary || gallery.length > 0) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, slug, summary, content, gallery }));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, slug, summary, content, gallery, DRAFT_KEY, draftData]);

  // Действия с черновиком
  const restoreDraft = () => {
    setTitle(draftData.title || '');
    setSlug(draftData.slug || '');
    setSummary(draftData.summary || '');
    setContent(draftData.content || '');
    setGallery(draftData.gallery || []);
    setIsSlugEdited(true);
    setDraftData(null);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftData(null);
  };

  const clearCurrentDraft = () => {
    if (confirm('Точно очистить всё? Это удалит написанный текст.')) {
      localStorage.removeItem(DRAFT_KEY);
      setTitle('');
      setSlug('');
      setSummary('');
      setContent('');
      setGallery([]);
      setIsSlugEdited(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!isSlugEdited) setSlug(generateSlug(e.target.value));
  };

  // --- ЛОГИКА ЗАГРУЗКИ КАРТИНОК И ВСТАВКИ ---

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    
    setContent(newContent);
    
    // Небольшой таймаут, чтобы React успел обновить value, прежде чем мы вернем фокус
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  // Процессор файлов (умеет загружать пачками)
  const processFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    // ВАЛИДАЦИЯ ВЕСА (например, лимит 20 МБ на файл)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; 
    const validFiles = [];
    
    for (const file of imageFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Файл ${file.name} слишком большой! Максимум 20 МБ.`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    // Отправляем только прошедшие валидацию файлы
    await Promise.all(
      validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadImageAction(formData);
        
        if (res.error) {
          alert(`Ошибка загрузки ${file.name}: ${res.error}`);
        } else if (res.url) {
          uploadedUrls.push(res.url);
        }
      })
    );

    if (uploadedUrls.length > 0) {
      setGallery(prev => [...prev, ...uploadedUrls]);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Обработчики Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Обычный инпут
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  // --- СОХРАНЕНИЕ ---

  const formAction = (formData: FormData) => {
    setError(null);
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('summary', summary);
    formData.set('content', content);

    startTransition(async () => {
      const res = await saveArticle(initialData?.id || null, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        localStorage.removeItem(DRAFT_KEY);
      }
    });
  };

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-coal m-0 mb-3">
            {initialData ? 'Редактирование статьи' : 'Новая статья'}
          </h1>
          {initialData && (
            <div className="flex items-center gap-4 text-sm font-bold text-coal/50">
              <span className="flex items-center gap-1.5"><Calendar size={16}/> {new Date(initialData.created_at).toLocaleDateString('ru-RU')}</span>
              <span className="flex items-center gap-1.5"><Eye size={16}/> {initialData.views || 0} просмотров</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {!initialData && (
            <button type="button" onClick={clearCurrentDraft} className="px-5 py-2.5 rounded-full border border-rose/20 text-rose font-bold hover:bg-rose/5 transition-colors shadow-sm flex items-center gap-2">
              <Eraser size={16} /> Очистить
            </button>
          )}
          <Link href="/admin/articles" className="px-5 py-2.5 rounded-full border border-forest/15 bg-white text-coal font-bold hover:bg-snow transition-colors shadow-sm">
            Отмена
          </Link>
        </div>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 max-md:p-5 shadow-sm relative">
        
        {draftData && (
          <div className="flex items-center justify-between p-5 mb-6 rounded-2xl bg-caramel/10 border border-caramel/20 max-md:flex-col max-md:items-start max-md:gap-4">
            <div className="flex items-center gap-3 text-coal font-bold">
              <AlertCircle size={22} className="text-caramel shrink-0" />
              <p className="m-0">У вас есть несохраненный черновик этой статьи.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={restoreDraft} className="px-4 py-2 bg-caramel text-white font-bold rounded-xl hover:bg-caramel/90 transition-colors text-sm">
                Восстановить текст
              </button>
              <button type="button" onClick={discardDraft} className="px-4 py-2 bg-white border border-caramel/20 text-coal font-bold rounded-xl hover:bg-snow transition-colors text-sm">
                Удалить
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-rose/10 border border-rose/20 text-rose font-medium">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="m-0">{error}</p>
          </div>
        )}
        
        <form action={formAction} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 font-bold text-coal">
            <span>Заголовок <span className="text-rose">*</span></span>
            <input type="text" required value={title} onChange={handleTitleChange} placeholder="Как отучить собаку тянуть поводок" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
          </label>
          
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6">
            <label className="flex flex-col gap-2 font-bold text-coal">
              <span>Slug (URL) <span className="text-rose">*</span></span>
              <input type="text" required value={slug} onChange={(e) => { setSlug(e.target.value); setIsSlugEdited(true); }} placeholder="kak-otuchit-sobaku" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
            </label>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
              <label className="flex flex-col gap-2 font-bold text-coal">
                <span>Категория <span className="text-rose">*</span></span>
                <input type="text" name="category" list="category-suggestions" required defaultValue={initialData?.category || ''} placeholder="Например: dogs" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
                <datalist id="category-suggestions">
                  <option value="free dogs">Собаки (Бесплатно)</option>
                  <option value="subscription dogs">Собаки (По подписке)</option>
                  <option value="free cats">Кошки (Бесплатно)</option>
                  <option value="subscription cats">Кошки (По подписке)</option>
                  <option value="free professionals">Специалистам</option>
                </datalist>
              </label>

              <label className="flex flex-col gap-2 font-bold text-coal">
                <span>Статус <span className="text-rose">*</span></span>
                <select name="status" defaultValue={initialData?.status || 'published'} className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors cursor-pointer">
                  <option value="published">Опубликована</option>
                  <option value="draft">Черновик</option>
                </select>
              </label>
            </div>
          </div>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            <span>Тег (на карточке) <span className="text-rose">*</span></span>
            <input type="text" name="tag" required defaultValue={initialData?.tag} placeholder="Собаки · обучение" className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors" />
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-coal">
            <span>Краткое описание (summary) <span className="text-rose">*</span></span>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} required placeholder="Короткий текст для карточки и SEO..." className="p-4 border border-forest/15 rounded-xl bg-snow font-medium text-coal outline-none focus:border-forest/40 transition-colors resize-y" />
          </label>
          
          {/* БЛОК РЕДАКТОРА СТАТЬИ С D&D */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center justify-between border-b border-forest/15 pb-2">
              <span className="font-bold text-coal">Текст статьи <span className="text-rose">*</span></span>
              <div className="flex bg-snow rounded-lg p-1 border border-forest/5">
                <button type="button" onClick={() => setIsPreview(false)} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${!isPreview ? 'bg-white text-coal shadow-sm' : 'text-coal/60 hover:text-coal'}`}>
                  Писать
                </button>
                <button type="button" onClick={() => setIsPreview(true)} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${isPreview ? 'bg-white text-coal shadow-sm' : 'text-coal/60 hover:text-coal'}`}>
                  Превью
                </button>
              </div>
            </div>

            {!isPreview ? (
              <>
                <div 
                  className={`relative transition-colors duration-200 rounded-xl overflow-hidden ${
                    isDragging ? 'ring-2 ring-forest bg-forest/5' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <textarea 
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={16} 
                    required 
                    placeholder="# Заголовок уровня 1&#10;Можно перетащить картинки прямо сюда..." 
                    className="w-full p-4 border border-forest/15 rounded-xl bg-snow font-mono text-[14px] text-coal outline-none focus:border-forest/40 transition-colors resize-y pb-16 relative z-10" 
                  />
                  
                  {/* Оверлей при Drag&Drop */}
                  {isDragging && (
                    <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm border-2 border-dashed border-forest flex flex-col items-center justify-center text-forest rounded-xl pointer-events-none">
                      <UploadCloud size={48} className="mb-2 animate-bounce" />
                      <span className="font-bold text-lg">Бросай картинки сюда</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-forest/10 shadow-sm">
                    <div className="text-xs font-bold text-forest bg-forest/10 px-3 py-1.5 rounded-md">
                      Markdown поддерживается
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" multiple className="hidden" />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-coal text-white text-sm font-bold rounded-lg hover:bg-coal/80 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                      {isUploading ? 'Загружаем...' : 'Загрузить фото'}
                    </button>
                  </div>
                </div>

                {/* ГАЛЕРЕЯ ЗАГРУЖЕННЫХ КАРТИНОК */}
                {gallery.length > 0 && (
                  <div className="mt-2 p-4 border border-forest/15 rounded-xl bg-snow/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-coal/80">Галерея сессии</h4>
                      <span className="text-xs text-coal/50">Кликни на картинку для вставки в текст</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {gallery.map((url, i) => (
                        <div 
                          key={i} 
                          className="group relative aspect-square rounded-lg border border-forest/10 overflow-hidden cursor-pointer hover:border-forest transition-colors shadow-sm bg-white"
                          // Важнейший момент: onMouseDown + preventDefault предотвращает blur у textarea
                          onMouseDown={(e) => {
                            e.preventDefault(); 
                            insertTextAtCursor(`\n![Описание](${url})\n`);
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-coal/0 group-hover:bg-coal/40 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 text-white font-bold text-[10px] uppercase tracking-wider bg-coal/80 px-2 py-1 rounded">Вставить</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="min-h-[400px] p-6 border border-forest/15 rounded-xl bg-white text-[17px] leading-[1.8] text-coal/90 
                [&>p]:mb-6 
                [&>h2]:text-[32px] [&>h2]:font-bold [&>h2]:text-coal [&>h2]:mt-10 [&>h2]:mb-6 
                [&>h3]:text-[24px] [&>h3]:font-bold [&>h3]:text-coal [&>h3]:mt-8 [&>h3]:mb-4 
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-2 
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-2 
                [&_a]:text-forest [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4
                [&_blockquote]:border-l-4 [&_blockquote]:border-matcha [&_blockquote]:bg-matcha/5 [&_blockquote]:p-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:my-8 
                [&_img]:rounded-2xl [&_img]:my-10 [&_img]:shadow-md [&_img]:w-full [&_img]:object-cover"
              >
                {content ? <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown> : <span className="text-coal/40 italic">Здесь пока пусто...</span>}
              </div>
            )}
          </div>
          
          <label className="flex items-center gap-3 p-4 border border-forest/15 rounded-xl bg-snow/50 cursor-pointer hover:bg-snow transition-colors mt-4">
            <input type="checkbox" name="is_premium" defaultChecked={initialData?.is_premium === 1} className="w-5 h-5 accent-forest rounded border-forest/20 cursor-pointer" />
            <span className="font-bold text-coal">
              Сделать статью платной (Premium)
              <span className="block text-[13px] font-normal text-coal/60 mt-0.5">Контент будет размыт, появится иконка подписки</span>
            </span>
          </label>

          <div className="pt-4 border-t border-forest/10 mt-2">
            <button 
              type="submit" 
              disabled={isPending} 
              className="inline-flex items-center justify-center min-h-[54px] px-10 rounded-full font-bold text-white bg-gradient-to-br from-matcha to-forest hover:-translate-y-0.5 transition-transform shadow-[0_14px_34px_rgba(47,63,23,0.24)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-lg"
            >
              {isPending ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Опубликовать')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}