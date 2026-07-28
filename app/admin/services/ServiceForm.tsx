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

      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          ID (Уникальный ключ на латинице, например: online)
          <input name="id" type="text" required defaultValue={initialData?.id} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 bg-snow font-mono" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Название формата
          <input name="title" type="text" required defaultValue={initialData?.title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Онлайн-консультация" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цена (с валютой)
          <input name="price" type="text" required defaultValue={initialData?.price} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="6 000 ₽" />
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

        <label className="flex flex-col gap-2 text-sm font-bold text-coal col-span-2">
          Краткое описание (на карточке)
          <textarea name="description" required defaultValue={initialData?.description} rows={2} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 resize-y" placeholder="Коротко о том, что входит в формат..." />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Бейдж (Тег над карточкой, опционально)
          <input name="tag" type="text" defaultValue={initialData?.tag || ''} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Основной формат" />
        </label>

        <label className="flex items-center gap-3 p-4 border border-forest/15 rounded-xl bg-snow/50 cursor-pointer hover:bg-snow transition-colors mt-6">
          <input type="checkbox" name="is_featured" defaultChecked={initialData?.is_featured === 1} className="w-5 h-5 accent-forest rounded border-forest/20 cursor-pointer" />
          <span className="font-bold text-coal text-sm">Выделить карточку (Featured)</span>
        </label>
        
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Ссылка кнопки
          <input name="link" type="text" required defaultValue={initialData?.link || '/booking'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50 font-mono text-sm" placeholder="/booking?service=online" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Текст кнопки
          <input name="link_text" type="text" required defaultValue={initialData?.link_text || 'Записаться'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" placeholder="Записаться" />
        </label>
      </div>

      {/* Блок Шагов */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-coal m-0">Детали формата (Шаги внутри карточки)</h2>
          <button type="button" onClick={addStep} className="inline-flex items-center gap-2 px-4 py-2 bg-snow rounded-xl text-sm font-bold hover:bg-forest/10 transition-colors text-forest border border-forest/15">
            <Plus size={16} /> Добавить деталь
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 bg-snow/30 p-4 rounded-xl border border-forest/10 group">
              <div className="flex flex-col items-center gap-1 border-r border-forest/10 pr-4 shrink-0">
                <button type="button" onClick={() => moveStep(index, 'up')} disabled={index === 0} className="p-1 text-coal/40 hover:text-coal disabled:opacity-30 transition-colors"><ArrowUp size={16}/></button>
                <button type="button" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="p-1 text-coal/40 hover:text-coal disabled:opacity-30 transition-colors"><ArrowDown size={16}/></button>
              </div>
              <div className="flex-1 grid grid-cols-[1fr_2fr] gap-4">
                <input type="text" value={step[0]} onChange={(e) => updateStep(index, 0, e.target.value)} placeholder="Заголовок (Кому подходит)" required className="p-3 border border-forest/15 rounded-lg outline-none focus:border-forest/40 bg-white" />
                <input type="text" value={step[1]} onChange={(e) => updateStep(index, 1, e.target.value)} placeholder="Описание пункта..." required className="p-3 border border-forest/15 rounded-lg outline-none focus:border-forest/40 bg-white" />
              </div>
              <button type="button" onClick={() => removeStep(index)} className="p-3 text-coal/40 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {steps.length === 0 && <div className="text-center p-6 text-coal/50">Деталей пока нет.</div>}
        </div>
      </div>

      <button type="submit" disabled={isPending} className="px-8 py-4 rounded-full bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform text-lg self-start shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
        {isPending ? 'Сохранение...' : 'Сохранить услугу'}
      </button>
    </form>
  );
}