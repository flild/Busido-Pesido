import { Metadata } from "next";
import Link from "next/link";
import { FactorCloud } from "@/components/FactorCloud";
import { ApproachTabs } from "@/components/ApproachTabs";
import { StateSlider } from "@/components/StateSlider";
import { IssueCard } from "@/components/IssueCard";
import { Navigator } from "@/components/Navigator";
import { TiltCard } from "@/components/TiltCard";
import { FormatsSection } from "@/components/FormatsSection";
import { CaseInteractive } from "@/components/CaseInteractive";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { FreeConsultationsWidget } from "@/components/FreeConsultationsWidget";
import { LibraryInteractive } from "@/components/LibraryInteractive";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ClinicalBehaviorChart } from "@/components/ClinicalBehaviorChart";
import { FaqItem } from "@/components/FaqItem";

import { db } from "@/lib/db";


const dbCasesRaw = db.prepare('SELECT * FROM cases ORDER BY sort_order ASC').all() as any[];
const dbCases = dbCasesRaw.map(c => ({
  ...c,
  steps: JSON.parse(c.steps)
}));

const dbReviews = db.prepare('SELECT * FROM reviews ORDER BY sort_order ASC').all() as any[];
const dbArticles = db.prepare("SELECT id, slug, category, tag, title, summary FROM articles WHERE status = 'published' ORDER BY created_at DESC").all() as any[];

const mappedArticles = dbArticles.map((art, index) => {
  const colors = [
    { accent: "bg-matcha", textAccent: "text-matcha" },
    { accent: "bg-rose", textAccent: "text-rose" },
    { accent: "bg-ice", textAccent: "text-ice" },
    { accent: "bg-caramel", textAccent: "text-caramel" },
  ];
  return { ...art, ...colors[index % colors.length] };
});

const navRow = db.prepare("SELECT value FROM settings WHERE key = 'navigator_steps'").get() as { value: string } | undefined;
const dbNavSteps = navRow ? JSON.parse(navRow.value) : [];

