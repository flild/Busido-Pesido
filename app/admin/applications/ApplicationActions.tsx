'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { updateAppStatus, deleteApp } from './actions';

interface Props {
  id: number;
  currentStatus: string;
}

export function ApplicationActions({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateAppStatus(id, newStatus);
    });
  };

  const handleDelete = () => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку? Действие необратимо.')) return;
    
    startTransition(async () => {
      await deleteApp(id);
    });
  };

  return (
    <div className="flex gap-2 justify-end items-center">
      <select 
        value={currentStatus} 
        onChange={handleStatusChange}
        disabled={isPending}
        className="px-2 py-1.5 rounded-lg border border-forest/15 bg-white text-coal font-medium text-sm outline-none focus:border-forest/40 cursor-pointer transition-colors disabled:opacity-50"
      >
        <option value="new">Новая</option>
        <option value="contacted">Связались</option>
        <option value="completed">Завершена</option>
        <option value="cancelled">Отменена</option>
      </select>
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors cursor-pointer border-none bg-transparent disabled:opacity-50" 
        title="Удалить"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}