'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteArticle } from './actions';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Удалить статью? Действие необратимо.')) return;
    startTransition(async () => {
      const res = await deleteArticle(id);
      if (res?.error) alert(res.error);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors cursor-pointer border-none bg-transparent disabled:opacity-50" 
      title="Удалить"
    >
      <Trash2 size={18} />
    </button>
  );
}