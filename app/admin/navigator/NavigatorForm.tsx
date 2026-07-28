'use client';

import { useState, useTransition, useCallback } from 'react';
import { Plus, Trash2, Save, Check } from 'lucide-react';
import { saveNavigatorConfig } from './actions';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';

// @ts-expect-error
import '@xyflow/react/dist/style.css';// Обязательные стили либы

// Интерфейсы (дублируют те, что в публичном навигаторе)
export interface ServiceFormat {
  id: string;
  title: string;
  price: string;
  description: string;
  theme: string;
  link_text: string;
}

// === КАСТОМНЫЙ УЗЕЛ: ВОПРОС ===
const QuestionNode = ({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();

  const updateField = (field: string, value: string) => updateNodeData(id, { [field]: value });
  
  const addOption = () => {
    const newOptions = [...(data.options || []), { id: `opt_${Date.now()}`, title: '', desc: '' }];
    updateNodeData(id, { options: newOptions });
  };

  const updateOption = (optId: string, field: string, value: string) => {
    const newOptions = data.options.map((opt: any) => 
      opt.id === optId ? { ...opt, [field]: value } : opt
    );
    updateNodeData(id, { options: newOptions });
  };

  const removeOption = (optId: string) => {
    updateNodeData(id, { options: data.options.filter((opt: any) => opt.id !== optId) });
  };

  return (
    <div className="bg-white border-2 border-forest/30 rounded-2xl w-[320px] shadow-lg relative overflow-visible">
      {/* Входящий коннектор */}
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-matcha border-2 border-white" />
      
      <div className="p-4 bg-snow rounded-t-xl border-b border-forest/10">
        <div className="text-[10px] font-black text-coal/40 uppercase mb-2">Вопрос (Question)</div>
        <input 
          type="text" 
          placeholder="Ключ (например: species)" 
          value={data.questionKey || ''} 
          onChange={(e) => updateField('questionKey', e.target.value)}
          className="w-full mb-2 p-2 text-xs border border-forest/15 rounded-lg nodrag outline-none focus:border-forest/40"
        />
        <input 
          type="text" 
          placeholder="Текст вопроса..." 
          value={data.title || ''} 
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full p-2 text-sm font-bold border border-forest/15 rounded-lg nodrag outline-none focus:border-forest/40"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-coal/40 uppercase">Варианты ответа</span>
          <button type="button" onClick={addOption} className="text-matcha hover:text-forest nodrag"><Plus size={16} /></button>
        </div>
        
        {data.options?.map((opt: any) => (
          <div key={opt.id} className="relative bg-snow p-2 rounded-xl border border-forest/10 flex flex-col gap-1 pr-8">
            <input 
              type="text" 
              placeholder="Короткий ID (dog)" 
              value={opt.id} 
              onChange={(e) => updateOption(opt.id, 'id', e.target.value)}
              className="text-xs p-1 border border-forest/10 rounded nodrag"
            />
            <input 
              type="text" 
              placeholder="Заголовок" 
              value={opt.title} 
              onChange={(e) => updateOption(opt.id, 'title', e.target.value)}
              className="text-sm font-bold p-1 border border-forest/10 rounded nodrag"
            />
            <input 
              type="text" 
              placeholder="Описание..." 
              value={opt.desc} 
              onChange={(e) => updateOption(opt.id, 'desc', e.target.value)}
              className="text-xs p-1 border border-forest/10 rounded nodrag"
            />
            
            <button type="button" onClick={() => removeOption(opt.id)} className="absolute right-2 top-2 text-coal/30 hover:text-rose nodrag">
              <Trash2 size={14} />
            </button>

            {/* Исходящий коннектор для конкретного ответа */}
            <Handle 
              type="source" 
              position={Position.Right} 
              id={opt.id} 
              className="w-4 h-4 bg-caramel border-2 border-white absolute -right-2.5 top-1/2 -translate-y-1/2" 
            />
          </div>
        ))}
        {(!data.options || data.options.length === 0) && <p className="text-xs text-coal/40 text-center">Нет вариантов</p>}
      </div>
    </div>
  );
};

// === КАСТОМНЫЙ УЗЕЛ: РЕЗУЛЬТАТ ===
const ResultNode = ({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  // Форматы прокидываем через data при создании узла

  return (
    <div className="bg-white border-2 border-rose/30 rounded-2xl w-[260px] shadow-lg relative">
      <Handle type="target" position={Position.Top} className="w-4 h-4 bg-rose border-2 border-white" />
      
      <div className="p-4 bg-rose/5 rounded-2xl flex flex-col gap-3">
        <div className="text-[10px] font-black text-rose/70 uppercase">Финальный результат</div>
        <select 
          value={data.serviceId || ''} 
          onChange={(e) => updateNodeData(id, { serviceId: e.target.value })}
          className="w-full p-2 text-sm border border-rose/20 rounded-lg nodrag outline-none focus:border-rose/50 bg-white"
        >
          <option value="" disabled>Выберите формат работы...</option>
          {data.formats?.map((f: ServiceFormat) => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const nodeTypes = {
  question: QuestionNode,
  result: ResultNode,
};

// === ОСНОВНОЙ КОМПОНЕНТ ФОРМЫ ===
function NavigatorFlow({ initialData, formats }: { initialData: any, formats: ServiceFormat[] }) {
  // Инициализация. Если данные старые (плоский массив), начинаем с чистого листа
  const isOldData = Array.isArray(initialData);
  
  const [nodes, setNodes] = useState<Node[]>(isOldData ? [] : initialData?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(isOldData ? [] : initialData?.edges || []);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), []);

  const addQuestionNode = () => {
    setNodes((nds) => [
      ...nds, 
      { id: `q_${Date.now()}`, type: 'question', position: { x: 100, y: 100 }, data: { questionKey: '', title: '', options: [] } }
    ]);
  };

  const addResultNode = () => {
    setNodes((nds) => [
      ...nds, 
      { id: `r_${Date.now()}`, type: 'result', position: { x: 500, y: 100 }, data: { serviceId: '', formats } }
    ]);
  };

  const handleSubmit = (formData: FormData) => {
    // Чистим форматы из узлов результата перед сохранением, чтобы не раздувать JSON в БД
    const cleanNodes = nodes.map(n => {
      if (n.type === 'result') {
        const { formats, ...restData } = n.data;
        return { ...n, data: restData };
      }
      return n;
    });

    const graphData = { nodes: cleanNodes, edges };
    formData.set('steps', JSON.stringify(graphData));
    
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
    <form action={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Тулбар */}
      <div className="flex justify-between items-center bg-white p-4 rounded-[20px] border border-forest/15 shadow-sm sticky top-4 z-50">
        <div className="flex gap-4 items-center">
          <button type="button" onClick={addQuestionNode} className="px-4 py-2 text-sm font-bold bg-snow border border-forest/15 rounded-xl hover:bg-forest hover:text-white transition-colors">
            + Вопрос
          </button>
          <button type="button" onClick={addResultNode} className="px-4 py-2 text-sm font-bold bg-snow border border-rose/20 rounded-xl hover:bg-rose hover:text-white transition-colors">
            + Результат
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            {saveStatus === 'success' && <span className="text-matcha flex items-center gap-2"><Check size={18}/> Сохранено</span>}
            {saveStatus === 'error' && <span className="text-rose">{errorMessage}</span>}
          </div>
          <button 
            type="submit" 
            disabled={isPending} 
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coal text-white font-bold disabled:opacity-50 hover:-translate-y-0.5 shadow-md transition-all"
          >
            <Save size={18} /> {isPending ? 'Сохранение...' : 'Сохранить граф'}
          </button>
        </div>
      </div>

      {/* Канвас React Flow */}
      <div className="h-[750px] w-full bg-snow border border-forest/15 rounded-[24px] overflow-hidden shadow-inner">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[radial-gradient(theme(colors.forest/5)_1px,transparent_1px)] [background-size:20px_20px]"
        >
          <Background color="#ccc" gap={20} />
          <Controls className="bg-white border-forest/10 shadow-md rounded-xl overflow-hidden" />
        </ReactFlow>
      </div>
    </form>
  );
}

// Обертка для провайдера
export default function NavigatorForm({ initialSteps, formats }: { initialSteps: any, formats: ServiceFormat[] }) {
  // 1. Делаем глубокую копию, чтобы не мутировать пропсы напрямую (React этого терпеть не может)
  // 2. Если пришел старый плоский массив из прошлой версии, сбрасываем в пустой граф
  const isOldFormat = Array.isArray(initialSteps);
  const parsedData = isOldFormat || !initialSteps 
    ? { nodes: [], edges: [] } 
    : JSON.parse(JSON.stringify(initialSteps));

  // Теперь спокойно мутируем локальную копию
  if (parsedData.nodes && Array.isArray(parsedData.nodes)) {
    parsedData.nodes = parsedData.nodes.map((n: any) => {
      if (n.type === 'result') return { ...n, data: { ...n.data, formats } };
      return n;
    });
  }

  return (
    <ReactFlowProvider>
      <NavigatorFlow initialData={parsedData} formats={formats} />
    </ReactFlowProvider>
  );
}