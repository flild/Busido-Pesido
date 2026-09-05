import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TiltCard } from '@/components/TiltCard';
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { 
  Box, 
  Swords, 
  Users, 
  AlertCircle, 
  Moon, 
  Scissors,
  LayoutTemplate,
  HandHeart,
  SplitSquareHorizontal,
  Stethoscope
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Зоопсихолог для кошек: коррекция поведения, агрессия, лоток',
  description: 'Помощь зоопсихолога при проблемах поведения кошек. Решение проблем с лотком, агрессией, страхами, ночной активностью и конфликтами между животными.',
  alternates: {
    canonical: "https://busidopesido.ru/cats",
  },
  openGraph: {
    title: 'Зоопсихолог для кошек',
    description: 'Решение проблем с лотком, агрессией, конфликтами и адаптацией кошек. Работа со средой и состоянием.',
    url: 'https://busidopesido.ru/cats',
    type: 'website',
  },
};

const catIssues = [
  { num: '01', title: 'Лоток', text: 'Отказ, выбор поверхности, маркировка, боль, доступность и конфликт.', accent: 'bg-matcha', textAccent: 'text-matcha', icon: Box, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(216,211,179,0.28))]' },
  { num: '02', title: 'Агрессия', text: 'К людям, кошкам, собакам, при прикосновениях или ограничении движения.', accent: 'bg-rose', textAccent: 'text-rose', icon: Swords, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(240,114,150,0.12))]' },
  { num: '03', title: 'Конфликт кошек', text: 'Скрытая блокировка, преследование и восстановление контактов.', accent: 'bg-espresso', textAccent: 'text-espresso', icon: Users, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.15))]' },
  { num: '04', title: 'Страх и адаптация', text: 'Переезд, гости, транспорт, переноска и новые животные.', accent: 'bg-ice', textAccent: 'text-ice', icon: AlertCircle, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.13))]' },
  { num: '05', title: 'Ночная активность', text: 'Режим, кормление, нагрузка и медицинские причины вокализации.', accent: 'bg-berry', textAccent: 'text-berry', icon: Moon, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(240,114,150,0.1))]' },
  { num: '06', title: 'Бытовые процедуры', text: 'Когти, таблетки, расчёсывание, осмотр и кооперативный уход.', accent: 'bg-caramel', textAccent: 'text-caramel', icon: Scissors, hoverBg: 'hover:bg-[linear-gradient(145deg,theme(colors.white),rgba(198,142,107,0.14))]' }
];

export default function CatsPage() {
  // ============================================================================
  // SEO И МИКРОРАЗМЕТКА (JSON-LD)
  // ============================================================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Зоопсихолог для кошек",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Busido-Pesido"
    },
    "description": "Профессиональная помощь в решении поведенческих проблем у кошек: агрессия, проблемы с лотком, ночная вокализация, конфликты в семье.",
    "url": "https://busidopesido.ru/cats"
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
                { name: "О котах", url: "https://busidopesido.ru/cats" }
              ]} 
            />

      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.oat),theme(colors.snow)_52%,rgba(198,142,107,0.28))] relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4">ПОВЕДЕНИЕ КОШЕК</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-rose after:opacity-90 max-w-[820px]">
              Кошка управляет дистанцией, ресурсами и темпом контакта
            </h1>
            <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
              Я помогаю разобраться в поведении кошки через состояние, боль, среду, распределение ресурсов, социальные отношения и индивидуальную историю.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
          {[
            { title: 'Сначала среда', icon: LayoutTemplate, text: 'Высота, укрытия, маршруты, лотки, вода, еда, когтеточки и переноска.' },
            { title: 'Контакт по согласию', icon: HandHeart, text: 'Наблюдение за стартом, продолжением и завершением взаимодействия.' },
            { title: 'Ресурсы разделены', icon: SplitSquareHorizontal, text: 'Доступность ресурсов оценивается для каждой кошки отдельно.' },
            { title: 'Соматический вклад', icon: Stethoscope, text: 'Боль, мочевыделительная система, ЖКТ, зубы, кожа и возраст.' },
          ].map((item, i) => (
            <ScrollReveal key={i} delay={i} className="h-full">
              <TiltCard 
                className="h-full p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col group"
                initialRotateZ={0}
              >
                <div className="w-12 h-12 rounded-2xl bg-oat/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="text-coal/70 group-hover:text-coal transition-colors" size={24} />
                </div>
                <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">{item.title}</h3>
                <p className="text-coal/80 font-medium">{item.text}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(111,143,191,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(198,142,107,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[52px]">
            <span className="kicker">С ЧЕМ Я РАБОТАЮ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-matcha">
              Запросы владельцев кошек
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {catIssues.map((issue, idx) => (
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
            <div className="flex items-center justify-between gap-8 p-10 max-md:p-7 rounded-[38px] shadow-2xl bg-[radial-gradient(circle_at_8%_12%,rgba(240,114,150,0.2),transparent_20rem),radial-gradient(circle_at_92%_88%,rgba(111,143,191,0.2),transparent_22rem),linear-gradient(135deg,theme(colors.snow),theme(colors.fog)_48%,rgba(216,211,179,0.75))] relative overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:h-[7px] after:bg-rose max-md:flex-col max-md:items-start">
              <div className="relative z-10">
                <span className="kicker">КОНСУЛЬТАЦИЯ</span>
                <h2 className="text-[44px] max-md:text-[34px] max-w-[16ch] leading-[1.05] font-bold text-coal mt-4 mb-4">
                  Подготовьте короткие видео и схему дома
                </h2>
                <p className="text-matcha text-lg max-w-[600px] font-medium">
                  Для кошачьего случая особенно важны расположение ресурсов, маршруты, укрытия и высота.
                </p>
              </div>
              <div className="relative z-10 shrink-0 max-md:w-full">
                <Link className="button button-primary max-md:w-full flex justify-center" href="/booking?service=online&pet=cat">
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