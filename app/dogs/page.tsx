import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { 
  Activity, 
  ShieldAlert, 
  Home, 
  AlertCircle, 
  Trees, 
  GraduationCap,
  Stethoscope,
  Map,
  HeartHandshake,
  Volume2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Зоопсихолог для собак: коррекция поведения, агрессия, страхи',
  description: 'Помощь зоопсихолога при проблемах поведения собак. Реактивность, агрессия, сепарационная тревога, натянутый поводок и страхи.',
  alternates: {
    canonical: "https://busidopesido.ru/dogs",
  },
  openGraph: {
    title: 'Зоопсихолог для собак',
    description: 'Комплексная работа с поведением собак. Снижаем реактивность, выстраиваем контакт и комфортные прогулки.',
    url: 'https://busidopesido.ru/dogs',
    type: 'website',
  },
};

const dogIssues = [
  { num: '01', title: 'Реактивность', text: 'Лай, рывки, фиксация на триггере, неспособность переключиться на владельца.', accent: 'bg-rose', textAccent: 'text-rose', icon: Activity, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(240,114,150,0.12))]' },
  { num: '02', title: 'Тревога разлуки', text: 'Вой, разрушение квартиры, нечистоплотность дома при расставании.', accent: 'bg-espresso', textAccent: 'text-espresso', icon: Home, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.15))]' },
  { num: '03', title: 'Агрессия', text: 'Охрана ресурса (еды, игрушек), защита территории, выпады на собак и людей.', accent: 'bg-coal', textAccent: 'text-coal', icon: ShieldAlert, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(20,20,20,0.08))]' },
  { num: '04', title: 'Страхи и фобии', text: 'Гроза, салюты, транспорт, незнакомые люди, отказ выходить на улицу.', accent: 'bg-ice', textAccent: 'text-ice', icon: AlertCircle, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.13))]' },
  { num: '05', title: 'Прогулка', text: 'Натянутый поводок, подбор с земли, невозможность расслабиться вне дома.', accent: 'bg-matcha', textAccent: 'text-matcha', icon: Trees, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(216,211,179,0.28))]' },
  { num: '06', title: 'Щенки и подростки', text: 'Адаптация дома, социализация, прикусывание, туалет и первые навыки.', accent: 'bg-caramel', textAccent: 'text-caramel', icon: GraduationCap, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.14))]' }
];

export default function DogsPage() {
  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Зоопсихолог для собак",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "description": "Профессиональная помощь в решении поведенческих проблем у собак: агрессия, страхи, реактивность, натянутый поводок, сепарационная тревога.",
    "url": "https://busidopesido.ru/dogs"
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
                { name: "О собаках", url: "https://busidopesido.ru/dogs" }
              ]} 
            />

      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.fog),theme(colors.snow)_52%,rgba(111,143,191,0.18))] relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4">ПОВЕДЕНИЕ СОБАК</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
              Собака реагирует на среду, состояние и историю обучения
            </h1>
            <p className="text-xl text-coal/80 max-w-[800px] mt-6 leading-relaxed font-medium">
              Невозможно «отдрессировать» боль или страх. Я помогаю снизить фоновую нагрузку, выстроить безопасную среду, проверить здоровье и только после этого подбираю план обучения и тренировок.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
          {[
            { title: 'Физиология и боль', icon: Stethoscope, text: 'Оцениваю влияние ЖКТ, зуда, боли и гормонов на текущее поведение.' },
            { title: 'Среда и амуниция', icon: Map, text: 'Проверяю длину поводка, маршруты, режим сна и повседневную рутину.' },
            { title: 'Понятная коммуникация', icon: Volume2, text: 'Учимся читать язык тела собаки и вовремя замечать сигналы дискомфорта.' },
            { title: 'Навыки и расслабление', icon: HeartHandshake, text: 'Подбираю упражнения, доступные собаке в конкретном эмоциональном состоянии.' },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i} className="h-full">
              <TiltCard 
                className="h-full p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col group"
                initialRotateZ={0}
              >
                <div className="w-12 h-12 rounded-2xl bg-fog/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="text-coal/70 group-hover:text-coal transition-colors" size={24} />
                </div>
                <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">{item.title}</h3>
                <p className="text-coal/80 font-medium">{item.text}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(198,142,107,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(111,143,191,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[52px]">
            <span className="kicker">С ЧЕМ Я РАБОТАЮ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
              Запросы владельцев собак
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {dogIssues.map((issue, idx) => (
              <ScrollReveal key={idx} delay={idx} className="h-full">
                <TiltCard 
                  className={`h-full relative p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-[0_26px_60px_rgba(30,43,14,0.13)] group flex flex-col ${issue.hoverBg}`}
                  initialRotateZ={0}
                >
                  <div className={`absolute left-0 right-0 top-0 h-[6px] ${issue.accent}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className={`block text-[24px] font-black ${issue.textAccent}`}>{issue.num}</span>
                    <issue.icon className={`opacity-20 group-hover:opacity-100 transition-opacity duration-300 ${issue.textAccent}`} size={32} />
                  </div>
                  
                  <h3 className="text-[25px] font-bold text-coal leading-tight mb-3">{issue.title}</h3>
                  <p className="text-coal/80 text-[15px] font-medium leading-relaxed mb-6">{issue.text}</p>
                  
                  <div className={`mt-auto text-[10px] tracking-[0.11em] uppercase font-[800] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${issue.textAccent}`}>
                    Узнать больше →
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-center justify-between gap-8 p-10 max-md:p-7 rounded-[38px] shadow-2xl bg-[radial-gradient(circle_at_8%_12%,rgba(240,114,150,0.2),transparent_20rem),radial-gradient(circle_at_92%_88%,rgba(111,143,191,0.2),transparent_22rem),linear-gradient(135deg,theme(colors.snow),theme(colors.fog)_48%,rgba(216,211,179,0.75))] relative overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:h-[7px] after:bg-gradient-dopamine max-md:flex-col max-md:items-start">
              <div className="relative z-10">
                <span className="kicker">КОНСУЛЬТАЦИЯ</span>
                <h2 className="text-[44px] max-md:text-[34px] max-w-[16ch] leading-[1.05] font-bold text-coal mt-4 mb-4">
                  Подготовьте видео с прогулки и из дома
                </h2>
                <p className="text-matcha text-lg max-w-[600px] font-medium">
                  Для анализа реактивности и страхов мне важно увидеть, как работает амуниция, какая длина поводка и как собака движется до встречи с триггером.
                </p>
              </div>
              <div className="relative z-10 shrink-0 max-md:w-full">
                <Link className="button button-primary max-md:w-full flex justify-center" href="/booking?service=online&pet=dog">
                  Записаться
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}