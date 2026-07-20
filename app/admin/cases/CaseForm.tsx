// app/admin/cases/CaseForm.tsx
'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { saveCase } from './actions';

export default function CaseForm({ initialData = null }: { initialData?: any }) {
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
    setSteps(steps.filter((_, i) => i !== index));
  };

  return (
    <form action={saveCase} className="flex flex-col gap-8">
      {initialData && <input type="hidden" name="old_id" value={initialData.id} />}
      <input type="hidden" name="steps" value={JSON.stringify(steps)} />

      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm grid grid-cols-2 gap-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          ID (строковый, англ)
          <input name="id" type="text" required defaultValue={initialData?.id} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Цветовая тема
          <select name="theme" required defaultValue={initialData?.theme || 'matcha'} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50">
            <option value="matcha">Matcha (Зеленый)</option>
            <option value="rose">Rose (Красный)</option>
            <option value="caramel">Caramel (Оранжевый)</option>
            <option value="ice">Ice (Синий)</option>
            <option value="berry">Berry (Ягодный)</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Название вкладки
          <input name="tab_title" type="text" required defaultValue={initialData?.tab_title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal">
          Сортировка
          <input name="sort_order" type="number" defaultValue={initialData?.sort_order || 0} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-coal col-span-2">
          Главный заголовок
          <input name="main_title" type="text" required defaultValue={initialData?.main_title} className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/50" />
        </label>
      </div>

      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-coal m-0">Шаги кейса</h2>
          <button type="button" onClick={addStep} className="inline-flex items-center gap-2 px-4 py-2 bg-snow rounded-xl text-sm font-bold hover:bg-forest/10 transition-colors text-forest">
            <Plus size={16} /> Добавить шаг
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className="p-6 border border-forest/15 rounded-[16px] bg-snow/50 relative">
              <button type="button" onClick={() => removeStep(index)} className="absolute top-4 right-4 p-2 text-coal/40 hover:text-rose transition-colors">
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase">
                  Лейбл (на таймлайне)
                  <input type="text" value={step.label} onChange={(e) => updateStep(index, 'label', e.target.value)} required className="p-2.5 border border-forest/15 rounded-lg outline-none" placeholder="Сбор данных" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase">
                  Заголовок шага
                  <input type="text" value={step.headline} onChange={(e) => updateStep(index, 'headline', e.target.value)} required className="p-2.5 border border-forest/15 rounded-lg outline-none" />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase mb-4">
                Основной текст
                <textarea value={step.text} onChange={(e) => updateStep(index, 'text', e.target.value)} required rows={3} className="p-2.5 border border-forest/15 rounded-lg outline-none resize-none" />
              </label>

              <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase">
                Акцент / Вывод (опционально)
                <input type="text" value={step.highlight || ''} onChange={(e) => updateStep(index, 'highlight', e.target.value)} className="p-2.5 border border-forest/15 rounded-lg outline-none" />
              </label>
            </div>
          ))}
          {steps.length === 0 && <p className="text-coal/50 text-sm">Нет ни одного шага. Добавь хотя бы один.</p>}
        </div>
      </div>

      <button type="submit" className="px-6 py-4 rounded-xl bg-coal text-white font-bold hover:-translate-y-0.5 transition-transform text-lg self-start">
        Сохранить кейс
      </button>
    </form>
  );
}