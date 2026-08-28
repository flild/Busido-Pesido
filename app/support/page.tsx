import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { CheckCircle2, Video, MapPin, Eye, Brain, Wrench, Route } from 'lucide-react';
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: 'Сопровождение зоопсихолога',
  description: 'Длительное сопровождение зоопсихолога: онлайн и с выездами. Регулярная оценка видео, среды и корректировка плана для собак и кошек.',
  alternates: {
    canonical: 'https://busidopesido.ru/support',
  },
  openGraph: {
    title: 'Сопровождение зоопсихолога',
    description: 'План, который меняется вместе с животным. Длительная работа для сложных случаев.',
    url: 'https://busidopesido.ru/support',
    type: 'website',
  },
};

export default function SupportPage() {
  // ============================================================================
  // ЗАГРУЗКА ДАННЫХ (SSR)
  // ============================================================================
  // Тянем строго из базы и текст для UI, и INT для микроразметки
  const dbOnline = db.prepare("SELECT price, price_int FROM services WHERE id = 'support'").get() as { price: string, price_int: number } | undefined;
  const dbOffline = db.prepare("SELECT price, price_int FROM services WHERE id = 'support_offline'").get() as { price: string, price_int: number } | undefined;

  const onlinePriceText = dbOnline?.price || '22 000 ₽';
  const onlinePriceInt = dbOnline?.price_int || 22000;

  const offlinePriceText = dbOffline?.price || '30 000 ₽';
  const offlinePriceInt = dbOffline?.price_int || 30000;

  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Сопровождение зоопсихолога",
    "description": "Длительное сопровождение для сложных и нестабильных поведенческих случаев у собак и кошек.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Форматы сопровождения",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Онлайн-сопровождение"
          },
          "price": onlinePriceInt, // Берем чистый INT из базы
          "priceCurrency": "RUB"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Сопровождение в реальной среде (с выездами)"
          },
          "price": offlinePriceInt, // Берем чистый INT из базы
          "priceCurrency": "RUB"
        }
      ]
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
          { name: "Поддержка", url: "https://busidopesido.ru/support" }
        ]} 
      />
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.oat),theme(colors.snow)_62%,rgba(111,143,191,0.22))] relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4">СОПРОВОЖДЕНИЕ</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
              План меняется вместе с животным
            </h1>
            <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
              Сопровождение подходит для сложных, длительных и нестабильных случаев, когда важно регулярно оценивать видео, состояние, среды, выполнение заданий и реальную динамику.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
          {/* ОНЛАЙН СОПРОВОЖДЕНИЕ */}
          <ScrollReveal delay={0} className="h-full">
            <TiltCard 
              className="h-full p-10 max-md:p-7 rounded-[38px] border border-oat shadow-[0_24px_70px_rgba(30,43,14,0.12)] bg-[linear-gradient(155deg,theme(colors.fog),theme(colors.white)_60%)] flex flex-col relative overflow-hidden"
              initialRotateZ={0}
            >
              <div className="absolute top-0 right-0 p-8 text-forest/10 pointer-events-none">
                <Video size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="tag mb-4 self-start bg-white/60 backdrop-blur-md">Дистанционно</span>
                <h2 className="text-[36px] max-md:text-[30px] leading-tight mb-2 text-coal font-bold">Онлайн-сопровождение</h2>
                <div className="text-[48px] font-black tracking-tighter text-coal mb-4">{onlinePriceText}</div>
                <p className="text-lg text-forest font-medium mb-8 leading-relaxed">
                  Регулярная работа в течение согласованного периода с домашними заданиями и их проверкой.
                </p>
                <ul className="grid gap-4 mb-8">
                  {[
                    'Стартовая консультация и приоритеты', 
                    'Индивидуальные домашние задания', 
                    'Проверка видео и дневника', 
                    'Корректировка критериев и нагрузки', 
                    'Письменные инструкции после этапов', 
                    'Поддержка по текущим вопросам'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-medium text-coal/85">
                      <CheckCircle2 className="shrink-0 text-matcha mt-0.5" size={20} />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 border-t border-forest/10">
                  <Link className="button button-primary w-full text-center justify-center" href="/booking?service=support">
                    Оставить заявку
                  </Link>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>

          {/* ОФФЛАЙН СОПРОВОЖДЕНИЕ */}
          <ScrollReveal delay={1} className="h-full">
            <TiltCard 
              className="h-full p-10 max-md:p-7 rounded-[38px] border border-forest/15 bg-white shadow-[0_24px_70px_rgba(30,43,14,0.05)] flex flex-col relative overflow-hidden"
              initialRotateZ={0}
            >
              <div className="absolute top-0 right-0 p-8 text-forest/5 pointer-events-none">
                <MapPin size={120} strokeWidth={1} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="tag mb-4 self-start bg-snow">С выездами</span>
                <h2 className="text-[36px] max-md:text-[30px] leading-tight mb-2 text-coal font-bold">Работа в реальной среде</h2>
                <div className="text-[48px] font-black tracking-tighter text-coal mb-4">{offlinePriceText}</div>
                <p className="text-lg text-forest font-medium mb-8 leading-relaxed">
                  Для случаев, где необходимо регулярно видеть прогулку, дом, общие пространства или взаимодействия.
                </p>
                <ul className="grid gap-4 mb-8">
                  {[
                    'Все элементы онлайн-сопровождения', 
                    'Очные наблюдения и практическая работа', 
                    'Настройка среды на месте', 
                    'Разбор взаимодействий семьи', 
                    'Корректировка управления', 
                    'План между выездами'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-medium text-coal/85">
                      <CheckCircle2 className="shrink-0 text-caramel mt-0.5" size={20} />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 border-t border-forest/10">
                  <Link className="button button-dark w-full text-center justify-center" href="/booking?service=offline">
                    Оставить заявку
                  </Link>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ЦИКЛ СОПРОВОЖДЕНИЯ */}
      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[52px]">
            <span className="kicker text-white/80">КАК УСТРОЕНА РАБОТА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
              Один цикл сопровождения
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {[
              { num: '01', title: 'Наблюдение', icon: Eye, borderColor: 'border-t-matcha', desc: 'Вы присылаете видео, дневник, изменения состояния и фактическое выполнение плана.' },
              { num: '02', title: 'Анализ', icon: Brain, borderColor: 'border-t-caramel', desc: 'Я оцениваю, что стало доступнее, где выросла нагрузка и какие гипотезы требуют пересмотра.' },
              { num: '03', title: 'Корректировка', icon: Wrench, borderColor: 'border-t-rose', desc: 'Меняем среду, управление, критерии, упражнения или медицинский маршрут.' },
              { num: '04', title: 'Следующий шаг', icon: Route, borderColor: 'border-t-ice', desc: 'Фиксируем измеримую задачу и признаки, при которых работу нужно остановить.' },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i} className="h-full">
                <article className={`h-full p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat border-t-4 ${step.borderColor} hover:bg-white/10 transition-colors`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-oat font-black text-2xl opacity-50">{step.num}</span>
                    <step.icon className="text-white/60" size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[24px] mb-3 text-white font-bold leading-tight">{step.title}</h3>
                  <p className="text-oat/80 leading-relaxed font-medium">{step.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ТРЕБОВАНИЯ К ФОРМАТУ */}
      <section className="py-[92px] max-md:py-[64px] bg-white">
        <div className="container flex justify-center">
          <ScrollReveal>
            <div className="p-8 max-md:p-6 rounded-[32px] bg-snow border border-forest/10 shadow-[0_16px_45px_rgba(20,20,20,0.03)] relative overflow-hidden max-w-[700px] w-full">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-matcha/10 rounded-full blur-2xl"></div>
              <h3 className="text-[26px] mb-6 text-coal font-bold relative z-10 text-center">Успешное сопровождение требует:</h3>
              <div className="grid gap-3 relative z-10">
                {[
                  'Регулярных коротких отчётов', 
                  'Видео реальных эпизодов', 
                  'Выполнения согласованных заданий', 
                  'Сообщения об изменениях здоровья', 
                  'Готовности менять план по объективным данным'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-[20px] shadow-sm border border-forest/5">
                    <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <span className="text-forest font-black text-sm">{i + 1}</span>
                    </div>
                    <span className="font-[750] text-coal/85 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}