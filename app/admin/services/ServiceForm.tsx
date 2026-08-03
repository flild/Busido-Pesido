'use client';
import { useState, useTransition } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { saveService } from './actions';

export default function ServiceForm({ initialData = null }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<[string, string][]>(
    initialData?.steps ? JSON.parse(initialData.steps) : []
  );

  const addStep = () => setSteps([...steps, ['', '']]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, arrIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index][arrIndex] = value;
    setSteps(newSteps);
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
      saveService(formData);
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-8">
      {initialData && <input type="hidden" name="old_id" value={initialData.id} />}
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />

      <div className="bg-white border border-forest/15 rounded-[24px] p-8 max-md:p-5 shadow-sm grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          ID (Уникальный ключ на латинице, например: online)
          <input name="id" type="text" required defaultValue={initialData?.id} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 bg-snow font-mono" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Название формата
          <input name="title" type="text" required defaultValue={initialData?.title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Онлайн-консультация" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цена (Текст с валютой)
          <input name="price" type="text" required defaultValue={initialData?.price} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="22 100 ₽" />
        </label>

        {/* НОВОЕ ПОЛЕ */}
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цена (Число для расчетов в БД)
          <input name="price_int" type="number" required defaultValue={initialData?.price_int || 0} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 font-mono" placeholder="22100" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цветовая тема
          <select name="theme" required defaultValue={initialData?.theme || 'matcha'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 cursor-pointer bg-white">
            <option value="matcha">Matcha (Зеленый)</option>
            <option value="rose">Rose (Красный)</option>
            <option value="caramel">Caramel (Оранжевый)</option>
            <option value="ice">Ice (Синий)</option>
            <option value="berry">Berry (Ягодный)</option>
          </select>
        </label>

        {/* ИСПРАВЛЕН col-span-2 для мобилок */}
        <label className="flex flex-col gap-2 text-sm font-bold text-coal col-span-2 max-md:col-span-1">
          Краткое описание (на карточке)
          <textarea name="description" required defaultValue={initialData?.description} rows={2} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 resize-y" placeholder="Коротко о том, что входит в формат..." />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Бейдж (Тег над карточкой, опционально)
          <input name="tag" type="text" defaultValue={initialData?.tag || ''} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Основной формат" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Ссылка кнопки
          <input name="link" type="text" required defaultValue={initialData?.link || '/booking'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 font-mono text-sm" placeholder="/booking?service=online" />
        </label>

        <label className="flex items-center gap-3 p-4 border border-forest/15 rounded-xl bg-snow/50 cursor-pointer hover:bg-snow transition-colors mt-2 col-span-2 max-md:col-span-1">
          <input type="checkbox" name="is_featured" defaultChecked={initialData?.is_featured === 1} className="w-5 h-5 accent-forest rounded border-forest/20 cursor-pointer" />
          <span className="font-bold text-coal text-sm">Выделить карточку (Featured)</span>
        </label>
        
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Текст кнопки
          <input name="link_text" type="text" required defaultValue={initialData?.link_text || 'Записаться'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Записаться" />
        </label>
      </div>

      {/* Блок Шагов с исправленной мобильной версткой */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 max-md:p-5 shadow-sm">
        <div className="flex max-md:flex-col justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-coal m-0">Детали формата</h2>
          <button type="button" onClick={addStep} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-snow rounded-xl text-sm font-bold hover:bg-forest/10 transition-colors text-forest border border-forest/15 max-md:w-full">
            <Plus size={16} /> Добавить деталь
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex max-md:flex-col items-start md:items-center gap-4 bg-snow/30 p-4 rounded-xl border border-forest/10 group">
              <div className="flex md:flex-col max-md:w-full max-md:justify-between items-center gap-1 md:border-r border-forest/10 md:pr-4 shrink-0 max-md:border-b max-md:pb-3">
                <div className="flex md:flex-col gap-1">
                  <button type="button" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-2 text-coal/40 hover:text-coal disabled:opacity-30 transition-colors bg-white rounded-lg border border-forest/10 shadow-sm"><ArrowUp size={16}/></button>
                  <button type="button" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="p-2 text-coal/40 hover:text-coal disabled:opacity-30 transition-colors bg-white rounded-lg border border-forest/10 shadow-sm"><ArrowDown size={16}/></button>
                </div>
                <button type="button" onClick={() => removeStep(index)} className="md:hidden p-2 text-rose/60 hover:text-white hover:bg-rose rounded-lg border border-rose/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-[1fr_2fr] max-md:grid-cols-1 gap-4 w-full">
                <input type="text" value={step[0]} onChange={(e) => updateStep(index, 0, e.target.value)} placeholder="Заголовок (Кому подходит)" required className="p-3 border border-forest/15 rounded-lg outline-none focus:border-forest/40 bg-white w-full text-sm font-medium" />
                <input type="text" value={step[1]} onChange={(e) => updateStep(index, 1, e.target.value)} placeholder="Описание пункта..." required className="p-3 border border-forest/15 rounded-lg outline-none focus:border-forest/40 bg-white w-full text-sm" />
              </div>
              <button type="button" onClick={() => removeStep(index)} className="max-md:hidden p-3 text-coal/40 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors shrink-0">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {steps.length === 0 && <div className="text-center p-6 text-coal/50">Деталей пока нет.</div>}
        </div>
      </div>

      <button type="submit" disabled={isPending} className="px-8 py-4 rounded-full bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform text-lg self-start max-md:w-full shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
        {isPending ? 'Сохранение...' : 'Сохранить услугу'}
      </button>
    </form>
  );
}