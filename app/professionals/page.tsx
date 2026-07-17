import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Супервизия и разбор случаев для специалистов — Busido-Pesido',
  description: 'Профессиональный разбор сложных поведенческих кейсов собак и кошек для кинологов, ветеринарных врачей, фелинологов и специалистов по поведению.',
  alternates: {
    canonical: "https://busidopesido.ru/professionals",
  },
};

export default function ProfessionalsPage() {
  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.coal),theme(colors.soldier))] text-white relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4 bg-white/10 border-white/20 text-white shadow-none">СПЕЦИАЛИСТАМ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[900px] text-white">
            Профессиональный разбор случая без сведения работы к одному упражнению
          </h1>
          <p className="text-xl text-oat max-w-[800px] mt-6 leading-relaxed">
            Формат для кинологов, специалистов по поведению, ветеринарных врачей, фелинологов, сотрудников приютов и студентов профильных направлений.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-[1fr_1fr] max-lg:grid-cols-1 gap-16 items-center">
          <div className="p-10 max-md:p-7 rounded-[38px] border border-oat shadow-[0_24px_70px_rgba(30,43,14,0.12)] bg-[linear-gradient(155deg,theme(colors.fog),theme(colors.white)_60%)] flex flex-col tilt-card">
            <span className="tag mb-4 self-start">Профессиональный разбор</span>
            <h2 className="text-[50px] max-md:text-[40px] font-black tracking-tighter text-coal mb-4">3 000 ₽</h2>
            <p className="text-lg text-forest font-medium mb-8 leading-relaxed">
              Специалист присылает полный случай, уже выполненные действия и материалы. Я помогаю увидеть пропущенные факторы, пересобрать гипотезы и дальнейший план.
            </p>
            <div className="mt-auto">
              <Link className="button button-primary" href="/booking?service=professional">
                Записаться
              </Link>
            </div>
          </div>
          
          <div>
            <div className="max-w-[820px] mb-[32px]">
              <span className="kicker">ЧТО ПОДГОТОВИТЬ</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
                Материалы случая
              </h2>
            </div>
            <div className="grid gap-2.5">
              {[
                'Анамнез и основной запрос',
                'Медицинские данные',
                'Видео эпизодов и обычной жизни',
                'Предшествующие вмешательства',
                'Динамика и показатели прогресса',
                'Ваши гипотезы и вопросы'
              ].map((item, i) => (
                <span key={i} className="px-3.5 py-3 pl-[42px] bg-snow/75 rounded-2xl font-[780] text-coal/80 relative before:content-['✓'] before:absolute before:left-3.5 before:text-forest before:font-black shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white">
        <div className="container">
          <div className="max-w-[820px] mb-[42px] reveal-ready">
            <span className="kicker">ФОКУС РАЗБОРА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-white">
              Что мы пересобираем
            </h2>
          </div>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-matcha reveal-ready">
              <h3 className="text-[23px] mt-2 mb-3 text-white font-bold">Контекст</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Где, когда, с кем и после каких событий появляется поведение.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-caramel reveal-ready">
              <h3 className="text-[23px] mt-2 mb-3 text-white font-bold">Состояние</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Сон, боль, ЖКТ, сенсорная нагрузка, возбуждение и лекарства.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-rose reveal-ready">
              <h3 className="text-[23px] mt-2 mb-3 text-white font-bold">Последствия</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Что получает или прекращает животное и какие реакции закрепляются у людей.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-ice reveal-ready">
              <h3 className="text-[23px] mt-2 mb-3 text-white font-bold">Критерии</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Какие изменения измерять и когда необходимо снижать сложность.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}