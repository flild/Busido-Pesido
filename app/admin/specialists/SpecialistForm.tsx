'use client';

import { useState, useEffect, useTransition } from 'react';
import { saveSpecialist } from './actions';
import { useToast } from '@/components/Toast';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export function SpecialistForm({ initialData = null }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const { say } = useToast();
  
  // Стейт для предпросмотра фотки
  const [preview, setPreview] = useState<string | null>(initialData?.image_url || null);

  // Очищаем объект URL из памяти браузера при размонтировании или смене фото
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Генерим локальную ссылку для предпросмотра
    } else {
      setPreview(initialData?.image_url || null); // Возвращаем старое фото, если отменили выбор
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await saveSpecialist(formData, initialData?.id);
      if (res?.error) say(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col gap-6 max-w-[800px]">
      <div className="bg-white p-8 max-md:p-5 rounded-[24px] border border-forest/15 shadow-sm flex flex-col gap-5">
        
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Имя Фамилия</span>
            <input type="text" name="name" defaultValue={initialData?.name} required placeholder="Ярослава Ковалевская" className="input-base" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Порядковый номер</span>
            <input type="number" name="sort_order" defaultValue={initialData?.sort_order || 0} className="input-base" />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Город (локация)</span>
          <input type="text" name="city" defaultValue={initialData?.city} required placeholder="Москва / Онлайн" className="input-base" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Должность (регалии)</span>
          <input type="text" name="role" defaultValue={initialData?.role} required placeholder="Ветеринарный врач · зоотехник-кинолог..." className="input-base" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Краткое био (для карточек и заголовка)</span>
          <input type="text" name="short_bio" defaultValue={initialData?.short_bio} required placeholder="Я работаю на стыке поведения, здоровья и среды" className="input-base" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest">Полная биография</span>
          <textarea name="full_bio" defaultValue={initialData?.full_bio} required rows={6} className="input-base resize-y" placeholder="Подробный текст о специалисте. Разделяйте абзацы двойным переносом строки." />
        </label>

        {/* Блок загрузки и предпросмотра фото */}
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-forest/10 bg-snow/50 mt-2">
          <span className="text-[12px] font-bold text-coal/60 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} /> Фотография
          </span>
          
          {preview && (
            <div className="flex items-center gap-4 mb-2">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md" 
              />
              <span className="text-sm font-bold text-coal/60">
                {preview.startsWith('blob:') ? 'Новое фото (предпросмотр)' : 'Текущее фото'}
              </span>
            </div>
          )}
          
          <input type="hidden" name="existing_image_url" value={initialData?.image_url || ''} />
          
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            onChange={handleImageChange}
            className="block w-full text-sm text-coal/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-coal hover:file:bg-forest/10 hover:file:text-forest file:transition-colors file:cursor-pointer file:shadow-sm cursor-pointer" 
          />
          <span className="text-[11px] font-medium text-coal/40">
            {initialData?.image_url ? 'Выберите новый файл, чтобы заменить текущее фото.' : 'Загрузите портрет специалиста.'}
          </span>
        </div>

        <label className="flex items-center gap-3 cursor-pointer mt-2 bg-snow p-4 rounded-xl border border-forest/10">
          <input type="checkbox" name="is_main" defaultChecked={initialData?.is_main === 1} className="w-5 h-5 accent-matcha" />
          <div>
            <div className="font-bold text-coal">Выводить на главной странице</div>
            <div className="text-xs text-coal/50">Только один специалист может быть главным. Предыдущий автоматически будет скрыт с главной.</div>
          </div>
        </label>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={isPending} className="button button-primary flex items-center gap-2">
          {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Сохранить специалиста
        </button>
        <Link href="/admin/specialists" className="button button-ghost border border-forest/10 bg-white">
          Отмена
        </Link>
      </div>

      <style jsx>{`
        .input-base {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(48, 64, 28, 0.15);
          background: #fafaf9;
          font-weight: 600;
          color: #1a1a1a;
          transition: all 0.2s;
        }
        .input-base:focus {
          outline: none;
          border-color: rgba(48, 64, 28, 0.4);
          background: white;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
      `}</style>
    </form>
  );
}