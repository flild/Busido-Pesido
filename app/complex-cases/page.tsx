import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Сложные случаи: реактивность, страхи, зоопсихолог — Busido-Pesido',
  description: 'Помощь зоопсихолога при сложных поведенческих нарушениях: агрессия, страхи, реактивность собак и кошек. Ветеринарное второе мнение.',
  alternates: {
    canonical: "https://busidopesido.ru/complex-cases",
  },
};

export default function ComplexCasesPage() {
  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.coal),theme(colors.soldier))] text-white relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4 bg-white/10 border-white/20 text-white shadow-none">СЛОЖНЫЕ СЛУЧАИ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px] text-white">
            Когда поведение, здоровье и среда связаны
          </h1>
          <p className="text-xl text-oat max-w-[800px] mt-6 leading-relaxed">
            Я работаю со случаями, где реактивность, страх, защитное поведение, нарушения контакта или внезапные изменения поведения могут быть связаны с болью, ЖКТ, зудом, сном, лекарствами, сенсорной нагрузкой и предшествующим опытом.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
          <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col">
            <span className="tag mb-4 self-start bg-fog text-espresso">Поведение</span>
            <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Реактивность, страх, укусы, охрана</h3>
            <p className="text-coal/80">Функция поведения, уровень риска, триггеры, дистанция и последствия.</p>
          </article>
          
          <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col">
            <span className="tag mb-4 self-start bg-rose/15 text-rose">Состояние</span>
            <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Подозрение на боль</h3>
            <p className="text-coal/80">Сопоставление поведения с медицинскими данными и вопросы для диагностики.</p>
          </article>
          
          <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col">
            <span className="tag mb-4 self-start bg-ice/20 text-coal">Среда</span>
            <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Несколько животных</h3>
            <p className="text-coal/80">Ресурсы, маршруты, зоны отдыха, конкуренция и сенсорная нагрузка.</p>
          </article>
          
          <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col">
            <span className="tag mb-4 self-start bg-matcha/15 text-matcha">История</span>
            <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Нарушенное доверие</h3>
            <p className="text-coal/80">Перестройка процедур, контролируемый выбор и безопасный контакт.</p>
          </article>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_95%_10%,rgba(111,143,191,0.24),transparent_25rem),radial-gradient(circle_at_2%_90%,rgba(198,142,107,0.16),transparent_22rem),linear-gradient(135deg,theme(colors.fog),theme(colors.snow))]">
        <div className="container grid grid-cols-[1.2fr_1fr] max-lg:grid-cols-1 gap-16 items-center">
          <div className="p-[42px] max-md:p-7 rounded-[42px] bg-[radial-gradient(circle_at_82%_10%,rgba(240,114,150,0.17),transparent_27%),linear-gradient(145deg,theme(colors.white),rgba(111,143,191,0.12))] shadow-[0_24px_70px_rgba(30,43,14,0.12)] tilt-card">
            <span className="block text-[10px] font-black tracking-[0.14em] text-forest mb-4">SECOND OPINION</span>
            <h3 className="text-[42px] max-md:text-[34px] font-bold text-coal leading-tight mb-4">Ветеринарное второе мнение</h3>
            <div className="text-[50px] font-black tracking-tighter text-coal mb-4">2 500 ₽</div>
            <p className="text-coal/80 font-medium text-lg">Анализ документов без отмены назначений лечащего врача.</p>
          </div>
          
          <div>
            <div className="max-w-[820px] mb-[32px]">
              <span className="kicker">РАЗБОР ДОКУМЕНТОВ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
                Что входит
              </h2>
            </div>
            <div className="grid gap-2.5 mb-8">
              {[
                'Анализ проведённой диагностики',
                'Оценка логики назначений',
                'Выявление недостающих данных',
                'Рекомендации по дополнительной диагностике',
                'Направление к профильному врачу'
              ].map((item, i) => (
                <span key={i} className="px-3.5 py-3 pl-[42px] bg-white/75 rounded-2xl font-[780] text-coal/80 relative before:content-['✓'] before:absolute before:left-3.5 before:text-forest before:font-black shadow-sm">
                  {item}
                </span>
              ))}
            </div>
            <Link className="button button-dark" href="/booking?service=second">
              Отправить документы
            </Link>
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          <div className="max-w-[820px] mb-[42px] reveal-ready">
            <span className="kicker">ГРАНИЦЫ РАБОТЫ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
              Когда я перенаправляю случай
            </h2>
          </div>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
            <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] reveal-ready">
              <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Острое ухудшение</h3>
              <p className="text-coal/80">Сначала требуется экстренная клиника, стабилизация и очная диагностика.</p>
            </article>
            <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] reveal-ready">
              <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Высокий риск</h3>
              <p className="text-coal/80">Нужен командный формат, дополнительные меры безопасности или иной профиль.</p>
            </article>
            <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] reveal-ready">
              <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Недостаточно данных</h3>
              <p className="text-coal/80">До поведенческой работы необходимо получить исследования или наблюдения в динамике.</p>
            </article>
            <article className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] reveal-ready">
              <h3 className="text-[23px] font-bold text-coal leading-tight mb-3">Другая специализация</h3>
              <p className="text-coal/80">Я объясняю, какой специалист нужен и что подготовить к следующей консультации.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}