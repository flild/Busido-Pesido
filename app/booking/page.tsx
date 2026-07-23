import { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";

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
  
  // Достаем параметры из URL (например: ?service=online&pet=cat)
  const initialService = typeof resolvedParams.service === 'string' ? resolvedParams.service : null;
  const initialPet = typeof resolvedParams.pet === 'string' ? resolvedParams.pet : null;

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
            и видео можно добавить сразу или дослать позднее.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          {/* Передаем параметры инициализации в клиентскую форму */}
          <BookingForm initialService={initialService} initialPet={initialPet} />
        </div>
      </section>

      <section className="pb-[92px] max-md:pb-[64px]">
        <div className="container max-w-[820px]">
          <div className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)]">
            <span className="inline-block px-3 py-1.5 rounded-full bg-rose/15 text-rose text-[12px] font-bold uppercase tracking-wider mb-4">
              Приоритетный запрос
            </span>
            <p className="text-coal/80 mb-4 leading-relaxed">
              Запрос передан на приоритетное рассмотрение. Специалист
              ознакомится с ним в ближайшее время и свяжется с вами для
              согласования максимально близкого доступного времени.
            </p>
            <p className="text-coal/80 leading-relaxed">
              <strong className="font-bold text-coal">Наценка +50%</strong> применяется только к разовым
              форматам. Это не экстренная ветеринарная помощь.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}