export const metadata: Metadata = {
  title: "Главная — Busido-Pesido",
  description: "Busido-Pesido — поведение, состояние и благополучие животных.",
  alternates: {
    canonical: "https://busidopesido.ru",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Busido-Pesido",
    image: "https://busidopesido.ru/og-image.jpg",
    description:
      "Помощь владельцам собак и кошек в решении проблем поведения. Анализ состояния, среды и истории обучения.",
    url: "https://busidopesido.ru",
    telephone: "",
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
    },
    founder: {
      "@type": "Person",
      name: "Ярослава Ковалевская",
      jobTitle: "Ветеринарный врач, зоотехник-кинолог, зоопсихолог",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 55.7558,
        longitude: 37.6173,
      },
      geoRadius: 1000,
    },
    priceRange: "$$",
  };

  const dbFormats = db.prepare('SELECT * FROM services ORDER BY sort_order').all() as any[];
  const dbSchedule = db.prepare('SELECT * FROM free_schedule ORDER BY day_number ASC').all() as any[];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <section className="relative overflow-hidden pt-[108px] pb-[74px] bg-[radial-gradient(circle_at_8%_22%,rgba(240,114,150,0.18),transparent_21rem),radial-gradient(circle_at_88%_12%,rgba(111,143,191,0.22),transparent_24rem),radial-gradient(circle_at_72%_86%,rgba(198,142,107,0.18),transparent_22rem),linear-gradient(145deg,theme(colors.snow),rgba(230,218,207,0.72)_48%,theme(colors.snow))] before:absolute before:w-[170px] before:h-[170px] before:rounded-full before:bg-gradient-to-br before:from-rose/70 before:to-berry/20 before:blur-[1px] before:animate-float-blob before:-left-[55px] before:top-[90px] before:pointer-events-none after:absolute after:w-[120px] after:h-[120px] after:rounded-full after:bg-gradient-to-br after:from-ice/60 after:to-matcha/20 after:blur-[1px] after:animate-float-blob after:right-[5%] after:-bottom-[42px] after:pointer-events-none after:[animation-delay:-4s]">
        <div className="container grid grid-cols-[1.05fr_0.95fr] gap-[78px] items-center mobile:grid-cols-1 mobile:gap-6 relative z-10">
          <div>
            <span className="eyebrow">Ветеринарное поведение · Этология · Обучение</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90">
              Поведение животного начинается с состояния
            </h1>
            <p className="text-xl text-matcha max-w-[800px]">
              Я помогаю владельцам собак и кошек понять, что поддерживает сложное поведение, снизить фоновую нагрузку и выстроить понятный план работы, который учитывает здоровье, нервную систему, среду, историю обучения и отношения с человеком.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-7">
              <Link className="button button-primary" href="/booking">Выбрать формат работы</Link>
              <Link className="button button-ghost" href="/services">Услуги и цены</Link>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-7">
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/70">7 лет практики</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-caramel/20">150+ отзывов</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-ice/20">Член RVBA</span>
            </div>
          </div>
          
          <div className="min-h-[380px] flex items-center justify-center relative">
            <span className="absolute z-10 px-4 py-3 rounded-full text-white font-black shadow-xl bg-gradient-rose top-5 right-0 rotate-3">Сначала состояние</span>
            <span className="absolute z-10 px-4 py-3 rounded-full text-white font-black shadow-xl bg-gradient-to-br from-ice to-matcha bottom-[50px] -left-2.5 -rotate-3">Контекст важен</span>
            
            <TiltCard 
              className="w-full max-w-[470px] p-[42px] mobile:p-7 rounded-[42px] text-white shadow-[0_45px_90px_rgba(30,43,14,0.28)] bg-[radial-gradient(circle_at_83%_13%,rgba(198,142,107,0.34),transparent_30%),linear-gradient(145deg,theme(colors.soldier),theme(colors.coal)_72%)] border border-snow/10 relative overflow-hidden"
              initialRotateZ={2}
            >
              <span className="micro text-forest">BUSIDO-PESIDO METHOD</span>
              <h3 className="text-[42px] mobile:text-[32px] my-4 relative z-10">Я вижу больше, чем одну реакцию</h3>
              <FactorCloud />
              
              <div className="h-[90px] flex items-end gap-2.5 mt-[30px] relative z-10">
                <i className="flex-1 rounded-full bg-matcha h-[35%]"></i>
                <i className="flex-1 rounded-full bg-caramel h-[65%]"></i>
                <i className="flex-1 rounded-full bg-rose h-[48%]"></i>
                <i className="flex-1 rounded-full bg-ice h-[90%]"></i>
                <i className="flex-1 rounded-full bg-berry h-[62%]"></i>
                <i className="flex-1 rounded-full bg-oat h-[78%]"></i>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container grid grid-cols-3 gap-4 mobile:grid-cols-1">
          <ScrollReveal delay={0}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[0_28px_60px_rgba(30,43,14,0.17)] bg-gradient-green">
              <span className="font-bold">01</span>
              <h3 className="text-[30px] mt-10 mb-3.5">Сначала состояние</h3>
              <p>Оцениваю сон, боль, зуд, работу ЖКТ, сенсорную нагрузку, лекарства и способность восстанавливаться.</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[0_28px_60px_rgba(30,43,14,0.17)] bg-gradient-warm">
              <span className="font-bold text-espresso">02</span>
              <h3 className="text-[30px] mt-10 mb-3.5 text-espresso">Затем среда</h3>
              <p className="text-espresso">Ищу факторы, которые ежедневно поддерживают напряжение, возбуждение, избегание или конфликт.</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:-rotate-[0.5deg] hover:shadow-[0_28px_60px_rgba(30,43,14,0.17)] bg-gradient-to-br from-ice via-berry to-rose">
              <span className="font-bold">03</span>
              <h3 className="text-[30px] mt-10 mb-3.5">После — обучение</h3>
              <p>Подбираю навыки, доступные конкретному животному и сохраняющиеся в реальной жизни.</p>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-[92px] mobile:py-[64px]">
        <div className="container grid grid-cols-2 gap-16 items-center mobile:grid-cols-1">
          <div className="relative">
            <div className="min-h-[560px] mobile:min-h-[430px] rounded-[42px] p-8 flex items-end shadow-2xl relative overflow-hidden bg-[radial-gradient(circle_at_18%_16%,rgba(111,143,191,0.63),transparent_26%),radial-gradient(circle_at_82%_25%,rgba(240,114,150,0.48),transparent_25%),radial-gradient(circle_at_72%_82%,rgba(198,142,107,0.58),transparent_30%),linear-gradient(145deg,theme(colors.fog),theme(colors.snow))] after:absolute after:inset-[22px] after:rounded-[34px] after:border after:border-forest/10 after:pointer-events-none">
              <strong className="text-[30px] max-w-[13ch] relative z-10">Место для фотографии Ярославы в работе</strong>
            </div>
            <div className="absolute right-[-18px] bottom-8 p-4 bg-white rounded-2xl shadow-xl font-[850] max-w-[285px] mobile:relative mobile:right-auto mobile:bottom-auto mobile:-mt-5 mobile:mx-3.5">
              Ветеринарный врач · зоотехник-кинолог · специалист по поведению животных
            </div>
          </div>
          <div>
            <ScrollReveal className="max-w-[820px] mb-[42px]">
              <span className="kicker">ОБО МНЕ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                Я работаю на стыке поведения, здоровья и среды
              </h2>
            </ScrollReveal>
            <p className="text-xl text-matcha mb-4">
              Меня зовут Ярослава Ковалевская. Я окончила ВГАВМ по специальности ветеринарный врач и РГУНХ по квалификации зоотехник-кинолог. Работала в ветеринарных клиниках, Минском государственном зоопарке, с животными экзотариума и крупными хищниками, затем перешла в частную практику.
            </p>
            <p className="mb-6">
              В каждом случае я собираю анамнез, анализирую состояние животного, условия жизни, режим, нагрузку, предшествующий опыт и последствия поведения. Это помогает отличить задачу обучения от проблемы состояния и вовремя направить животное на дополнительную диагностику.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-6">
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/60">Ветеринарный врач</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-caramel/20">Зоотехник-кинолог</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-ice/20">Член RVBA</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-rose/15">Преподавание и лекции</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/60">Авторские материалы</span>
            </div>
            <p>
              <Link className="font-[950] text-forest hover:text-espresso transition-colors" href="/complex-cases">
                Как я разбираю сложные случаи →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">ПОДХОД</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Поведение складывается из нескольких систем
            </h2>
            <p className="text-fog">
              Команда может быть известна собаке и оставаться недоступной в конкретном состоянии. Поэтому я работаю с причинами, условиями и навыками одновременно.
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap items-center gap-2.5 my-9">
            <span className="px-4 py-3 rounded-full bg-white/10 font-black">состояние</span>
            <b className="text-caramel text-2xl">+</b>
            <span className="px-4 py-3 rounded-full bg-white/10 font-black">среда</span>
            <b className="text-caramel text-2xl">+</b>
            <span className="px-4 py-3 rounded-full bg-white/10 font-black">история</span>
            <b className="text-caramel text-2xl">+</b>
            <span className="px-4 py-3 rounded-full bg-white/10 font-black">обучение</span>
            <b className="text-caramel text-2xl">+</b>
            <span className="px-4 py-3 rounded-full bg-white/10 font-black">последствия</span>
          </div>
          <div className="grid grid-cols-4 gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
            <ScrollReveal delay={0}>
              <article className="p-6 rounded-3xl bg-white/5 border border-white/10 text-oat border-t-[4px] border-t-matcha">
                <h3 className="text-white">Собираю данные</h3>
                <p>Анкета, видео, медицинские документы, режим, рацион, сон и динамика эпизодов.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <article className="p-6 rounded-3xl bg-white/5 border border-white/10 text-oat border-t-[4px] border-t-caramel">
                <h3 className="text-white">Формирую гипотезы</h3>
                <p>Определяю факторы, которые запускают и поддерживают поведение, включая соматический вклад.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <article className="p-6 rounded-3xl bg-white/5 border border-white/10 text-oat border-t-[4px] border-t-rose">
                <h3 className="text-white">Меняю условия</h3>
                <p>Снижаю перегрузку, выстраиваю дистанцию, восстановление и безопасное управление.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={3}>
              <article className="p-6 rounded-3xl bg-white/5 border border-white/10 text-oat border-t-[4px] border-t-ice">
                <h3 className="text-white">Обучаю навыкам</h3>
                <p>Дроблю задачу, задаю измеримые критерии и корректирую план по реальной динамике.</p>
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ИНТЕРАКТИВНАЯ СХЕМА ПОДХОДА */}
      <section className="py-[92px] mobile:py-[64px] bg-[radial-gradient(circle_at_0_50%,rgba(240,114,150,0.09),transparent_24rem),radial-gradient(circle_at_100%_20%,rgba(111,143,191,0.09),transparent_24rem),theme(colors.snow)]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">ИНТЕРАКТИВНАЯ СХЕМА ПОДХОДА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Этапы остаются частью общего повествования сайта
            </h2>
            <p className="text-xl text-matcha">
              Нажмите на этап, чтобы увидеть, какие данные мы собираем и почему
              работа не начинается с повышения требований к животному.
            </p>
          </ScrollReveal>
          <ApproachTabs />
        </div>
      </section>

      {/* ИНТЕРАКТИВНАЯ ШКАЛА (STATE LAB) */}
      <section className="py-[92px] mobile:py-[64px] bg-[linear-gradient(135deg,rgba(216,211,179,0.42),rgba(247,243,239,0.92)_42%,rgba(111,143,191,0.13))]">
        <div className="container grid grid-cols-[1.05fr_0.95fr] gap-16 items-center tablet:grid-cols-1">
          <StateSlider />
        </div>
      </section>

      {/* С ЧЕМ Я РАБОТАЮ */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">С ЧЕМ Я РАБОТАЮ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Когда поведение стало сложным для животного и семьи
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1">
            <IssueCard
              id="fear"
              num="01"
              title="Страхи и избегание"
              text="Люди, дети, собаки, улица, звуки, транспорт, ветеринарные процедуры."
            />
            <IssueCard
              id="reactivity"
              num="02"
              title="Реактивность и возбуждение"
              text="Лай, рывки, фиксация, фрустрация и трудности восстановления."
            />
            <IssueCard
              id="defense"
              num="03"
              title="Защитное поведение"
              text="Рычание, выпады, укусы, охрана пространства или ресурсов."
            />
            <IssueCard
              id="separation"
              num="04"
              title="Тревога одиночества"
              text="Вокализация, разрушение, слюнотечение, невозможность оставаться без человека."
            />
            <IssueCard
              id="puppy"
              num="05"
              title="Щенки и подростки"
              text="Адаптация, прикусывание, туалет, прогулки, социализация и первые навыки."
            />
            <IssueCard
              id="cats"
              num="06"
              title="Поведение кошек"
              text="Лоток, агрессия, конфликты, контакт, переноска, среда и ресурсы."
            />
          </div>
        </div>
      </section>

      {/* НАВИГАТОР */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">НАВИГАТОР ЗАПРОСА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Ответьте на шесть вопросов и получите рекомендуемый следующий шаг
            </h2>
            <p className="text-xl text-matcha">
              Результат помогает выбрать формат работы, но не является диагнозом
              или автоматическим поведенческим заключением.
            </p>
          </ScrollReveal>
          <Navigator initialSteps={dbNavSteps} />
        </div>
      </section>

      {/* ПОВЕДЕНИЕ И ЗДОРОВЬЕ (MEDICAL) */}
      <section className="py-[92px] mobile:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(111,143,191,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(198,142,107,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container grid grid-cols-2 gap-16 items-center mobile:grid-cols-1">
          <div>
            <ScrollReveal className="max-w-[820px] mb-[42px]">
              <span className="kicker">ПОВЕДЕНИЕ И ЗДОРОВЬЕ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                Когда сначала нужна ветеринарная диагностика
              </h2>
            </ScrollReveal>
            <p className="mb-6">
              Внезапная раздражительность, отказ от прикосновений, нарушения
              сна, снижение аппетита, повторяющиеся проблемы ЖКТ, зуд, хромота и
              новая вокализация могут менять поведение раньше, чем появляется
              очевидный клинический симптом.
            </p>
            <div className="grid gap-2.5 my-8">
              {[
                "Резкое изменение поведения",
                "Чувствительность к прикосновениям",
                "Нарушение сна или аппетита",
                "ЖКТ, зуд, мочеиспускание, движение",
                "Пожилой возраст и когнитивные изменения",
              ].map((item, i) => (
                <span
                  key={i}
                  className="px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm rounded-2xl font-[780] relative pl-[42px] before:content-['✓'] before:absolute before:left-4 before:text-forest before:font-black text-coal"
                >
                  {item}
                </span>
              ))}
            </div>
            <Link className="button button-dark" href="/complex-cases">
              Разобрать сложный случай
            </Link>
          </div>
          
          <ScrollReveal delay={1} className="h-full">
            <ClinicalBehaviorChart />
          </ScrollReveal>
        </div>
      </section>

      <FormatsSection formats={dbFormats} />

{/* ПОСЛЕ КОНСУЛЬТАЦИИ (RESULT) */}
<section className="py-[92px] mobile:py-[64px] bg-white relative overflow-hidden">
  <div className="container relative z-10">
    <ScrollReveal className="max-w-[820px] mb-[52px]">
      <span className="kicker">ПОСЛЕ КОНСУЛЬТАЦИИ</span>
      <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
        У вас остаётся рабочая система
      </h2>
    </ScrollReveal>

    <div className="grid grid-cols-4 gap-5 tablet:grid-cols-2 mobile:grid-cols-1 items-stretch">
      {[
        {
          num: '01',
          title: 'Понятная гипотеза',
          desc: 'Что запускает и поддерживает поведение.',
          accentText: 'text-matcha',
          accentBg: 'bg-matcha',
          gradient: 'from-matcha/10',
          watermark: 'group-hover:text-matcha/[0.07]'
        },
        {
          num: '02',
          title: 'План среды и режима',
          desc: 'Что изменить дома и на прогулке.',
          accentText: 'text-caramel',
          accentBg: 'bg-caramel',
          gradient: 'from-caramel/10',
          watermark: 'group-hover:text-caramel/[0.07]'
        },
        {
          num: '03',
          title: 'Пошаговые упражнения',
          desc: 'Последовательность, критерии и признаки остановки.',
          accentText: 'text-rose',
          accentBg: 'bg-rose',
          gradient: 'from-rose/10',
          watermark: 'group-hover:text-rose/[0.07]'
        },
        {
          num: '04',
          title: 'Маршрут помощи',
          desc: 'Когда нужен ветеринарный врач или другой специалист.',
          accentText: 'text-ice',
          accentBg: 'bg-ice',
          gradient: 'from-ice/10',
          watermark: 'group-hover:text-ice/[0.07]'
        }
      ].map((step, i) => (
        // flex h-full на обертке гарантирует, что карточки растянутся одинаково
        <ScrollReveal key={step.num} delay={i} className="flex h-full">
          <article className="group relative w-full flex flex-col p-8 mobile:p-6 rounded-[28px] bg-snow border border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default hover:-translate-y-1.5">
            
            {/* Анимированный градиент на фоне при наведении */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${step.gradient} to-transparent transition-opacity duration-700 pointer-events-none`} />

            {/* Огромная цифра-водяной знак в углу */}
            <span className={`absolute -bottom-8 -right-4 text-[140px] font-black leading-none text-coal/[0.02] ${step.watermark} transition-colors duration-500 pointer-events-none select-none`}>
              {step.num}
            </span>

            {/* Индикаторная полоска, которая разъезжается */}
            <div className={`absolute top-0 left-0 h-1.5 w-12 ${step.accentBg} rounded-br-full transition-all duration-500 group-hover:w-full`} />

            {/* Контент */}
            <div className="relative z-10 flex flex-col h-full mt-3">
              <strong className={`text-[13px] font-[900] tracking-widest uppercase ${step.accentText} mb-6 block`}>
                Шаг {step.num}
              </strong>
              
              <h3 className="text-[22px] leading-tight mb-4 text-coal">
                {step.title}
              </h3>
              
              {/* mt-auto прибивает текст к низу, если заголовки разной длины */}
              <p className="text-coal/65 leading-relaxed mt-auto">
                {step.desc}
              </p>
            </div>
          </article>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>

      {/* КЕЙСЫ */}
      <section className="py-[92px] mobile:py-[64px]">
      <div className="container">
        <ScrollReveal className="max-w-[820px] mb-[42px]">
          <span className="kicker">КЕЙСЫ</span>
                <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                  История случая раскрывается по этапам анализа
                </h2>
                <p className="text-xl text-matcha">
                  Мы показываем не только результат, но и то, какие данные изменили
                  рабочую гипотезу.
                </p>
              </ScrollReveal>
        <CaseInteractive initialCases={dbCases} />
      </div>
    </section>

      {/* ОТЗЫВЫ */}
            <section className="py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">ОТЗЫВЫ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Более 150 историй владельцев
            </h2>
            <p className="text-xl text-matcha">
              В рабочей версии здесь будут реальные тексты, фотографии животных
              и скриншоты отзывов.
            </p>
          </ScrollReveal>
    <ReviewCarousel initialReviews={dbReviews} />
  </div>
</section>

      {/* БЕСПЛАТНЫЕ КОНСУЛЬТАЦИИ */}
      <section className="py-[92px] mobile:py-[64px] relative overflow-hidden bg-[radial-gradient(circle_at_10%_12%,rgba(240,114,150,0.32),transparent_22rem),radial-gradient(circle_at_90%_90%,rgba(111,143,191,0.28),transparent_23rem),linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white after:absolute after:w-[190px] after:h-[190px] after:right-[3%] after:-top-[80px] after:rounded-full after:bg-gradient-rose after:opacity-45">
        <div className="container relative z-10">
          <div className="grid grid-cols-[1.25fr_0.55fr_auto] gap-9 items-center mobile:grid-cols-1">
            <div>
              <span className="kicker text-white/80">1–7 ЧИСЛА КАЖДОГО МЕСЯЦА</span>
              <h2 className="text-[44px] mobile:text-[34px] leading-tight font-bold text-white mb-4">
                Бесплатные онлайн-консультации
              </h2>
              <p className="text-lg text-white/80 max-w-[500px]">
                Ежедневно 4–5 мест. Одно животное, один основной запрос и 30–40 минут работы.
              </p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-baseline border-l border-white/20 pl-8 max-md:border-none max-md:pl-0">
              <strong className="text-[38px] leading-none font-black text-white">28–35</strong>
              <span className="text-white/80 font-medium">мест в месяц</span>
              <strong className="text-[38px] leading-none font-black text-white">3 дня</strong>
              <span className="text-white/80 font-medium">обратной связи</span>
            </div>
            <Link className="button button-light whitespace-nowrap" href="/free-consultations">
              Полные условия
            </Link>
          </div>
          {/* Вставляем наш обновленный виджет */}
          <FreeConsultationsWidget scheduleData={dbSchedule} />
        </div>
      </section>

      {/* БИБЛИОТЕКА */}
      <section className="py-[92px] mobile:py-[64px] relative bg-[radial-gradient(circle_at_20%_80%,rgba(111,143,191,0.08),transparent_35rem),theme(colors.snow)]">
        <div className="container relative z-10">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">BUSIDO-PESIDO SCHOOL</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
              Авторская библиотека практических материалов
            </h2>
            <p className="text-xl text-matcha mt-4">
              Документы, дневники, чек-листы и руководства для владельцев и
              специалистов.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <LibraryInteractive initialArticles={mappedArticles} />
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container narrow">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">FAQ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Частые вопросы
            </h2>
          </ScrollReveal>
          <div className="grid gap-3">
            {[
              {
                q: "Подойдёт ли консультация, если у животного уже есть ветеринарный врач?",
                a: "Да. Я работаю с поведенческой частью случая, анализирую документы и при необходимости формулирую вопросы для лечащего врача. Назначения другого врача самостоятельно не отменяются.",
              },
              {
                q: "Почему после консультации может понадобиться сопровождение?",
                a: "Разовая консультация даёт гипотезу и план. Сопровождение нужно для регулярной оценки видео, изменения критериев и отслеживания состояния.",
              },
              {
                q: "Можете ли вы отказать в работе?",
                a: "Да. Я перенаправляю случай, когда сначала требуется экстренная ветеринарная помощь, очная диагностика или специалист другой квалификации.",
              },
              {
                q: "Работаете ли вы только через еду?",
                a: "Нет. Я учитываю пищевую, игровую, социальную, исследовательскую и средовую мотивацию, выбор, дистанцию и доступ к восстановлению.",
              }
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container flex items-center justify-between gap-8 p-10 mobile:p-7 rounded-[38px] shadow-2xl bg-[radial-gradient(circle_at_8%_12%,rgba(240,114,150,0.2),transparent_20rem),radial-gradient(circle_at_92%_88%,rgba(111,143,191,0.2),transparent_22rem),linear-gradient(135deg,theme(colors.snow),theme(colors.fog)_48%,rgba(216,211,179,0.75))] relative overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:h-[7px] after:bg-gradient-dopamine mobile:flex-col mobile:items-start">
          <div className="relative z-10">
            <span className="kicker">НАЧАТЬ РАБОТУ</span>
            <h2 className="text-[44px] mobile:text-[34px] max-w-[16ch] leading-[1.05] after:hidden">
              Забронируйте время, затем заполните анкету
            </h2>
            <p className="text-matcha mt-4">
              Анкета занимает около 10 минут благодаря ветвлению. Документы и
              видео можно приложить сразу или дослать позднее.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0 relative z-10 mobile:w-full">
            <Link className="button button-primary mobile:w-full" href="/booking">
              Перейти к записи
            </Link>
            <a className="button button-ghost mobile:w-full" href="#">
              Задать вопрос
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}