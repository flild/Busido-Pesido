import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

export const metadata: Metadata = {
  title: "Главная — Бусидо-Пёсидо",
  description: "Бусидо-Пёсидо — команда специалистов по поведению, состоянию и благополучию животных.",
  alternates: {
    canonical: "https://busidopesido.ru",
  },
};

export default function Home() {
  // ============================================================================
  // ЗАГРУЗКА ДАННЫХ
  // ============================================================================
  // Достаем всех активных специалистов, чтобы вывести их на главной (Ярослава + Врач)
  const dbMainSpecialist = db.prepare('SELECT * FROM specialists WHERE is_main = 1 LIMIT 1').get() as any;
  
  const dbFormats = db.prepare('SELECT * FROM services ORDER BY sort_order').all() as any[];
  const dbSchedule = db.prepare('SELECT * FROM free_schedule ORDER BY day_number ASC').all() as any[];

  const dbCasesRaw = db.prepare('SELECT * FROM cases ORDER BY sort_order ASC').all() as any[];
  const dbCases = dbCasesRaw.map(c => ({
    ...c,
    steps: JSON.parse(c.steps)
  }));

  const dbReviews = db.prepare('SELECT * FROM reviews ORDER BY sort_order ASC').all() as any[];

  // Статьи для библиотеки (Умная ротация)
  const freshArticles = db.prepare(`
    SELECT id, slug, category, tag, title, summary, main_image 
    FROM articles 
    WHERE status = 'published' 
    ORDER BY created_at DESC 
    LIMIT 2
  `).all() as any[];

  const freshIds = freshArticles.map(a => a.id);
  let popularArticles: any[] = [];

  if (freshIds.length > 0) {
    const placeholders = freshIds.map(() => '?').join(',');
    popularArticles = db.prepare(`
      SELECT id, slug, category, tag, title, summary, main_image 
      FROM articles 
      WHERE status = 'published' AND id NOT IN (${placeholders})
      ORDER BY (reads_count * 2 + views) DESC 
      LIMIT 1
    `).all(...freshIds) as any[];
  } else {
    popularArticles = db.prepare(`
      SELECT id, slug, category, tag, title, summary, main_image 
      FROM articles 
      WHERE status = 'published'
      ORDER BY (reads_count * 2 + views) DESC 
      LIMIT 3
    `).all() as any[];
  }

  const dbArticlesRaw = [...freshArticles, ...popularArticles].slice(0, 3);
  const mappedArticles = dbArticlesRaw.map((art, index) => {
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
  const reviewsCount = dbReviews.length > 0 ? dbReviews.length : 150; 

  const faqData = [
    {
      q: "Подойдёт ли консультация, если у животного уже есть ветеринарный врач?",
      a: "Да. Мы работаем с поведенческой частью случая, анализируем документы и при необходимости формулируем вопросы для лечащего врача. Назначения вашего врача самостоятельно не отменяются.",
    },
    {
      q: "Почему после консультации может понадобиться сопровождение?",
      a: "Разовая консультация даёт гипотезу и план. Сопровождение нужно для регулярной оценки видео, изменения критериев и отслеживания состояния в динамике.",
    },
    {
      q: "Можете ли вы отказать в работе?",
      a: "Да. Мы перенаправляем случай, когда сначала требуется экстренная ветеринарная помощь, очная диагностика или специалист другой квалификации.",
    },
    {
      q: "Работаете ли вы только через еду?",
      a: "Нет. Мы учитываем пищевую, игровую, социальную, исследовательскую и средовую мотивацию, а также выбор, безопасную дистанцию и доступ к восстановлению.",
    }
  ];

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Бусидо-Пёсидо",
    image: "https://busidopesido.ru/og-image.jpg",
    description: "Помощь владельцам собак и кошек в решении проблем поведения. Анализ состояния, среды и истории обучения.",
    url: "https://busidopesido.ru",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: reviewsCount,
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
      
      {/* ГЕРОЙ-БЛОК */}
      <section className="relative overflow-hidden pt-[108px] pb-[74px] bg-[radial-gradient(circle_at_8%_22%,rgba(240,114,150,0.18),transparent_21rem),radial-gradient(circle_at_88%_12%,rgba(111,143,191,0.22),transparent_24rem),radial-gradient(circle_at_72%_86%,rgba(198,142,107,0.18),transparent_22rem),linear-gradient(145deg,theme(colors.snow),rgba(230,218,207,0.72)_48%,theme(colors.snow))] before:absolute before:w-[170px] before:h-[170px] before:rounded-full before:bg-gradient-to-br before:from-rose/70 before:to-berry/20 before:blur-[1px] before:animate-float-blob before:-left-[55px] before:top-[90px] before:pointer-events-none after:absolute after:w-[120px] after:h-[120px] after:rounded-full after:bg-gradient-to-br after:from-ice/60 after:to-matcha/20 after:blur-[1px] after:animate-float-blob after:right-[5%] after:-bottom-[42px] after:pointer-events-none after:[animation-delay:-4s]">
        <div className="container grid grid-cols-[1.05fr_0.95fr] gap-[78px] items-center mobile:grid-cols-1 mobile:gap-6 relative z-10">
          <div>
            <span className="eyebrow">Ветеринарное поведение · Этология · Обучение</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90">
              Поведение животного начинается с состояния
            </h1>
            <p className="text-xl text-matcha max-w-[800px]">
              Мы помогаем владельцам собак и кошек понять, что поддерживает сложное поведение, снизить фоновую нагрузку и выстроить понятный план работы, который учитывает здоровье, нервную систему, среду, историю обучения и отношения с человеком.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-7">
              <Link className="button button-primary" href="/booking">Выбрать формат работы</Link>
              <Link className="button button-ghost" href="/services">Услуги и цены</Link>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-7">
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/70">Командный подход</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-caramel/20">150+ отзывов</span>
              <span className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-ice/20">Доказательная база</span>
            </div>
          </div>
          
          <div className="min-h-[380px] flex items-center justify-center relative">
            <span className="absolute z-10 px-4 py-3 rounded-full text-white font-black shadow-xl bg-gradient-rose top-5 right-0 rotate-3">Сначала состояние</span>
            <span className="absolute z-10 px-4 py-3 rounded-full text-white font-black shadow-xl bg-gradient-to-br from-ice to-matcha bottom-[50px] -left-2.5 -rotate-3">Контекст важен</span>
            
            <TiltCard 
              className="w-full max-w-[470px] p-[42px] mobile:p-7 rounded-[42px] text-white shadow-[0_45px_90px_rgba(30,43,14,0.28)] bg-[radial-gradient(circle_at_83%_13%,rgba(198,142,107,0.34),transparent_30%),linear-gradient(145deg,theme(colors.soldier),theme(colors.coal)_72%)] border border-snow/10 relative overflow-hidden"
              initialRotateZ={2}
            >
              <span className="micro text-forest">Бусидо-Пёсидо метод</span>
              <h3 className="text-[42px] mobile:text-[32px] my-4 relative z-10">У нас комплексный подход</h3>
              <FactorCloud />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ШАГИ ПОДХОДА */}
      <section className="pb-10">
        <div className="container grid grid-cols-3 gap-4 mobile:grid-cols-1">
          <ScrollReveal delay={0}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 bg-gradient-green">
              <span className="font-bold">01</span>
              <h3 className="text-[30px] mt-10 mb-3.5">Сначала состояние</h3>
              <p>Оцениваем сон, боль, зуд, работу ЖКТ, сенсорную нагрузку, медикаментозный фон и способность восстанавливаться.</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 bg-gradient-warm">
              <span className="font-bold text-espresso">02</span>
              <h3 className="text-[30px] mt-10 mb-3.5 text-espresso">Затем среда</h3>
              <p className="text-espresso">Ищем факторы, которые ежедневно поддерживают напряжение, возбуждение, избегание или конфликт.</p>
            </article>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <article className="p-7 rounded-[28px] text-white min-h-[245px] relative overflow-hidden transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-ice via-berry to-rose">
              <span className="font-bold">03</span>
              <h3 className="text-[30px] mt-10 mb-3.5">После — обучение</h3>
              <p>Подбираем навыки, доступные конкретному животному и сохраняющиеся в реальной жизни.</p>
            </article>
          </ScrollReveal>
        </div>
      </section>

  {/* ГЛАВНЫЙ СПЕЦИАЛИСТ (ПЕРЕНЕСЕНО НАВЕРХ) */}
      {dbMainSpecialist && (
        <section className="py-[92px] mobile:py-[64px]">
          <div className="container grid grid-cols-2 gap-16 items-center mobile:grid-cols-1">
            <div className="relative">
              <div className="min-h-[560px] mobile:min-h-[430px] rounded-[42px] p-8 flex items-end shadow-2xl relative overflow-hidden bg-[radial-gradient(circle_at_18%_16%,rgba(111,143,191,0.63),transparent_26%),radial-gradient(circle_at_82%_25%,rgba(240,114,150,0.48),transparent_25%),radial-gradient(circle_at_72%_82%,rgba(198,142,107,0.58),transparent_30%),linear-gradient(145deg,theme(colors.fog),theme(colors.snow))] after:absolute after:inset-[22px] after:rounded-[34px] after:border after:border-forest/10 after:pointer-events-none">
                {dbMainSpecialist.image_url ? (
                  <Image 
                    src={dbMainSpecialist.image_url} 
                    alt={dbMainSpecialist.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top z-10" 
                  />
                ) : (
                  <strong className="text-[30px] max-w-[13ch] relative z-10 text-coal/50">
                    Строгое портретное фото {dbMainSpecialist.name.split(' ')[0]}
                  </strong>
                )}
              </div>
              <div className="absolute right-[-18px] bottom-8 p-4 bg-white rounded-2xl shadow-xl font-[850] max-w-[285px] mobile:relative mobile:right-auto mobile:bottom-auto mobile:-mt-5 mobile:mx-3.5 z-20">
                {dbMainSpecialist.role}
              </div>
            </div>
            <div>
              <ScrollReveal className="max-w-[820px] mb-[42px]">
                <span className="kicker">РУКОВОДИТЕЛЬ ПРОЕКТА</span>
                <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                  {dbMainSpecialist.short_bio}
                </h2>
              </ScrollReveal>
              <div className="text-xl text-matcha mb-4">
                Меня зовут {dbMainSpecialist.name}.
              </div>
              
              {dbMainSpecialist.full_bio.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-6">{paragraph}</p>
              ))}

              <div className="flex flex-wrap gap-2.5 mb-8">
                {dbMainSpecialist.tags 
                  ? JSON.parse(dbMainSpecialist.tags).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/40">
                        {tag.trim()}
                      </span>
                    ))
                  : dbMainSpecialist.role.split('·').map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-2 border border-forest/15 rounded-full text-[13px] font-[800] bg-oat/40">
                        {tag.trim()}
                      </span>
                    ))
                }
              </div>
              <p>
                <Link className="font-[950] text-forest hover:text-espresso transition-colors" href="/specialists">
                  Посмотреть всю команду специалистов →
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* С ЧЕМ МЫ РАБОТАЕМ */}
      <section className="py-[92px] mobile:py-[64px] bg-[radial-gradient(circle_at_0_50%,rgba(240,114,150,0.09),transparent_24rem),theme(colors.snow)]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">С ЧЕМ МЫ РАБОТАЕМ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Когда поведение стало сложным для животного и семьи
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-4 mobile:grid-cols-1 tablet:grid-cols-2">
            <IssueCard id="fear" num="01" title="Страхи и избегание" text="Люди, дети, собаки, улица, звуки, транспорт, ветеринарные процедуры." />
            <IssueCard id="reactivity" num="02" title="Реактивность и возбуждение" text="Лай, рывки, фиксация, фрустрация и трудности восстановления." />
            <IssueCard id="defense" num="03" title="Защитное поведение" text="Рычание, выпады, укусы, охрана пространства или ресурсов." />
            <IssueCard id="puppy" num="05" title="Щенки и подростки" text="Адаптация, прикусывание, туалет, прогулки, социализация и первые навыки." />
            <IssueCard id="cats" num="06" title="Поведение кошек" text="Лоток, вокализация, страхи, контакт, приучение к переноске и среде." />
            <IssueCard id="aggression" num="07" title="Агрессия" text="Территориальная, внутривидовая и переадресованная агрессия. У кошек часто протекает жестче, чем у собак." />
          </div>
        </div>
      </section>

