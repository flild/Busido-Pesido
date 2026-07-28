'use client';

import { useTransition } from 'react';
import { Trash2, Pencil, ArrowUp, ArrowDown, Star } from 'lucide-react';
import Link from 'next/link';
import { deleteService, moveService } from './actions';

export function ServiceRow({ s }: { s: any }) {
  const [isPending, startTransition] = useTransition();

  const themeColors: Record<string, string> = {
    matcha: 'bg-matcha/20 text-matcha',
    rose: 'bg-rose/20 text-rose',
    caramel: 'bg-caramel/20 text-caramel',
    ice: 'bg-ice/20 text-ice',
    berry: 'bg-berry/20 text-berry'
  };

  return (
    <tr className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
      <td className="p-4 font-mono text-coal/50 text-sm">{s.id}</td>
      <td className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {/* Обернули в span, чтобы TS не ругался на title */}
          {s.is_featured === 1 && (
            <span title="Рекомендуемый формат" className="flex shrink-0">
              <Star size={14} className="text-caramel fill-caramel" />
            </span>
          )}
          <span className="font-bold text-coal leading-none">{s.title}</span>
        </div>
        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase tracking-wider ${themeColors[s.theme] || 'bg-fog text-coal'}`}>
          {s.theme}
        </span>
      </td>
      <td className="p-4 font-bold text-coal">{s.price}</td>
      <td className="p-4 text-coal/80 text-sm max-w-[250px] truncate" title={s.description}>
        {s.description}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="font-bold w-6 text-center text-coal/70">{s.sort_order}</span>
          <div className="flex flex-col">
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveService(s.id, 'up') })}
              className="p-1 text-coal/40 hover:text-matcha hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowUp size={14} /></button>
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveService(s.id, 'down') })}
              className="p-1 text-coal/40 hover:text-rose hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowDown size={14} /></button>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex gap-1 justify-end">
          <Link href={`/admin/services/${s.id}/edit`} className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors">
            <Pencil size={18} />
          </Link>
          <button 
            disabled={isPending}
            onClick={() => { if(confirm('Точно удалить услугу?')) startTransition(() => { deleteService(s.id) }) }}
            className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}