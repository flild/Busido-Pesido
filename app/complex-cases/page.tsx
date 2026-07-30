import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { 
  ShieldAlert, 
  Stethoscope, 
  Home, 
  HeartHandshake, 
  FileText, 
  AlertTriangle, 
  Ban, 
  Search, 
  ArrowRightLeft 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Сложные случаи: реактивность, страхи, зоопсихолог',
  description: 'Помощь зоопсихолога при сложных поведенческих нарушениях: агрессия, страхи, реактивность собак и кошек. Ветеринарное второе мнение.',
  alternates: {
    canonical: "https://busidopesido.ru/complex-cases",
  },
  openGraph: {
    title: 'Сложные случаи и ветеринарное второе мнение',
    description: 'Когда поведение, здоровье и среда связаны. Анализ сложных поведенческих проблем.',
    url: 'https://busidopesido.ru/complex-cases',
    type: 'website',
  },
};

export default function ComplexCasesPage() {
  // ============================================================================
  // ЗАГРУЗКА ДАННЫХ (SSR)
  // ============================================================================
  const dbSecondOpinion = db.prepare("SELECT price, price_int FROM services WHERE id = 'second'").get() as { price: string, price_int: number } | undefined;
  
  const priceText = dbSecondOpinion?.price || '2 500 ₽';
  const priceInt = dbSecondOpinion?.price_int || 2500;

  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Ветеринарное второе мнение",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "description": "Анализ медицинских документов без отмены назначений лечащего врача.",
    "offers": {
      "@type": "Offer",
      "price": priceInt,
      "priceCurrency": "RUB",
      "url": "https://busidopesido.ru/complex-cases"
    }
  };

  return (
    <main>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />

      {/* HERO СЕКЦИЯ */}
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.coal),theme(colors.soldier))] text-white relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4 bg-white/10 border-white/20 text-white shadow-none">СЛОЖНЫЕ СЛУЧАИ</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px] text-white">
              Когда поведение, здоровье и среда связаны
            </h1>
            <p className="text-xl text-oat max-w-[800px] mt-6 leading-relaxed">
              Я работаю со случаями, где реактивность, страх, защитное поведение, нарушения контакта или внезапные изменения поведения могут быть связаны с болью, ЖКТ, зудом, сном, лекарствами, сенсорной нагрузкой и предшествующим опытом.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ФАКТОРЫ (4 ПИЛЛАРА) */}
      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
          {[
            {
              tag: 'Поведение', tagStyle: 'bg-fog text-espresso', icon: ShieldAlert,
              title: 'Реактивность, страх, укусы, охрана',
              desc: 'Функция поведения, уровень риска, триггеры, дистанция и последствия.'
            },
            {
              tag: 'Состояние', tagStyle: 'bg-rose/15 text-rose', icon: Stethoscope,
              title: 'Подозрение на боль',
              desc: 'Сопоставление поведения с медицинскими данными и вопросы для диагностики.'
            },
            {
              tag: 'Среда', tagStyle: 'bg-ice/20 text-coal', icon: Home,
              title: 'Несколько животных',
              desc: 'Ресурсы, маршруты, зоны отдыха, конкуренция и сенсорная нагрузка.'
            },
            {
              tag: 'История', tagStyle: 'bg-matcha/15 text-matcha', icon: HeartHandshake,
              title: 'Нарушенное доверие',
              desc: 'Перестройка процедур, контролируемый выбор и безопасный контакт.'
            }
          ].map((pillar, i) => (
            <ScrollReveal key={i} delay={i} className="h-full">
              <TiltCard 
                className="h-full p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col group"
                initialRotateZ={0}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`tag ${pillar.tagStyle}`}>{pillar.tag}</span>
                  <pillar.icon className="text-forest/30 group-hover:text-forest transition-colors" size={28} />
                </div>
                <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-coal/80 font-medium">
                  {pillar.desc}
                </p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ВТОРОЕ МНЕНИЕ */}
      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(111,143,191,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(198,142,107,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container grid grid-cols-[1.2fr_1fr] max-lg:grid-cols-1 gap-16 items-center">
          <ScrollReveal>
            <TiltCard 
              className="p-[42px] max-md:p-7 rounded-[42px] bg-[radial-gradient(circle_at_82%_10%,rgba(240,114,150,0.17),transparent_27%),linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.12))] shadow-[0_24px_70px_rgba(30,43,14,0.12)] relative overflow-hidden"
              initialRotateZ={-1}
            >
              <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                <FileText size={200} strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <span className="block text-[10px] font-black tracking-[0.14em] text-forest mb-4">SECOND OPINION</span>
                <h3 className="text-[42px] max-md:text-[34px] font-bold text-coal leading-tight mb-4">
                  Ветеринарное второе мнение
                </h3>
                <div className="text-[50px] font-black tracking-tighter text-coal mb-4">
                  {priceText}
                </div>
                <p className="text-coal/80 font-medium text-lg leading-relaxed max-w-[90%]">
                  Анализ документов без отмены назначений лечащего врача. Ищем поведенческий компонент в медицинском случае.
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <div className="max-w-[820px] mb-[32px]">
              <span className="kicker">РАЗБОР ДОКУМЕНТОВ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
                Что входит
              </h2>
            </div>
            <div className="grid gap-3 mb-8">
              {[
                'Анализ проведённой диагностики',
                'Оценка логики назначений',
                'Выявление недостающих данных',
                'Рекомендации по дополнительной диагностике',
                'Направление к профильному врачу'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-forest/10">
                  <div className="w-2 h-2 rounded-full bg-forest shrink-0"></div>
                  <span className="font-[750] text-coal/85 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <Link className="button button-dark" href="/booking?service=second">
              Отправить документы
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ГРАНИЦЫ РАБОТЫ */}
      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[52px]">
            <span className="kicker">ГРАНИЦЫ РАБОТЫ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
              Когда я перенаправляю случай
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {[
              { 
                title: 'Острое ухудшение', 
                icon: AlertTriangle, 
                desc: 'Сначала требуется экстренная клиника, стабилизация и очная диагностика.' 
              },
              { 
                title: 'Высокий риск', 
                icon: Ban, 
                desc: 'Нужен командный формат, дополнительные меры безопасности или иной профиль.' 
              },
              { 
                title: 'Недостаточно данных', 
                icon: Search, 
                desc: 'До поведенческой работы необходимо получить исследования или наблюдения в динамике.' 
              },
              { 
                title: 'Другая специализация', 
                icon: ArrowRightLeft, 
                desc: 'Я объясняю, какой специалист нужен и что подготовить к следующей консультации.' 
              }
            ].map((rule, i) => (
              <ScrollReveal key={i} delay={i} className="h-full">
                <article className="h-full p-7 rounded-[28px] bg-snow border border-forest/10 shadow-[0_16px_45px_rgba(20,20,20,0.03)] hover:shadow-[0_16px_45px_rgba(20,20,20,0.08)] transition-all flex flex-col group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-forest/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <rule.icon className="text-coal/60 group-hover:text-coal transition-colors" size={24} />
                  </div>
                  <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">
                    {rule.title}
                  </h3>
                  <p className="text-coal/80 font-medium leading-relaxed">
                    {rule.desc}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}