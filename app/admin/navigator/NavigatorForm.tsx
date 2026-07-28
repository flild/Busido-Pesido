'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { saveNavigatorConfig } from './actions';

export interface NavStep {
  key: string;
  title: string;
  options: [string, string, string][];
}

export default function NavigatorForm({ initialSteps }: { initialSteps: NavStep[] }) {
  const [steps, setSteps] = useState<NavStep[]>(initialSteps || []);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // --- УПРАВЛЕНИЕ ВОПРОСАМИ ---
  const addStep = () => {
    setSteps([...steps, { key: `step_${Date.now()}`, title: '', options: [] }]);
    setSaveStatus('idle');
  };

  const updateStep = (index: number, field: keyof NavStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  const removeStep = (index: number) => {
    if (confirm('Удалить этот вопрос?')) {
      setSteps(steps.filter((_, i) => i !== index));
      setSaveStatus('idle');
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  // --- УПРАВЛЕНИЕ ОТВЕТАМИ ---
  const addOption = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].options.push([`opt_${Date.now()}`, '', '']);
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  const updateOption = (stepIndex: number, optIndex: number, arrayIndex: number, value: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].options[optIndex][arrayIndex] = value;
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  const removeOption = (stepIndex: number, optIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].options = newSteps[stepIndex].options.filter((_, i) => i !== optIndex);
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  const moveOption = (stepIndex: number, optIndex: number, direction: 'up' | 'down') => {
    const options = steps[stepIndex].options;
    if ((direction === 'up' && optIndex === 0) || (direction === 'down' && optIndex === options.length - 1)) return;
    
    const newSteps = [...steps];
    const swapIndex = direction === 'up' ? optIndex - 1 : optIndex + 1;
    [newSteps[stepIndex].options[optIndex], newSteps[stepIndex].options[swapIndex]] = 
    [newSteps[stepIndex].options[swapIndex], newSteps[stepIndex].options[optIndex]];
    
    setSteps(newSteps);
    setSaveStatus('idle');
  };

  const handleSubmit = (formData: FormData) => {
    formData.set('steps', JSON.stringify(steps));
    setSaveStatus('idle');
    
    startTransition(async () => {
      const res = await saveNavigatorConfig(formData);
      if (res?.error) {
        setSaveStatus('error');
        setErrorMessage(res.error);
      } else {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-[20px] border border-forest/15 shadow-sm sticky top-4 z-50">
        <div className="text-sm font-medium">
          {saveStatus === 'success' && <span className="text-matcha flex items-center gap-2"><Check size={18}/> Изменения сохранены</span>}
          {saveStatus === 'error' && <span className="text-rose">{errorMessage}</span>}
          {saveStatus === 'idle' && <span className="text-coal/50">Внесены изменения. Не забудьте сохранить.</span>}
        </div>
        <button 
          type="submit" 
          disabled={isPending} 
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coal text-white font-bold disabled:opacity-50 transition-all hover:-translate-y-0.5 shadow-md"
        >
          <Save size={18} /> {isPending ? 'Сохранение...' : 'Сохранить граф'}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {steps.map((step, sIndex) => (
          <div key={sIndex} className="bg-white border border-forest/15 p-6 rounded-[24px] shadow-sm relative flex gap-6 group transition-colors hover:border-forest/30">
            
            {/* Сайдбар управления вопросом */}
            <div className="flex flex-col items-center gap-2 border-r border-forest/10 pr-4 shrink-0">
              <span className="text-xs font-black text-coal/30 uppercase tracking-widest mb-2">Шаг {sIndex + 1}</span>
              <button type="button" onClick={() => moveStep(sIndex, 'up')} disabled={sIndex === 0} className="p-1.5 text-coal/40 hover:text-coal hover:bg-snow rounded-lg disabled:opacity-30 transition-colors">
                <ArrowUp size={16} />
              </button>
              <button type="button" onClick={() => moveStep(sIndex, 'down')} disabled={sIndex === steps.length - 1} className="p-1.5 text-coal/40 hover:text-coal hover:bg-snow rounded-lg disabled:opacity-30 transition-colors">
                <ArrowDown size={16} />
              </button>
              <button type="button" onClick={() => removeStep(sIndex)} className="p-1.5 text-coal/40 hover:text-rose hover:bg-rose/10 rounded-lg mt-auto transition-colors" title="Удалить вопрос">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-[1fr_2fr] gap-4 mb-6">
                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                  Ключ узла (key)
                  <input type="text" value={step.key} onChange={(e) => updateStep(sIndex, 'key', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-snow" placeholder="species" />
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold text-coal uppercase tracking-wider">
                  Текст вопроса
                  <input type="text" value={step.title} onChange={(e) => updateStep(sIndex, 'title', e.target.value)} required className="p-3 border border-forest/15 rounded-xl outline-none focus:border-forest/40 bg-snow" placeholder="С кем связан запрос?" />
                </label>
              </div>

              <div className="bg-snow/50 rounded-2xl p-5 border border-forest/10">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-bold text-sm text-coal uppercase tracking-wider">Варианты ответа</h4>
                  <button type="button" onClick={() => addOption(sIndex)} className="text-xs font-bold text-white bg-forest px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-forest/90 transition-colors">
                    <Plus size={14} /> Добавить вариант
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {step.options.map((opt, oIndex) => (
                    <div key={oIndex} className="grid grid-cols-[auto_1fr_2fr_3fr_auto] gap-3 items-center bg-white p-2 rounded-xl border border-forest/10">
                      
                      {/* Сортировка опций */}
                      <div className="flex flex-col border-r border-forest/5 pr-2">
                        <button type="button" onClick={() => moveOption(sIndex, oIndex, 'up')} disabled={oIndex === 0} className="text-coal/30 hover:text-coal disabled:opacity-30"><ArrowUp size={14}/></button>
                        <button type="button" onClick={() => moveOption(sIndex, oIndex, 'down')} disabled={oIndex === step.options.length - 1} className="text-coal/30 hover:text-coal disabled:opacity-30"><ArrowDown size={14}/></button>
                      </div>

                      <input type="text" value={opt[0]} onChange={(e) => updateOption(sIndex, oIndex, 0, e.target.value)} placeholder="ID (dog)" required className="p-2 border border-forest/15 rounded-lg text-sm outline-none focus:border-forest/40" />
                      <input type="text" value={opt[1]} onChange={(e) => updateOption(sIndex, oIndex, 1, e.target.value)} placeholder="Заголовок (Собака)" required className="p-2 border border-forest/15 rounded-lg text-sm outline-none focus:border-forest/40" />
                      <input type="text" value={opt[2]} onChange={(e) => updateOption(sIndex, oIndex, 2, e.target.value)} placeholder="Описание (Щенок, взрослая...)" className="p-2 border border-forest/15 rounded-lg text-sm outline-none focus:border-forest/40" />
                      
                      <button type="button" onClick={() => removeOption(sIndex, oIndex)} className="p-2 text-coal/30 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {step.options.length === 0 && <span className="text-xs text-coal/50 text-center py-4">Нет вариантов ответа. Добавьте хотя бы один.</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addStep} className="self-center flex items-center gap-2 px-8 py-4 mt-4 rounded-full border-2 border-dashed border-forest/30 text-forest font-bold hover:bg-forest/5 transition-colors">
        <Plus size={20} /> Добавить новый вопрос
      </button>
    </form>
  );
}