'use client';

import { useTransition } from 'react';
import { Trash2, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { deleteCase, moveCase } from './actions';

export function CaseRow({ c }: { c: any }) {
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
      <td className="p-4 font-bold text-coal/50 text-sm">{c.id}</td>
      <td className="p-4">
        <span className="block font-bold text-coal leading-none mb-1">{c.tab_title}</span>
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${themeColors[c.theme] || 'bg-fog text-coal'}`}>
          {c.theme}
        </span>
      </td>
      <td className="p-4 text-coal/80 text-sm max-w-[300px] truncate" title={c.main_title}>
        {c.main_title}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="font-bold w-6 text-center text-coal/70">{c.sort_order}</span>
          <div className="flex flex-col">
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveCase(c.id, 'up') })}
              className="p-1 text-coal/40 hover:text-matcha hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowUp size={14} /></button>
            <button 
              disabled={isPending} onClick={() => startTransition(() => { moveCase(c.id, 'down') })}
              className="p-1 text-coal/40 hover:text-rose hover:bg-snow rounded disabled:opacity-50 transition-colors"
            ><ArrowDown size={14} /></button>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex gap-1 justify-end">
          <Link href={`/admin/cases/${c.id}/edit`} className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors">
            <Pencil size={18} />
          </Link>
          <button 
            disabled={isPending}
            onClick={() => { if(confirm('Точно удалить кейс?')) startTransition(() => { deleteCase(c.id) }) }}
            className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose cursor-pointer border-none bg-transparent transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}