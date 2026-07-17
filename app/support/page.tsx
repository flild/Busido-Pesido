import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Сопровождение — Busido-Pesido',
  description: 'Busido-Pesido — поведение, состояние и благополучие животных.',
};

export default function SupportPage() {
  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.oat),theme(colors.snow)_62%,rgba(111,143,191,0.22))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">СОПРОВОЖДЕНИЕ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
            План меняется вместе с животным
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6">
            Сопровождение подходит для сложных, длительных и нестабильных случаев, когда важно регулярно оценивать видео, состояние, среду, выполнение заданий и реальную динамику.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-[18px]">
          <article className="p-10 max-md:p-7 rounded-[38px] border border-oat shadow-[0_24px_70px_rgba(30,43,14,0.12)] bg-[linear-gradient(155deg,theme(colors.fog),theme(colors.white)_60%)] flex flex-col tilt-card">
            <span className="tag mb-4 self-start">Дистанционно</span>
            <h2 className="text-[40px] max-md:text-[32px] leading-tight mb-2 text-coal">Онлайн-сопровождение</h2>
            <div className="text-[50px] font-black tracking-tighter text-coal mb-4">22 000 ₽</div>
            <p className="text-xl text-forest font-medium mb-6">Регулярная работа в течение согласованного периода с домашними заданиями и их проверкой.</p>
            <ul className="grid gap-3 mb-8">
              {['Стартовая консультация и приоритеты', 'Индивидуальные домашние задания', 'Проверка видео и дневника', 'Корректировка критериев и нагрузки', 'Письменные инструкции после этапов', 'Поддержка по текущим вопросам'].map((item, i) => (
                <li key={i} className="relative pl-7 before:content-['●'] before:absolute before:left-0 before:text-rose font-medium text-coal/80">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <Link className="button button-primary" href="/booking?service=support-online">Оставить заявку</Link>
            </div>
          </article>

          <article className="p-10 max-md:p-7 rounded-[38px] border border-forest/15 bg-white shadow-[0_24px_70px_rgba(30,43,14,0.05)] flex flex-col tilt-card">
            <span className="tag mb-4 self-start">С выездами</span>
            <h2 className="text-[40px] max-md:text-[32px] leading-tight mb-2 text-coal">Сопровождение в реальной среде</h2>
            <div className="text-[50px] font-black tracking-tighter text-coal mb-4">30 000 ₽</div>
            <p className="text-xl text-forest font-medium mb-6">Для случаев, где необходимо регулярно видеть прогулку, дом, общие пространства или взаимодействия животных.</p>
            <ul className="grid gap-3 mb-8">
              {['Все элементы онлайн-сопровождения', 'Очные наблюдения и практическая работа', 'Настройка среды на месте', 'Разбор взаимодействий семьи', 'Корректировка управления', 'План между выездами'].map((item, i) => (
                <li key={i} className="relative pl-7 before:content-['●'] before:absolute before:left-0 before:text-rose font-medium text-coal/80">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <Link className="button button-dark" href="/booking?service=support-offline">Оставить заявку</Link>
            </div>
          </article>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[radial-gradient(circle_at_88%_12%,rgba(225,77,117,0.16),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(111,143,191,0.14),transparent_24rem),linear-gradient(145deg,theme(colors.coal),theme(colors.soldier))] text-white">
        <div className="container">
          <div className="max-w-[820px] mb-[42px] reveal-ready">
            <span className="kicker">КАК УСТРОЕНА РАБОТА</span>
            <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-white">
              Один цикл сопровождения
            </h2>
          </div>
          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-matcha reveal-ready">
              <span className="text-oat font-black text-xl">01</span>
              <h3 className="text-[25px] mt-6 mb-3 text-white font-bold">Наблюдение</h3>
              <p className="text-oat/90 leading-relaxed">Вы присылаете видео, дневник, изменения состояния и фактическое выполнение плана.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-caramel reveal-ready">
              <span className="text-oat font-black text-xl">02</span>
              <h3 className="text-[25px] mt-6 mb-3 text-white font-bold">Анализ</h3>
              <p className="text-oat/90 leading-relaxed">Я оцениваю, что стало доступнее, где выросла нагрузка и какие гипотезы требуют пересмотра.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-rose reveal-ready">
              <span className="text-oat font-black text-xl">03</span>
              <h3 className="text-[25px] mt-6 mb-3 text-white font-bold">Корректировка</h3>
              <p className="text-oat/90 leading-relaxed">Меняем среду, управление, критерии, упражнения или медицинский маршрут.</p>
            </article>
            <article className="p-6 rounded-[22px] bg-white/5 border border-white/10 text-oat border-t-4 border-t-ice reveal-ready">
              <span className="text-oat font-black text-xl">04</span>
              <h3 className="text-[25px] mt-6 mb-3 text-white font-bold">Следующий шаг</h3>
              <p className="text-oat/90 leading-relaxed">Фиксируем измеримую задачу и признаки, при которых работу нужно остановить.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container grid grid-cols-[1.2fr_1fr] max-lg:grid-cols-1 gap-16 items-center">
          <div>
            <div className="max-w-[820px] mb-[42px] reveal-ready">
              <span className="kicker">ОПЛАТА</span>
              <h2 className="after:block after:w-[92px] after:h-[5px] after:mt-4 after:rounded-full after:bg-gradient-to-r after:from-matcha after:via-caramel after:to-ice text-coal">
                Гибкая внутренняя рассрочка
              </h2>
            </div>
            <p className="text-coal/80 mb-4 font-medium">Стоимость можно разделить на две или четыре части. При необходимости согласуется более частый график платежей, включая оплату два раза в неделю. Условия фиксируются до начала работы.</p>
            <p className="text-coal/80 font-medium">Срочная наценка к сопровождению не применяется.</p>
          </div>
          
          <div className="p-7 rounded-[28px] bg-white border border-forest/15 shadow-[0_16px_45px_rgba(20,20,20,0.05)] reveal-ready">
            <h3 className="text-[25px] mb-6 text-coal font-bold">Сопровождение требует</h3>
            <div className="grid gap-2.5">
              {['Регулярных коротких отчётов', 'Видео реальных эпизодов', 'Выполнения согласованных заданий', 'Сообщения об изменениях здоровья', 'Готовности менять план по данным'].map((item, i) => (
                <span key={i} className="px-3.5 py-3 pl-[42px] bg-snow/75 rounded-2xl font-[780] text-coal/80 relative before:content-['✓'] before:absolute before:left-3.5 before:text-forest before:font-black">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}