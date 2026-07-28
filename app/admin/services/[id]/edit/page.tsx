import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import ServiceForm from '../../ServiceForm';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serviceData = db.prepare('SELECT * FROM services WHERE id = ?').get(id) as any;

  if (!serviceData) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к услугам
      </Link>
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Редактировать: {serviceData.title}</h1>
      <ServiceForm initialData={serviceData} />
    </div>
  );
}