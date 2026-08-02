import { SpecialistForm } from '../SpecialistForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewSpecialistPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/specialists" className="inline-flex items-center gap-1.5 text-sm text-coal/50 font-bold hover:text-forest transition-colors mb-4">
          <ArrowLeft size={16} /> Назад к списку
        </Link>
        <h1 className="text-[28px] font-bold text-coal m-0">Добавить специалиста</h1>
      </div>
      <SpecialistForm />
    </div>
  );
}