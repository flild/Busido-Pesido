'use client';
import { useState, useTransition } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { saveNavigatorConfig } from './actions';

export default function NavigatorForm({ initialSteps }: { initialSteps: any[] }) {
  const [steps, setSteps] = useState(initialSteps);
  const [isPending, startTransition] = useTransition();

  const addStep = () => {
    setSteps([...steps, { key: `step_${Date.now()}`, title: '', options: [] }]);
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const addOption = (stepIndex: number) => {
    const newSteps = [...steps];
    // Опция в твоем формате: ["id", "Title", "Description"]
    newSteps[stepIndex].options.push([`opt_${Date.now()}`, '', '']);
    setSteps(newSteps);
  };

  const updateOption = (stepIndex: number, optIndex: number, arrayIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].options[optIndex][arrayIndex] = value;
    setSteps(newSteps);
  };

  const removeOption = (stepIndex: number, optIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].options = newSteps[stepIndex].options.filter((_: any, i: number) => i !== optIndex);
    setSteps(newSteps);
  };

  const handleSubmit = (formData: FormData) => {
    formData.set('steps', JSON.stringify(steps));
    startTransition(() => {
      saveNavigatorConfig(formData);
      alert('Конфиг сохранен!');
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-coal text-white font-bold disabled:opacity-50 transition-all hover:-translate-y-0.5">
          <Save size={18} /> {isPending ? 'Сохранение...' : 'Сохранить граф'}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {steps.map((step, sIndex) => (
          <div key={sIndex} className="bg-white border border-forest/15 p-6 rounded-[24px] shadow-sm relative">
            <button type="button" onClick={() => removeStep(sIndex)} className="absolute top-6 right-6 text-coal/40 hover:text-rose transition-colors">
              <Trash2 size={20} />
            </button>
            
            <div className="grid grid-cols-[1fr_2fr] gap-4 mb-6 pr-12">
              <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase">
                Ключ узла (key)
                <input type="text" value={step.key} onChange={(e) => updateStep(sIndex, 'key', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none" />
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase">
                Вопрос (title)
                <input type="text" value={step.title} onChange={(e) => updateStep(sIndex, 'title', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none" />
              </label>
            </div>

            <div className="bg-snow rounded-xl p-4 border border-forest/5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm text-coal">Варианты ответа:</h4>
                <button type="button" onClick={() => addOption(sIndex)} className="text-xs font-bold text-forest flex items-center gap-1 hover:underline">
                  <Plus size={14} /> Добавить вариант
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {step.options.map((opt: any, oIndex: number) => (
                  <div key={oIndex} className="grid grid-cols-[1fr_2fr_3fr_auto] gap-3 items-center">
                    <input type="text" value={opt[0]} onChange={(e) => updateOption(sIndex, oIndex, 0, e.target.value)} placeholder="opt_id" required className="p-2 border border-forest/15 rounded-lg text-sm" />
                    <input type="text" value={opt[1]} onChange={(e) => updateOption(sIndex, oIndex, 1, e.target.value)} placeholder="Краткий заголовок" required className="p-2 border border-forest/15 rounded-lg text-sm" />
                    <input type="text" value={opt[2]} onChange={(e) => updateOption(sIndex, oIndex, 2, e.target.value)} placeholder="Описание (снизу)" className="p-2 border border-forest/15 rounded-lg text-sm" />
                    <button type="button" onClick={() => removeOption(sIndex, oIndex)} className="p-2 text-coal/40 hover:text-rose">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {step.options.length === 0 && <span className="text-xs text-coal/50">Нет вариантов ответа</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addStep} className="self-center flex items-center gap-2 px-6 py-3 rounded-full border border-forest/15 bg-white text-coal font-bold hover:bg-snow transition-colors">
        <Plus size={18} /> Добавить новый вопрос
      </button>
    </form>
  );
}