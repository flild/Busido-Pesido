'use client';
import { useState, useTransition } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { saveCase } from './actions';

export default function CaseForm({ initialData = null }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<any[]>(
    initialData?.steps ? JSON.parse(initialData.steps) : []
  );

  const addStep = () => {
    setSteps([...steps, { label: '', headline: '', text: '', highlight: '' }]);
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (confirm('Точно удалить этот шаг?')) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Меняем элементы местами
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
              
              {/* Левая панель с кнопками управления */}
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
              
              {/* Поля шага */}
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