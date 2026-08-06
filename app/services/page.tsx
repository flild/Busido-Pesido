import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { themeColors, type BrandTheme } from "@/lib/theme";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

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

  const supportService = allServices.find(s => s.id === 'support');
  const gridServices = allServices.filter(s => s.id !== 'support');

  // Безопасное извлечение тем (аналогично FormatsSection, но для сервера)
  const availableThemes = Object.keys(themeColors) as BrandTheme[];
  const getSafeThemeKey = (themeStr: string | undefined | null, fallbackIndex: number): BrandTheme => {
    if (themeStr && themeStr in themeColors) {
      return themeStr as BrandTheme;
    }
    return availableThemes[fallbackIndex % availableThemes.length];
  };

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
        "price": s.price_int, 
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
      <BreadcrumbJsonLd 
        items={[
          { name: "Главная", url: "https://busidopesido.ru" },
          { name: "Форматы работы, цены", url: "https://busidopesido.ru/sevices" }
        ]} 
      />
      {/* Улучшенный Герой-блок с декоративными градиентами */}
      <section className="pt-[108px] pb-[74px] bg-[radial-gradient(circle_at_15%_50%,rgba(198,142,107,0.12),transparent_25rem),radial-gradient(circle_at_85%_30%,rgba(111,143,191,0.15),transparent_25rem),linear-gradient(135deg,theme(colors.snow),theme(colors.fog)_75%)] relative overflow-hidden">
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
          
          {/* Информационный блок с тематическими акцентами */}
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[18px]">
            <article className="p-7 rounded-[28px] bg-rose/5 border border-rose/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose/10 rounded-bl-full -z-10" />
              <strong className="block text-[20px] font-black text-rose mb-3">Срочный формат</strong>
              <p className="text-coal/80 leading-relaxed text-[15px]">
                Наценка +50% применяется только к разовым форматам и зависит от доступности ближайшего времени. К сопровождению срочная наценка не применяется.
              </p>
            </article>
            <article className="p-7 rounded-[28px] bg-matcha/5 border border-matcha/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-matcha/10 rounded-bl-full -z-10" />
              <strong className="block text-[20px] font-black text-matcha mb-3">Приюты и волонтёры</strong>
              <p className="text-coal/80 leading-relaxed text-[15px]">
                Предусматриваются льготные условия. Ориентир — скидка около 20%; окончательный размер фиксируется после расчёта формата.
              </p>
            </article>
            <article className="p-7 rounded-[28px] bg-caramel/5 border border-caramel/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-caramel/10 rounded-bl-full -z-10" />
              <strong className="block text-[20px] font-black text-caramel mb-3">Приоритет</strong>
              <p className="text-coal/80 leading-relaxed text-[15px]">
                Запрос передан на приоритетное рассмотрение. Специалист ознакомится с ним в ближайшее время и свяжется для согласования.
              </p>
            </article>
          </div>

          {/* Сетка базовых услуг с применением тем */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-6 mt-[42px]">
            {gridServices.map((service, index) => {
              const themeKey = getSafeThemeKey(service.theme, index);
              const theme = themeColors[themeKey];

              return (
                <article 
                  key={service.id} 
                  id={service.id}
                  className={`group relative flex flex-col p-[38px] max-md:p-7 bg-white border border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[38px] overflow-hidden ${service.is_featured ? 'bg-[linear-gradient(155deg,theme(colors.snow),theme(colors.white)_65%)] shadow-md' : ''}`} 
                >
                  {/* Цветная полоса сверху */}
                  <div className={`absolute top-0 left-0 right-0 h-2 opacity-90 ${theme.bg}`}></div>
                  
                  {/* Легкий фоновый градиент при наведении */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${theme.gradient}/5 to-transparent transition-opacity duration-500 pointer-events-none`}></div>

                  <div className="flex justify-between gap-6 max-sm:flex-col items-start mb-6 relative z-10">
                    <div>
                      {service.tag ? (
                        <span className={`inline-block px-3 py-1.5 rounded-full ${theme.softBg} ${theme.text} text-[12px] font-[900] uppercase tracking-[0.08em] mb-4`}>
                          {service.tag}
                        </span>
                      ) : (
                        <div className="h-[32px] mb-4" />
                      )}
                      <h3 className="text-[32px] max-md:text-[26px] font-bold text-coal leading-tight m-0">
                        {service.title}
                      </h3>
                    </div>
                    <div className={`text-[32px] max-md:text-[28px] font-black ${theme.text} whitespace-nowrap`}>
                      {service.price}
                    </div>
                  </div>
                  
                  <p className="text-coal/75 leading-relaxed mb-6 text-[16px] relative z-10">
                    {service.description}
                  </p>
                  
                  {service.steps && service.steps.length > 0 && (
                    <details className="group/details my-4 border border-forest/10 open:border-forest/20 rounded-[20px] transition-all relative z-10 bg-snow/50">
                      <summary className="font-[800] cursor-pointer p-5 rounded-[20px] outline-none hover:bg-fog/50 transition-colors text-coal flex items-center justify-between">
                        <span>Полные условия и шаги</span>
                        <span className="text-forest/40 group-open/details:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="grid gap-3 p-3 pt-0">
                        {service.steps.map(([stepTitle, stepDesc]: [string, string], i: number) => (
                          <div key={i} className={`p-4 rounded-2xl bg-white border border-forest/5 shadow-sm border-l-[3px] ${theme.borderFull}`}>
                            <strong className="block text-coal mb-1.5 font-[800]">{stepTitle}</strong>
                            <p className="text-coal/75 text-[14px] leading-relaxed">{stepDesc}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                  
                  <div className="mt-auto pt-6 relative z-10">
                    <Link 
                      className={`button w-full text-center text-[16px] py-4 ${service.is_featured ? 'button-primary' : 'bg-snow text-coal hover:bg-fog transition-colors border border-forest/5 font-[800]'}`} 
                      href={service.link}
                    >
                      {service.link_text}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

{/* Выделенный блок: Сопровождение */}
      {supportService && (
        <section className="py-[100px] max-md:py-[72px] bg-[radial-gradient(circle_at_90%_10%,rgba(198,142,107,0.15),transparent_30rem),linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white relative overflow-hidden">
          <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-16 items-center relative z-10">
            <div>
              <span className="kicker text-white/80 mb-5 inline-block">
                {supportService.tag || 'ДЛИТЕЛЬНАЯ РАБОТА'}
              </span>
              <h2 className="text-[48px] max-md:text-[36px] font-bold leading-[1.05] text-white m-0">
                {supportService.title}
              </h2>
            </div>
            <div>
              {/* Выводим основную цену динамически из базы */}
              <div className="text-[36px] max-md:text-[30px] font-black text-white mb-4">
                {supportService.price}
              </div>
              
              {/* Выводим описание динамически из базы */}
              <p className="text-[19px] max-md:text-[17px] text-white/90 mb-8 leading-relaxed whitespace-pre-wrap">
                {supportService.description}
              </p>
              
              <Link className="button button-light px-8 py-4 text-[16px] max-md:w-full max-md:text-center" href={supportService.link}>
                {supportService.link_text}
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}