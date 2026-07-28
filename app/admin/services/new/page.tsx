import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ServiceForm from '../ServiceForm'; 

export default function NewServicePage() {
  return (
    <div className="max-w-4xl">
      <Link href="/admin/services" className="inline-flex items-center gap-2 text-sm font-bold text-coal/60 hover:text-forest mb-6 transition-colors">
        <ArrowLeft size={16} /> Назад к услугам
      </Link>
      <h1 className="text-[32px] font-bold text-coal mb-8 m-0">Новая услуга</h1>
      <ServiceForm />
    </div>
  );
}