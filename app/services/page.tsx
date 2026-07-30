import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Услуги и цены зоопсихолога",
  description:
    "Цены на услуги зоопсихолога: онлайн-консультации, очные встречи, сопровождение, решение поведенческих проблем собак и кошек.",
  alternates: {
    canonical: "https://busidopesido.ru/services",
  },
  openGraph: {
    title: "Услуги и цены зоопсихолога",
    description: "Полный прайс-лист и форматы работы с поведением животных.",
    url: "https://busidopesido.ru/services",
    type: "website",
  },
};

export default function ServicesPage() {
  // ============================================================================
  // ЗАГРУЗКА И РАЗДЕЛЕНИЕ ДАННЫХ (SSR)
  // ============================================================================
  const dbServicesRaw = db.prepare('SELECT * FROM services ORDER BY sort_order ASC').all() as any[];
  
  const allServices = dbServicesRaw.map(service => ({
    ...service,
    steps: JSON.parse(service.steps || '[]') as [string, string][]
  }));

  // Отделяем "Сопровождение" от остальных услуг для кастомного отображения внизу
  const supportService = allServices.find(s => s.id === 'support');
  const gridServices = allServices.filter(s => s.id !== 'support');

  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Зоопсихология",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Услуги и цены",
      "itemListElement": allServices.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "description": s.description
        },
        "price": s.price_int, // Теперь поисковик видит строгую цифру без хардкорных регулярок
        "priceCurrency": "RUB",
        "url": `https://busidopesido.ru${s.link.split('?')[0]}`
      }))
    }
  };

  return (
    <main>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />

      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.fog),theme(colors.snow)_55%,rgba(111,143,191,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">УСЛУГИ И ЦЕНЫ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
            Формат определяется задачей, объёмом данных и необходимой поддержкой
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6">
            Базовая стоимость каждого формата включает работу с одним животным.
            Для двух и более животных объём и стоимость согласуются после анкеты.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          
          {/* Информационный блок */}
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[18px]">
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Срочный формат</strong>
              <p className="text-coal/80">
                Наценка +50% применяется только к разовым форматам и зависит от доступности ближайшего времени. К сопровождению срочная наценка не применяется.
              </p>
            </article>
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Приюты и волонтёры</strong>
              <p className="text-coal/80">
                Предусматриваются льготные условия. Ориентир — скидка около 20%; окончательный размер фиксируется после расчёта формата.
              </p>
            </article>
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Приоритетное рассмотрение</strong>
              <p className="text-coal/80">
                Запрос передан на приоритетное рассмотрение. Специалист ознакомится с ним в ближайшее время и свяжется с вами для согласования максимально близкого доступного времени.
              </p>
            </article>
          </div>

          {/* Сетка базовых услуг (Без сопровождения) */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[18px] mt-[28px]">
            {gridServices.map((service) => (
              <article 
                key={service.id} 
                className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card group/card" 
                id={service.id}
              >
                <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                  <div>
                    {service.tag && (
                      <span className="tag mb-3">{service.tag}</span>
                    )}
                    <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">
                      {service.title}
                    </h3>
                  </div>
                  <div className="text-[28px] font-black text-coal whitespace-nowrap">
                    {service.price}
                  </div>
                </div>
                
                <p className="text-coal/80 mb-4">{service.description}</p>
                
                {service.steps && service.steps.length > 0 && (
                  <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                    <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">
                      Полные условия
                    </summary>
                    <div className="grid gap-3 p-2 mt-2">
                      {service.steps.map(([stepTitle, stepDesc]: [string, string], i: number) => (
                        <div key={i} className="p-4 rounded-2xl bg-snow">
                          <strong className="block text-coal mb-1 font-bold">{stepTitle}</strong>
                          <p className="text-coal/80 text-sm">{stepDesc}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                
                <div className="mt-auto pt-4">
                  <Link className="button button-dark" href={service.link}>
                    {service.link_text}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Выделенный блок: Сопровождение (Рендерим, только если есть в БД) */}
      {supportService && (
        <section className="py-[92px] max-md:py-[64px] bg-[linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white">
          <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-16 items-center">
            <div>
              <span className="kicker text-white opacity-80 mb-4 inline-block">
                {supportService.tag || 'ДЛИТЕЛЬНАЯ РАБОТА'}
              </span>
              <h2 className="text-[44px] max-md:text-[34px] leading-tight text-white m-0">
                {supportService.title}
              </h2>
            </div>
            <div>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Онлайн — {supportService.price}. С выездами — 30 000 ₽. Оплату можно разделить
                на 2, 4 или более частые платежи вплоть до двух раз в неделю по
                согласованному графику.
              </p>
              <Link className="button button-light" href={supportService.link}>
                {supportService.link_text}
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}