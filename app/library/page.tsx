import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Библиотека — Busido-Pesido',
  description: 'Авторская библиотека практических материалов о жизни с животными: документы, дневники, чек-листы и мини-гайды.',
  alternates: {
    canonical: "https://busidopesido.ru/library",
  },
};

export default function LibraryPage() {
  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.fog),theme(colors.snow)_52%,rgba(111,143,191,0.24))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">BUSIDO-PESIDO SCHOOL</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
            Библиотека практических материалов о жизни с животными
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
            Подробные документы, дневники, чек-листы и мини-гайды, которые помогают видеть связь поведения, нервной системы, здоровья, среды, обучения и контакта.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          
          <div className="grid grid-cols-[1fr_auto_auto] max-lg:grid-cols-1 gap-8 items-center p-10 max-md:p-7 rounded-[38px] bg-[linear-gradient(135deg,theme(colors.white),theme(colors.fog)_50%,theme(colors.snow))] shadow-[0_24px_70px_rgba(30,43,14,0.12)] mb-10">
            <div>
              <span className="tag mb-3 inline-block">Доступ</span>
              <h2 className="text-[40px] max-md:text-[32px] leading-tight mb-2 text-coal">Подписка на библиотеку</h2>
              <p className="text-lg text-forest font-medium">Новые и обновляемые материалы для владельцев и специалистов.</p>
            </div>
            <div className="flex max-md:flex-col gap-7 max-md:gap-4">
              <div className="flex flex-col">
                <strong className="text-[32px] font-black text-coal leading-none">790 ₽</strong>
                <span className="text-coal/60 font-bold uppercase tracking-wider text-[11px] mt-1">в месяц</span>
              </div>
              <div className="flex flex-col">
                <strong className="text-[32px] font-black text-coal leading-none">6 000 ₽</strong>
                <span className="text-coal/60 font-bold uppercase tracking-wider text-[11px] mt-1">в год</span>
              </div>
            </div>
            <div className="max-lg:w-full">
              <Link className="button button-primary max-lg:w-full" href="/booking?service=library">
                Оформить доступ
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-[15px]">
            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-matcha/10 text-matcha">PDF</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Среда, режим и саморегуляция собаки</h3>
              <p className="text-coal/80 mb-6">Сон, нагрузка, домашняя среда и первые две недели изменений.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Открыть карточку →</a>
            </article>

            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-caramel/20 text-espresso">GUIDE</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Пёсагогика</h3>
              <p className="text-coal/80 mb-6">Как обучается собака и что должен понимать человек, который её учит.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Открыть карточку →</a>
            </article>

            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-ice/20 text-coal">ATLAS</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Язык и сигналы собак</h3>
              <p className="text-coal/80 mb-6">Поза, дистанция, движение, конфликт, страх и восстановление.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Открыть карточку →</a>
            </article>

            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-rose/15 text-rose">DIARY</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Этологический дневник</h3>
              <p className="text-coal/80 mb-6">Контекст, состояние, события, поведение и последствия.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Открыть карточку →</a>
            </article>

            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-berry/20 text-berry">CAT</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Наблюдение за кошкой</h3>
              <p className="text-coal/80 mb-6">Контекстно-соматические записи с фокусом на среду и ресурсы.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Открыть карточку →</a>
            </article>

            <article className="p-[28px] rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card">
              <span className="tag mb-4 self-start bg-fog text-espresso">FREE</span>
              <h3 className="text-[25px] leading-tight mb-3 font-bold text-coal">Бесплатные памятки</h3>
              <p className="text-coal/80 mb-6">Материалы для первых шагов и подготовки к консультации.</p>
              <a href="#" className="mt-auto text-forest font-black hover:text-espresso transition-colors">Скачать →</a>
            </article>
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white" id="marathon">
        <div className="container">
          <div className="max-w-[820px] mb-[42px] reveal-ready">
            <span className="kicker">БЕСПЛАТНЫЙ МАРАФОН</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-white">
              Спокойнее рядом: как помочь собаке слышать вас в сложных ситуациях
            </h2>
          </div>
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4">
            <article className="p-[28px] rounded-[24px] bg-white/5 border border-white/10 reveal-ready border-t-4 border-t-matcha">
              <span className="block text-[10px] font-black text-oat tracking-widest uppercase mb-2">ДЕНЬ 1</span>
              <h3 className="text-[23px] mb-3 text-white font-bold leading-tight">Почему собака не слышит</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Состояние, возбуждение, порог реакции и доступность внимания.</p>
            </article>
            <article className="p-[28px] rounded-[24px] bg-white/5 border border-white/10 reveal-ready border-t-4 border-t-caramel">
              <span className="block text-[10px] font-black text-oat tracking-widest uppercase mb-2">ДЕНЬ 2</span>
              <h3 className="text-[23px] mb-3 text-white font-bold leading-tight">Как помочь справляться</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Среда, дистанция, восстановление, управление и упражнения.</p>
            </article>
            <article className="p-[28px] rounded-[24px] bg-white/5 border border-white/10 reveal-ready border-t-4 border-t-rose">
              <span className="block text-[10px] font-black text-oat tracking-widest uppercase mb-2">ДЕНЬ 3</span>
              <h3 className="text-[23px] mb-3 text-white font-bold leading-tight">Как строить сотрудничество</h3>
              <p className="text-oat/90 leading-relaxed text-sm">Ясность человека, предсказуемость, выбор и перенос навыков.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}