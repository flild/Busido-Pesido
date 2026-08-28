'use client';
import { useState, useTransition, useRef } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ImageIcon, Loader2, Eraser } from 'lucide-react';
import { saveCase } from './actions';
import { uploadImageAction } from '../articles/uploadAction'; // Переиспользуем экшен статей

export default function CaseForm({ initialData = null }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<any[]>(
    initialData?.steps ? JSON.parse(initialData.steps) : []
  );

  // Стейты для загрузки фото
  const [imageBefore, setImageBefore] = useState(initialData?.image_before || '');
  const [imageAfter, setImageAfter] = useState(initialData?.image_after || '');
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Файл слишком тяжелый! Максимум 20 МБ.');
      return;
    }

    const setUploading = type === 'before' ? setIsUploadingBefore : setIsUploadingAfter;
    const setImage = type === 'before' ? setImageBefore : setImageAfter;
    const inputRef = type === 'before' ? beforeRef : afterRef;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadImageAction(fd);
    
    if (res.error) {
      alert(`Ошибка загрузки: ${res.error}`);
    } else if (res.url) {
      setImage(res.url);
    }
    
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const addStep = () => setSteps([...steps, { label: '', headline: '', text: '', highlight: '' }]);
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };
  const removeStep = (index: number) => {
    if (confirm('Точно удалить этот шаг?')) setSteps(steps.filter((_, i) => i !== index));
  };
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      saveCase(formData);
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      {initialData && <input type="hidden" name="old_id" value={initialData.id} />}
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />
      
      {/* Скрытые поля для отправки фото */}
      <input type="hidden" name="image_before" value={imageBefore} />
      <input type="hidden" name="image_after" value={imageAfter} />

      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          ID (Уникальный ключ на латинице)
          <input name="id" type="text" required defaultValue={initialData?.id} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 bg-snow font-mono" placeholder="fear-case-1" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цветовая тема
          <select name="theme" required defaultValue={initialData?.theme || 'matcha'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 cursor-pointer">
            <option value="matcha">Matcha (Зеленый)</option>
            <option value="rose">Rose (Красный)</option>
            <option value="caramel">Caramel (Оранжевый)</option>
            <option value="ice">Ice (Синий)</option>
            <option value="berry">Berry (Ягодный)</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Название вкладки (Короткое)
          <input name="tab_title" type="text" required defaultValue={initialData?.tab_title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Страх улицы" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Сортировка
          <input name="sort_order" type="number" defaultValue={initialData?.sort_order || 0} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal md:col-span-2">
          Главный заголовок кейса
          <input name="main_title" type="text" required defaultValue={initialData?.main_title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 text-lg" placeholder="Отказ выходить на улицу после переезда" />
        </label>
      </div>

      {/* Блок Фото До/После */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm">
        <h2 className="text-xl font-bold text-coal m-0 mb-6">Фотографии До / После (Опционально)</h2>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6">
          
          {/* Фото ДО */}
          <div className="flex flex-col gap-2 font-bold text-coal">
            <span className="text-sm">Ситуация ДО</span>
            {imageBefore ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-forest/15 bg-snow">
                <img src={imageBefore} alt="До" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageBefore('')} className="absolute top-2 right-2 p-2 bg-rose/90 text-white rounded-lg hover:bg-rose transition-colors shadow-sm">
                  <Eraser size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 h-full min-h-[140px] border-2 border-dashed border-forest/20 rounded-xl justify-center bg-snow/50 hover:bg-snow transition-colors">
                <input type="file" ref={beforeRef} onChange={(e) => handleImageUpload(e, 'before')} accept="image/*" className="hidden" />
                <button type="button" onClick={() => beforeRef.current?.click()} disabled={isUploadingBefore} className="flex items-center gap-2 px-5 py-3 bg-white border border-forest/15 text-coal text-sm font-bold rounded-xl shadow-sm hover:border-forest/40 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isUploadingBefore ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                  {isUploadingBefore ? 'Загрузка...' : 'Загрузить фото ДО'}
                </button>
              </div>
            )}
          </div>

          {/* Фото ПОСЛЕ */}
          <div className="flex flex-col gap-2 font-bold text-coal">
            <span className="text-sm">Результат ПОСЛЕ</span>
            {imageAfter ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-forest/15 bg-snow">
                <img src={imageAfter} alt="После" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageAfter('')} className="absolute top-2 right-2 p-2 bg-rose/90 text-white rounded-lg hover:bg-rose transition-colors shadow-sm">
                  <Eraser size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 h-full min-h-[140px] border-2 border-dashed border-forest/20 rounded-xl justify-center bg-snow/50 hover:bg-snow transition-colors">
                <input type="file" ref={afterRef} onChange={(e) => handleImageUpload(e, 'after')} accept="image/*" className="hidden" />
                <button type="button" onClick={() => afterRef.current?.click()} disabled={isUploadingAfter} className="flex items-center gap-2 px-5 py-3 bg-white border border-forest/15 text-coal text-sm font-bold rounded-xl shadow-sm hover:border-forest/40 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isUploadingAfter ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                  {isUploadingAfter ? 'Загрузка...' : 'Загрузить фото ПОСЛЕ'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Блок Шагов */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-coal m-0">Шаги кейса ({steps.length})</h2>
          <button type="button" onClick={addStep} className="inline-flex items-center gap-2 px-4 py-2 bg-snow rounded-xl text-sm font-bold hover:bg-forest/10 transition-colors text-forest border border-forest/15">
            <Plus size={16} /> Добавить шаг
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className="p-6 border border-forest/15 rounded-[20px] bg-snow/30 relative flex gap-4 group transition-colors hover:border-forest/30">
              
              <div className="flex flex-col items-center gap-2 border-r border-forest/10 pr-4 shrink-0">
                <span className="text-xs font-black text-coal/30 uppercase tracking-widest mb-2">#{index + 1}</span>
                <button type="button" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-1.5 text-coal/40 hover:text-coal hover:bg-white rounded-lg disabled:opacity-30 transition-colors">
                  <ArrowUp size={16} />
                </button>
                <button type="button" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="p-1.5 text-coal/40 hover:text-coal hover:bg-white rounded-lg disabled:opacity-30 transition-colors">
                  <ArrowDown size={16} />
                </button>
                <button type="button" onClick={() => removeStep(index)} className="p-1.5 text-coal/40 hover:text-rose hover:bg-rose/10 rounded-lg mt-auto transition-colors" title="Удалить шаг">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                    Лейбл (на таймлайне)
                    <input type="text" value={step.label} onChange={(e) => updateStep(index, 'label', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-white" placeholder="Анамнез" />
                  </label>
                  <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                    Заголовок шага
                    <input type="text" value={step.headline} onChange={(e) => updateStep(index, 'headline', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-white" placeholder="Сбор данных" />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                  Основной текст
                  <textarea value={step.text} onChange={(e) => updateStep(index, 'text', e.target.value)} required rows={4} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-white resize-y" placeholder="Описание этапа..." />
                </label>

                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                  Акцент / Вывод (опционально)
                  <input type="text" value={step.highlight || ''} onChange={(e) => updateStep(index, 'highlight', e.target.value)} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-white" placeholder="На что обратить внимание" />
                </label>
              </div>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="text-center p-10 border border-dashed border-forest/30 rounded-[20px] text-coal/50 font-medium">
              Нет ни одного шага. Нажмите «Добавить шаг», чтобы начать.
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="px-8 py-4 rounded-full bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform text-lg self-start shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isPending ? 'Сохранение...' : 'Сохранить кейс'}
      </button>
    </form>
  );
}