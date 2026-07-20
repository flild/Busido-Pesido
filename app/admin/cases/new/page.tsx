// app/admin/cases/new/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CaseForm from '../CaseForm'; 

export default function NewCasePage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/cases" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к кейсам
      </Link>
      
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Новый кейс</h1>

      {/* Без initialData форма рендерит пустые поля */}
      <CaseForm />
    </div>
  );
}