import { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { 
  CheckCircle2, 
  Map, 
  Activity, 
  ArrowRightLeft, 
  Target 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Супервизия и разбор случаев для специалистов',
  description: 'Профессиональный разбор сложных поведенческих кейсов собак и кошек для кинологов, ветеринарных врачей, фелинологов и специалистов по поведению.',
  alternates: {
    canonical: "https://busidopesido.ru/professionals",
  },
  openGraph: {
    title: 'Супервизия и разбор случаев',
    description: 'Профессиональный разбор поведенческих кейсов для специалистов.',
    url: 'https://busidopesido.ru/professionals',
    type: 'website',
  },
};

export default function ProfessionalsPage() {
  // ============================================================================
  // ЗАГРУЗКА ДАННЫХ (SSR)
  // ============================================================================
  // Пытаемся достать цену из БД, если услуга заведена. Иначе fallback.
  const dbService = db.prepare("SELECT price, price_int FROM services WHERE id = 'professional'").get() as { price: string, price_int: number } | undefined;
  
  const priceText = dbService?.price || '3 000 ₽';
  const priceInt = dbService?.price_int || 3000;

  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Супервизия для специалистов",
    "name": "Профессиональный разбор поведенческих случаев",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "description": "Супервизия для кинологов, ветеринарных врачей и фелинологов. Разбор сложных поведенческих кейсов собак и кошек.",
    "offers": {
      "@type": "Offer",
      "price": priceInt,
      "priceCurrency": "RUB",
      "url": "https://busidopesido.ru/professionals"
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
          { name: "Супервизия для специалистов", url: "https://busidopesido.ru/professionals" }
        ]} 
      />
      {/* HERO СЕКЦИЯ */}
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.coal),theme(colors.soldier))] text-white relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4 bg-white/10 border-white/20 text-white shadow-none">СПЕЦИАЛИСТАМ</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[900px] text-white">
              Профессиональный разбор случая без сведения работы к одному упражнению
            </h1>
            <p className="text-xl text-oat max-w-[800px] mt-6 leading-relaxed font-medium">
              Формат для кинологов, специалистов по поведению, ветеринарных врачей, фелинологов, сотрудников приютов и студентов профильных направлений.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ОПИСАНИЕ И ЧТО ПОДГОТОВИТЬ */}
      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-[1.1fr_1fr] max-lg:grid-cols-1 gap-16 items-center">
          <ScrollReveal>
            <TiltCard 
              className="p-10 max-md:p-7 rounded-[38px] border border-oat shadow-[0_24px_70px_rgba(30,43,14,0.12)] bg-[linear-gradient(155deg,theme(colors.fog),theme(colors.white)_60%)] flex flex-col h-full relative overflow-hidden"
              initialRotateZ={0}
            >
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-matcha/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <span className="tag mb-4 self-start bg-white/60 backdrop-blur-md">Профессиональный разбор</span>
                <h2 className="text-[50px] max-md:text-[40px] font-black tracking-tighter text-coal mb-4">
                  {priceText}
                </h2>
                <p className="text-lg text-forest font-medium mb-8 leading-relaxed">
                  Специалист присылает полный случай, уже выполненные действия и материалы. Я помогаю увидеть пропущенные факторы, пересобрать гипотезы и составить дальнейший план.
                </p>
                <div className="mt-auto">
                  <Link className="button button-primary w-full text-center justify-center" href="/booking?service=professional">
                    Записаться
                  </Link>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <div className="max-w-[820px] mb-[32px]">
              <span className="kicker">ЧТО ПОДГОТОВИТЬ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
                Материалы случая
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                'Анамнез и основной запрос',
                'Медицинские данные',
                'Видео эпизодов и обычной жизни',
                'Предшествующие вмешательства',
                'Динамика и показатели прогресса',
                'Ваши гипотезы и вопросы'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 bg-snow/80 backdrop-blur-sm rounded-2xl shadow-sm border border-forest/5">
                  <CheckCircle2 className="text-forest shrink-0" size={22} strokeWidth={2.5} />
                  <span className="font-[750] text-coal/85 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ФОКУС РАЗБОРА */}
      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[52px]">
            <span className="kicker text-white/80">ФОКУС РАЗБОРА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
              Что мы пересобираем
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {[
              { title: 'Контекст', icon: Map, color: 'border-t-matcha', desc: 'Где, когда, с кем и после каких событий появляется поведение.' },
              { title: 'Состояние', icon: Activity, color: 'border-t-caramel', desc: 'Сон, боль, ЖКТ, сенсорная нагрузка, возбуждение и лекарства.' },
              { title: 'Последствия', icon: ArrowRightLeft, color: 'border-t-rose', desc: 'Что получает или прекращает животное и какие реакции закрепляются.' },
              { title: 'Критерии', icon: Target, color: 'border-t-ice', desc: 'Какие изменения измерять и когда необходимо снижать сложность.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i} className="h-full">
                <article className={`h-full p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat border-t-4 ${item.color} hover:bg-white/10 transition-colors flex flex-col`}>
                  <item.icon className="text-white/60 mb-5" size={32} strokeWidth={1.5} />
                  <h3 className="text-[23px] mb-3 text-white font-bold leading-tight">{item.title}</h3>
                  <p className="text-oat/90 leading-relaxed text-[15px]">{item.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}