import { Metadata } from 'next';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ScrollReveal';
import { FreeConsultationsWidget } from '@/components/FreeConsultationsWidget';

export const metadata: Metadata = {
  title: 'Бесплатные поведенческие консультации — Busido-Pesido',
  description: 'Бесплатная онлайн-помощь специалиста по поведению животных (собак и кошек). 1–7 числа каждого месяца, разбор сложных случаев и рекомендации.',
  alternates: {
    canonical: "https://busidopesido.ru/free-consultations",
  },
};

export default function FreeConsultationsPage() {
  return (
    <main>
      {/* ХЕДЕР СТРАНИЦЫ */}
      <section className="pt-[140px] pb-[74px] max-md:pt-[110px] max-md:pb-[54px] relative overflow-hidden bg-[radial-gradient(circle_at_10%_12%,rgba(240,114,150,0.32),transparent_22rem),radial-gradient(circle_at_90%_90%,rgba(111,143,191,0.28),transparent_23rem),linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white after:absolute after:w-[190px] after:h-[190px] after:right-[3%] after:-top-[80px] after:rounded-full after:bg-gradient-to-br after:from-berry after:to-rose after:opacity-45">
        <div className="container relative z-10">
          <ScrollReveal delay={0}>
            <span className="eyebrow mb-4 bg-white/10 border-white/20 text-white shadow-none">1–7 ЧИСЛА КАЖДОГО МЕСЯЦА</span>
            <h1 className="relative text-[64px] max-lg:text-[52px] max-md:text-[42px] leading-[1.05] font-bold tracking-tight text-white mb-6 max-w-[900px]">
              Бесплатные поведенческие консультации
            </h1>
            <p className="text-xl max-md:text-lg text-white/90 max-w-[800px] mb-8 leading-relaxed">
              Самостоятельный формат реальной помощи и просвещения. Он не обязывает покупать другие услуги и не является сокращённой копией платной консультации.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-3.5 py-2 rounded-full border border-white/20 bg-white/10 font-[800] text-[13px] backdrop-blur-sm">Только онлайн</span>
              <span className="px-3.5 py-2 rounded-full border border-white/20 bg-white/10 font-[800] text-[13px] backdrop-blur-sm">30–40 минут</span>
              <span className="px-3.5 py-2 rounded-full border border-white/20 bg-white/10 font-[800] text-[13px] backdrop-blur-sm">4–5 мест в день</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ЧТО ВХОДИТ */}
      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-16 items-center">
          <div>
            <ScrollReveal className="max-w-[820px] mb-[32px]">
              <span className="kicker">ФОРМАТ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
                Что входит
              </h2>
            </ScrollReveal>
            <div className="grid gap-2.5">
              {[
                'Одно животное и один основной запрос',
                'Предварительная анкета',
                '30–40 минут онлайн-разбора',
                'Краткая письменная рекомендация',
                'До 3 дней обратной связи',
                'Небольшая подборка материалов или книг'
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i}>
                  <span className="block px-4 py-3.5 pl-[48px] bg-snow/80 rounded-2xl font-[780] text-coal/80 relative before:content-['✓'] before:absolute before:left-4 before:text-forest before:font-black shadow-sm">
                    {item}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
          
          <ScrollReveal delay={2}>
            <div className="p-10 max-md:p-8 rounded-[36px] bg-white shadow-[0_35px_80px_rgba(30,43,14,0.08)] border border-forest/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-matcha/10 to-transparent rounded-bl-full pointer-events-none" />
              <span className="block text-[11px] font-black tracking-[0.14em] text-forest mb-4 relative z-10">ЕЖЕМЕСЯЧНЫЙ НАБОР</span>
              <strong className="block text-[86px] max-md:text-[64px] leading-none font-black text-coal mb-2 relative z-10">28–35</strong>
              <p className="text-xl text-coal/80 font-bold mb-8 relative z-10">бесплатных мест в месяц</p>
              
              {/* Полоску-градиент отсюда убрали */}
              
              <p className="text-[14px] text-coal/60 mb-8 font-medium leading-relaxed relative z-10">
                Количество мест зависит от календарных выходных и нагрузки. Данные синхронизируются с базой автоматически.
              </p>
              
              <a 
                href="#booking-widget"
                className="button button-primary w-full relative z-10 flex items-center justify-center"
              >
                Выбрать свободную дату
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ПРАВИЛА */}
      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[42px]">
            <span className="kicker text-white/80">ПРАВИЛА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-white">
              Как распределяются места
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-5">
            {[
              { num: '01', color: 'border-t-matcha', title: 'Кто успел записаться', text: 'Места распределяются по факту свободной записи, без конкурса и случайного отбора.' },
              { num: '02', color: 'border-t-caramel', title: 'Один раз для одного', text: 'Повторное участие одного и того же владельца строго не допускается. Система блокирует дубли.' },
              { num: '03', color: 'border-t-rose', title: 'Без доплаты', text: 'Формат не переводится в платный через доплату и не создаёт обязательств купить услугу.' },
              { num: '04', color: 'border-t-ice', title: 'Честные границы', text: 'При глубоком запросе я даю доступную помощь, объясняю причины и дальнейший маршрут.' }
            ].map((rule, i) => (
              <ScrollReveal key={i} delay={i} className="h-full">
                <article className={`h-full p-7 rounded-[28px] bg-white/5 border border-white/10 text-oat border-t-4 ${rule.color} hover:bg-white/10 transition-colors`}>
                  <span className="text-white/40 font-black text-2xl tracking-tighter">{rule.num}</span>
                  <h3 className="text-[22px] mt-4 mb-3 text-white font-bold leading-tight">{rule.title}</h3>
                  <p className="text-oat/80 leading-relaxed text-[15px]">{rule.text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ЗАПИСЬ (ВИДЖЕТ) */}
      <section id="booking-widget" className="py-[92px] max-md:py-[64px] scroll-mt-10">
        <div className="container">
          <ScrollReveal className="max-w-[820px] mb-[12px]">
            <span className="kicker">ЗАПИСЬ</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
              Онлайн-бронирование
            </h2>
            <p className="text-xl text-matcha mt-4">
              Выберите дату с 1 по 7 число, укажите телефон и кратко опишите проблему.
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={1}>
            <FreeConsultationsWidget />
          </ScrollReveal>
          
        </div>
      </section>
    </main>
  );
}