import { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Запись на консультацию — Busido-Pesido",
  description: "Запись на консультацию зоопсихолога. Выберите удобное время для онлайн или очной встречи по поведению собак и кошек.",
  alternates: { canonical: "https://busidopesido.ru/booking" },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  
  const initialService = typeof resolvedParams.service === 'string' ? resolvedParams.service : null;
  const initialPet = typeof resolvedParams.pet === 'string' ? resolvedParams.pet : null;

  // Тянем реальные услуги из базы
  const dbServices = db.prepare('SELECT id, title as name, price FROM services ORDER BY sort_order').all() as { id: string, name: string, price: string }[];

  // Считаем завтрашнюю дату прямо на сервере (никаких useEffect на клиенте)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">ЗАПИСЬ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px] text-coal">
            Сначала забронируйте время, затем заполните анкету
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
            Полная анкета занимает около 10 минут благодаря ветвлению. Документы
            и видео вы сможете загрузить в ней же, после подтверждения формата.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          <BookingForm 
            initialService={initialService} 
            initialPet={initialPet} 
            services={dbServices} 
            minDate={minDate} 
          />
        </div>
      </section>
    </main>
  );
}