// app/admin/cases/[id]/edit/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import CaseForm from '../../CaseForm';

export default async function EditCasePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Строгое правило Next.js 15: читаем параметры асинхронно до запросов
  const { id } = await params;

  // Ищем кейс в базе. Используем .get(), так как ожидаем один объект, а не массив
  const caseData = db.prepare('SELECT * FROM cases WHERE id = ?').get(id) as any;

  if (!caseData) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <Link href="/admin/cases" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к кейсам
      </Link>
      
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Редактировать кейс: {caseData.tab_title}</h1>

      <CaseForm initialData={caseData} />
    </div>
  );
}