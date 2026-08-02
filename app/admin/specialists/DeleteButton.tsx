'use client';

import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteSpecialist } from './actions';
import { useToast } from '@/components/Toast';

export function DeleteButton({ id, name }: { id: number, name: string }) {
  const [isPending, startTransition] = useTransition();
  const { say } = useToast();

  const handleDelete = () => {
    if (!confirm(`Точно удалить специалиста ${name}?`)) return;
    
    startTransition(async () => {
      const res = await deleteSpecialist(id);
      if (res?.error) say(res.error);
    });
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="p-2 text-rose/60 hover:text-rose hover:bg-rose/10 rounded-lg transition-colors disabled:opacity-50"
      title="Удалить"
    >
      {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
    </button>
  );
}