{/* ОБЪЕДИНЕННЫЙ БЛОК: ПОДХОД И ИНТЕРАКТИВНАЯ СХЕМА */}
      <section className="bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white py-[92px] mobile:py-[64px]">
        <div className="container">
          
          <div className="grid grid-cols-[1fr_auto] tablet:grid-cols-1 gap-10 items-end mb-12">
            <ScrollReveal className="max-w-[700px]">
              <span className="kicker">МЕТОДОЛОГИЯ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                Поведение складывается из нескольких систем
              </h2>
              <p className="text-fog mt-5 text-lg">
                Команда может быть известна собаке и оставаться недоступной в конкретном состоянии. Поэтому мы работаем с причинами, условиями и навыками одновременно.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={1} className="tablet:w-full">
              {/* Собранная визуальная формула */}
              <div className="inline-flex flex-wrap items-center gap-1.5 p-2 bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-sm tablet:w-full">
                {['состояние', 'среда', 'нагрузка', 'восстановление', 'обучение'].map((word, i, arr) => (
                  <div key={word} className="flex items-center gap-1.5">
                    <span className="px-3.5 py-2 rounded-xl bg-white/10 text-[13px] font-[800] tracking-wide uppercase text-white shadow-sm">
                      {word}
                    </span>
                    {i !== arr.length - 1 && <b className="text-caramel/70 text-lg px-1">+</b>}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Интерактивная схема */}
          <ScrollReveal delay={2} className="mb-16">
            <ApproachTabs />
          </ScrollReveal>

          {/* 4 Карточки (Действия специалиста) */}
          <div className="grid grid-cols-4 gap-5 tablet:grid-cols-2 mobile:grid-cols-1">
            <ScrollReveal delay={0} className="flex">
              <article className="p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-matcha transform origin-left scale-x-100 transition-transform group-hover:scale-x-100" />
                <h3 className="text-white text-[20px] font-bold mb-3 mt-2">Собираем данные</h3>
                <p className="text-[15px] leading-relaxed opacity-80">Анкета, видео, медицинские документы, режим, рацион, сон и динамика эпизодов.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={1} className="flex">
              <article className="p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-caramel transform origin-left scale-x-100 transition-transform group-hover:scale-x-100" />
                <h3 className="text-white text-[20px] font-bold mb-3 mt-2">Строим гипотезы</h3>
                <p className="text-[15px] leading-relaxed opacity-80">Определяем факторы, которые запускают и поддерживают поведение.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={2} className="flex">
              <article className="p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose transform origin-left scale-x-100 transition-transform group-hover:scale-x-100" />
                <h3 className="text-white text-[20px] font-bold mb-3 mt-2">Меняем условия</h3>
                <p className="text-[15px] leading-relaxed opacity-80">Снижаем перегрузку, выстраиваем дистанцию и безопасное управление.</p>
              </article>
            </ScrollReveal>
            <ScrollReveal delay={3} className="flex">
              <article className="p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-ice transform origin-left scale-x-100 transition-transform group-hover:scale-x-100" />
                <h3 className="text-white text-[20px] font-bold mb-3 mt-2">Обучаем навыкам</h3>
                <p className="text-[15px] leading-relaxed opacity-80">Дробим задачу, задаем измеримые критерии и корректируем план.</p>
              </article>
            </ScrollReveal>
          </div>
          
        </div>
      </section>

      {/* ИНТЕРАКТИВНАЯ ШКАЛА (STATE LAB) */}
      <section className="py-[92px] mobile:py-[64px] bg-[linear-gradient(135deg,rgba(216,211,179,0.42),rgba(247,243,239,0.92)_42%,rgba(111,143,191,0.13))]">
        <div className="container grid grid-cols-[1.05fr_0.95fr] gap-16 items-center tablet:grid-cols-1">
          <StateSlider />
        </div>
      </section>

      {/* НАВИГАТОР */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">НАВИГАТОР ЗАПРОСА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              Ответьте на вопросы и получите следующий шаг
            </h2>
            <p className="text-xl text-matcha">
              Результат помогает выбрать формат работы, но не является диагнозом.
            </p>
          </ScrollReveal>
          <Navigator initialSteps={dbNavSteps} formats={dbFormats} />
        </div>
      </section>

      {/* ПОВЕДЕНИЕ И ЗДОРОВЬЕ (MEDICAL) */}
      <section className="py-[92px] mobile:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(111,143,191,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(198,142,107,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container grid grid-cols-2 gap-16 items-center mobile:grid-cols-1">
          <div>
            <ScrollReveal className="max-w-[820px] mb-[42px]">
              <span className="kicker">ПОВЕДЕНИЕ И ЗДОРОВЬЕ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
                Когда сначала нужна диагностика
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
              Узнать больше о сложных случаях
            </Link>
          </div>
          
          <ScrollReveal delay={1} className="h-full">
            <ClinicalBehaviorChart />
          </ScrollReveal>
        </div>
      </section>

      <FormatsSection formats={dbFormats} />

      {/* ПОСЛЕ КОНСУЛЬТАЦИИ (ТОЧКА А -> ТОЧКА Б) */}
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
              { num: '01', title: 'Понятная гипотеза', desc: 'Что запускает и поддерживает поведение.', accentText: 'text-matcha', accentBg: 'bg-matcha', gradient: 'from-matcha/10', watermark: 'group-hover:text-matcha/[0.07]' },
              { num: '02', title: 'План среды и режима', desc: 'Что изменить дома и на прогулке.', accentText: 'text-caramel', accentBg: 'bg-caramel', gradient: 'from-caramel/10', watermark: 'group-hover:text-caramel/[0.07]' },
              { num: '03', title: 'Пошаговые упражнения', desc: 'Последовательность, критерии и признаки остановки.', accentText: 'text-rose', accentBg: 'bg-rose', gradient: 'from-rose/10', watermark: 'group-hover:text-rose/[0.07]' },
              { num: '04', title: 'Маршрут помощи', desc: 'Когда нужен ветеринарный врач или другой специалист.', accentText: 'text-ice', accentBg: 'bg-ice', gradient: 'from-ice/10', watermark: 'group-hover:text-ice/[0.07]' }
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i} className="flex h-full">
                <article className="group relative w-full flex flex-col p-8 mobile:p-6 rounded-[28px] bg-snow border border-forest/10 hover:border-forest/20 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default hover:-translate-y-1.5">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${step.gradient} to-transparent transition-opacity duration-700 pointer-events-none`} />
                  <span className={`absolute -bottom-8 -right-4 text-[140px] font-black leading-none text-coal/[0.02] ${step.watermark} transition-colors duration-500 pointer-events-none select-none`}>
                    {step.num}
                  </span>
                  <div className={`absolute top-0 left-0 h-1.5 w-12 ${step.accentBg} rounded-br-full transition-all duration-500 group-hover:w-full`} />
                  <div className="relative z-10 flex flex-col h-full mt-3">
                    <strong className={`text-[13px] font-[900] tracking-widest uppercase ${step.accentText} mb-6 block`}>
                      Шаг {step.num}
                    </strong>
                    <h3 className="text-[22px] leading-tight mb-4 text-coal">
                      {step.title}
                    </h3>
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

      {/* КЕЙСЫ ДО / ПОСЛЕ */}
      <section className="py-[92px] mobile:py-[64px]">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">КЕЙСЫ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice">
              От гипотезы к результату (До / После)
            </h2>
            <p className="text-xl text-matcha">
              Мы показываем не только успешный исход, но и то, какие конкретные изменения в среде и обучении помогли снизить остроту проблемы.
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
          </ScrollReveal>
          {/* Внутри компонента ReviewCarousel мы уберем форму */}
          <ReviewCarousel initialReviews={dbReviews} />
        </div>
      </section>

      {/* БЕСПЛАТНЫЕ КОНСУЛЬТАЦИИ */}
      <section className="py-[92px] mobile:py-[64px] relative overflow-hidden bg-[radial-gradient(circle_at_10%_12%,rgba(240,114,150,0.32),transparent_22rem),radial-gradient(circle_at_90%_90%,rgba(111,143,191,0.28),transparent_23rem),linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white after:absolute after:w-[190px] after:h-[190px] after:right-[3%] after:-top-[80px] after:rounded-full after:bg-gradient-rose after:opacity-45">
        <div className="container relative z-10">
          <div className="grid grid-cols-[1.25fr_0.55fr_auto] gap-9 items-center mobile:grid-cols-1">
            <div>
              <span className="kicker text-white/80">БЕСПЛАТНАЯ ПОМОЩЬ</span>
              <h2 className="text-[44px] mobile:text-[34px] leading-tight font-bold text-white mb-4">
                Онлайн-консультации
              </h2>
              <p className="text-lg text-white/80 max-w-[500px]">
                Ежедневно открываем места. Одно животное, один запрос и 30–40 минут предметной работы с нашим специалистом.
              </p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-baseline border-l border-white/20 pl-8 max-md:border-none max-md:pl-0">
              <strong className="text-[38px] leading-none font-black text-white">28–35</strong>
              <span className="text-white/80 font-medium">мест в месяц</span>
            </div>
            <Link className="button button-light whitespace-nowrap" href="/free-consultations">
              Полные условия
            </Link>
          </div>
          <FreeConsultationsWidget scheduleData={dbSchedule} />
        </div>
      </section>

      {/* БИБЛИОТЕКА / БЛОГ */}
      <section className="py-[92px] mobile:py-[64px] relative bg-[radial-gradient(circle_at_20%_80%,rgba(111,143,191,0.08),transparent_35rem),theme(colors.snow)]">
        <div className="container relative z-10">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker">БЛОГ И БИБЛИОТЕКА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
              Практические материалы и статьи
            </h2>
            <p className="text-xl text-matcha mt-4">
              Документы, дневники, чек-листы и руководства для владельцев и коллег-специалистов.
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
            {faqData.map((faq, i) => (
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
              Анкета занимает около 10 минут. Документы и видео можно приложить сразу или дослать позднее.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0 relative z-10 mobile:w-full">
            <Link className="button button-primary mobile:w-full" href="/booking">
              Перейти к записи
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}