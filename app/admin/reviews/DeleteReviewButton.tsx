'use client';

import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function DeleteReviewButton() {
  // Хук useFormStatus отслеживает статус родительской формы (работает только в клиентских компонентах)
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit"
      disabled={pending}
      className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors cursor-pointer border-none bg-transparent disabled:opacity-50"
      onClick={(e) => !window.confirm('Удалить отзыв? Действие необратимо.') && e.preventDefault()}
      title="Удалить"
    >
      <Trash2 size={18} />
    </button>
  );
}