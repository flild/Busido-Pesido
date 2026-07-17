import { Metadata } from "next";
import Link from "next/link";
import { FormatsSection } from "@/components/FormatsSection";

export const metadata: Metadata = {
  title: "Услуги и цены зоопсихолога — Busido-Pesido",
  description:
    "Цены на услуги зоопсихолога: онлайн-консультации, очные встречи, сопровождение, решение поведенческих проблем собак и кошек.",
  alternates: {
    canonical: "https://busidopesido.ru/services",
  },
};

export default function ServicesPage() {
  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,theme(colors.fog),theme(colors.snow)_55%,rgba(111,143,191,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">УСЛУГИ И ЦЕНЫ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px]">
            Формат определяется задачей, объёмом данных и необходимой поддержкой
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6">
            Базовая стоимость каждого формата включает работу с одним животным.
            Для двух и более животных объём и стоимость согласуются после
            анкеты.
          </p>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          {/* Блок Notice */}
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[18px]">
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Срочный формат</strong>
              <p className="text-coal/80">
                Наценка +50% применяется только к разовым форматам и зависит от
                доступности ближайшего времени. К сопровождению срочная наценка
                не применяется.
              </p>
            </article>
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Приюты и волонтёры</strong>
              <p className="text-coal/80">
                Предусматриваются льготные условия. Ориентир — скидка около 20%;
                окончательный размер фиксируется после расчёта формата.
              </p>
            </article>
            <article className="p-6 rounded-[22px] bg-white border border-forest/15 shadow-sm">
              <strong className="block text-lg font-bold text-coal mb-2">Приоритетное рассмотрение</strong>
              <p className="text-coal/80">
                Запрос передан на приоритетное рассмотрение. Специалист
                ознакомится с ним в ближайшее время и свяжется с вами для
                согласования максимально близкого доступного времени.
              </p>
            </article>
          </div>

          {/* Сетка услуг */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[18px] mt-[28px]">
            {/* Услуга 1 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="online">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">Основной формат</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Онлайн-консультация</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">6 000 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: 75–90 минут</p>
              <p className="text-coal/80 mb-4">
                Владельцам собак и кошек, которым нужен полный разбор одного
                животного и одного основного запроса.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Анкета, 3–7 коротких видео, доступные медицинские документы, описание режима и питания.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Разбираем историю случая, состояние, контексты, поддерживающие факторы, риски и первые изменения.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Письменная рекомендация, приоритеты на первые две недели, упражнения, критерии прогресса и маршрут диагностики.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">До 7 дней по вопросам выполнения рекомендаций.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Сообщения объединяются в один содержательный блок; видео присылаются с кратким описанием контекста.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата. Один перенос без удержания оплаты при предупреждении не позднее чем за 24 часа.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">При необходимости регулярной корректировки плана лучше выбрать сопровождение.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=online">Записаться</Link>
              </div>
            </article>

            {/* Услуга 2 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="offline">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">Реальная среда</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Очная / выездная консультация</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">8 000 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: 90–120 минут</p>
              <p className="text-coal/80 mb-4">
                Когда важно увидеть поведение дома, на прогулке, в общем
                коридоре, при знакомстве или бытовых процедурах.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Анкета, адрес, видео эпизодов, медицинские документы и перечень контекстов для наблюдения.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Наблюдаю взаимодействия, оцениваю среду, показываю безопасное управление и первые практические шаги.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Письменная рекомендация, схема среды, план упражнений и критерии изменения нагрузки.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">До 7 дней после встречи.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Работа проходит без искусственного провоцирования опасного поведения. Безопасность участников имеет приоритет.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата. Транспортные расходы за пределами базовой зоны рассчитываются отдельно.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">При невозможности безопасной очной встречи начинаем с онлайн-разбора.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=offline">Записаться</Link>
              </div>
            </article>

            {/* Услуга 3 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="repeat">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">После первичного разбора</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Повторная онлайн-консультация</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">3 000 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: 45–60 минут</p>
              <p className="text-coal/80 mb-4">
                Действующим клиентам, когда требуется оценить динамику и
                пересобрать следующий этап.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Краткий отчёт, видео, дневник наблюдений и список выполненных рекомендаций.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Сверяем динамику, уточняем гипотезы, меняем критерии и решаем новые вопросы.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Обновлённый план и письменная фиксация изменений.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">До 3 дней.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Формат не заменяет первичную консультацию по новому животному или полностью новому запросу.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата; перенос по общим правилам.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">При большом объёме новых данных рекомендуется сопровождение или новая полная консультация.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=repeat">Записаться</Link>
              </div>
            </article>

            {/* Услуга 4 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="second">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">Ветеринарный формат</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Второе мнение / разбор анализов</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">2 500 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: Без обязательной встречи</p>
              <p className="text-coal/80 mb-4">
                Когда нужно оценить проведённую диагностику, назначения и
                полноту медицинского маршрута.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Заключения, анализы, протоколы исследований, назначения и краткая хронология симптомов.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Я анализирую документы и формирую обоснованное мнение. При необходимости задаю уточняющие вопросы.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Письменный разбор, вопросы лечащему врачу, рекомендации по дополнительной диагностике и профильному направлению.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">Одно уточнение по готовому разбору в течение 3 дней.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Формат не заменяет осмотр и не используется для экстренных состояний.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата после оценки объёма документов.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">При поведенческой проблеме дополнительно выбирается консультация по поведению.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=second">Записаться</Link>
              </div>
            </article>

            {/* Услуга 5 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="puppy">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">Щенок</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Консультация по щенку</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">3 500 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: 60 минут</p>
              <p className="text-coal/80 mb-4">
                Первые месяцы дома, социализация, туалет, прикусывание, сон,
                прогулки, бытовые процедуры и обучение.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Анкета, возраст, происхождение, режим, рацион, вакцинация и видео бытовых эпизодов.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Разбираем возрастные возможности, среду, нагрузку, безопасность и первые навыки.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">План на ближайшие недели, памятки и чек-лист наблюдения.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">До 3 дней.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Один щенок и один основной блок задач.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата; перенос по общим правилам.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">До появления щенка подойдёт отдельный подготовительный формат.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=puppy">Записаться</Link>
              </div>
            </article>

            {/* Услуга 6 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="before">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">До появления животного</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Подготовка семьи</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">3 500 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: 60 минут</p>
              <p className="text-coal/80 mb-4">
                Семьям, которые готовятся к появлению щенка, взрослой собаки или
                кошки.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Состав семьи, условия дома, распорядок, опыт с животными и планируемый источник животного.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Оцениваем ожидания, среду, первые дни, безопасность, ресурсы и распределение обязанностей.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Чек-лист подготовки, план первых суток и первой недели.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">До 3 дней.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Формат посвящён подготовке среды и семьи, а не оценке конкретного животного у заводчика.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Полная предоплата; перенос по общим правилам.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">Для выбора конкретного щенка предусмотрена расширенная программа.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=before">Записаться</Link>
              </div>
            </article>

            {/* Услуга 7 */}
            <article className="p-[30px] max-md:p-6 bg-white border border-forest/15 rounded-[28px] shadow-[0_16px_45px_rgba(20,20,20,0.05)] flex flex-col tilt-card" id="selection">
              <div className="flex justify-between gap-4 max-sm:flex-col items-start mb-4">
                <div>
                  <span className="tag mb-3">Расширенная программа</span>
                  <h3 className="text-[28px] max-md:text-[24px] font-bold text-coal leading-tight m-0">Подбор щенка</h3>
                </div>
                <div className="text-[28px] font-black text-coal whitespace-nowrap">от 15 000 ₽</div>
              </div>
              <p className="font-[850] text-forest mb-4">Продолжительность: Поэтапная работа</p>
              <p className="text-coal/80 mb-4">
                Когда важен подбор породы, заводчика и конкретного щенка с
                учётом образа жизни семьи.
              </p>
              
              <details className="group my-4 border border-transparent open:border-forest/15 rounded-2xl transition-colors">
                <summary className="font-black cursor-pointer p-4 bg-snow rounded-2xl outline-none hover:bg-fog/50 transition-colors text-coal">Полные условия</summary>
                <div className="grid gap-3 p-2 mt-2">
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что прислать до встречи</strong>
                    <p className="text-coal/80 text-sm">Подробная анкета семьи, условия проживания, график, ожидания, ограничения и бюджет.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что происходит</strong>
                    <p className="text-coal/80 text-sm">Подбор заводчика, коммуникация с заводчиком, анализ информации, взаимодействие с ветеринарными врачами; при необходимости — совместный выезд.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Что вы получаете</strong>
                    <p className="text-coal/80 text-sm">Рекомендации по выбору, памятки по вакцинации, выходу на улицу и первому месяцу щенка дома.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Обратная связь</strong>
                    <p className="text-coal/80 text-sm">В рамках согласованного этапа программы.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Правила общения</strong>
                    <p className="text-coal/80 text-sm">Итоговая стоимость зависит от объёма поиска, количества контактов и необходимости выезда.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Предоплата и перенос</strong>
                    <p className="text-coal/80 text-sm">Этапная предоплата по индивидуальному договору.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-snow">
                    <strong className="block text-coal mb-1 font-bold">Альтернатива</strong>
                    <p className="text-coal/80 text-sm">Для уже выбранного щенка достаточно консультации до появления животного.</p>
                  </div>
                </div>
              </details>
              
              <div className="mt-auto pt-4">
                <Link className="button button-dark" href="/booking?service=selection">Записаться</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-[92px] max-md:py-[64px] bg-[linear-gradient(120deg,theme(colors.forest),theme(colors.soldier))] text-white">
        <div className="container grid grid-cols-2 max-lg:grid-cols-1 gap-16 items-center">
          <div>
            <span className="kicker text-white opacity-80 mb-4 inline-block">
              ДЛИТЕЛЬНАЯ РАБОТА
            </span>
            <h2 className="text-[44px] max-md:text-[34px] leading-tight text-white m-0">Сопровождение с проверкой домашних заданий</h2>
          </div>
          <div>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Онлайн — 22 000 ₽. С выездами — 30 000 ₽. Оплату можно разделить
              на 2, 4 или более частые платежи вплоть до двух раз в неделю по
              согласованному графику.
            </p>
            <Link className="button button-light" href="/support">
              Сравнить форматы
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}