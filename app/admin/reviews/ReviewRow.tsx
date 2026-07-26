'use client';

import { useTransition } from 'react';
import { Trash2, Pencil, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteReview, toggleReviewStatus, moveReview } from './actions';

interface Review {
  id: number;
  category: string;
  tag: string;
  pet_name: string;
  breed: string;
  text: string;
  author: string;
  format: string;
  image_url: string;
  sort_order: number;
  status?: string;
}

const catColors: Record<string, string> = {
  dog: 'bg-matcha/15 text-matcha',
  cat: 'bg-ice/20 text-ice border border-ice/20',
  support: 'bg-rose/15 text-rose'
};
const catLabels: Record<string, string> = { dog: 'Собака', cat: 'Кошка', support: 'Сопровождение' };

export function ReviewRow({ rev }: { rev: Review }) {
  const [isPending, startTransition] = useTransition();
  const isHidden = rev.status === 'hidden';

  return (
    <tr className={`border-b border-forest/5 hover:bg-snow/50 transition-colors ${isHidden ? 'opacity-50 bg-fog/20' : ''}`}>
      <td className="p-4 text-coal/50 font-medium">{rev.id}</td>
      
      {/* Питомец + Фото */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-fog shrink-0 border border-forest/10">
            <Image src={rev.image_url} alt={rev.pet_name} fill className="object-cover" sizes="48px" />
          </div>
          <div>
            <strong className="block font-bold text-coal leading-none mb-1">{rev.pet_name}</strong>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${catColors[rev.category] || 'bg-fog text-coal'}`}>
              {catLabels[rev.category] || rev.category}
            </span>
          </div>
        </div>
      </td>
      
      {/* Текст */}
      <td className="p-4">
        <div className="text-coal/80 text-[13px] leading-snug max-w-[280px] line-clamp-2" title={rev.text}>
          {rev.text}
        </div>
      </td>
      
      {/* Автор */}
      <td className="p-4 text-coal">
        <span className="block font-bold text-sm">{rev.author}</span>
        <small className="text-coal/60">{rev.format}</small>
      </td>
      
      {/* Сортировка со стрелками */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="font-bold w-6 text-center text-coal/70">{rev.sort_order}</span>
          <div className="flex flex-col">
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveReview(rev.id, 'up') })}
              className="p-1 text-coal/40 hover:text-matcha hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowUp size={14} /></button>
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveReview(rev.id, 'down') })}
              className="p-1 text-coal/40 hover:text-rose hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowDown size={14} /></button>
          </div>
        </div>
      </td>
      
      {/* Действия */}
      <td className="p-4">
        <div className="flex gap-1 justify-end items-center">
          <button 
            disabled={isPending}
            onClick={() => startTransition(() => { toggleReviewStatus(rev.id, rev.status || 'published') })}
            className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${isHidden ? 'text-coal/40 hover:text-coal hover:bg-snow' : 'text-matcha hover:bg-matcha/10'}`}
            title={isHidden ? 'Показать на сайте' : 'Скрыть с сайта'}
          >
            {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          
          <Link href={`/admin/reviews/${rev.id}/edit`} className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors" title="Редактировать">
            <Pencil size={18} />
          </Link>
          
          <button 
            disabled={isPending}
            onClick={() => { if(confirm('Точно удалить?')) startTransition(() => { deleteReview(rev.id) }) }}
            className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors disabled:opacity-50"
            title="Удалить навсегда"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}