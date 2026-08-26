import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Пользовательское соглашение и Оферта — Busido-Pesido",
  description: "Публичная оферта на оказание информационно-консультационных услуг.",
};

export default function TermsPage() {
  return (
    <main className="pt-[108px] pb-[92px] bg-[linear-gradient(180deg,theme(colors.snow),rgba(255,255,255,0))] min-h-screen">
      <div className="container max-w-[800px]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-coal/50 font-bold hover:text-forest transition-colors mb-8">
          <ArrowLeft size={16} /> На главную
        </Link>
        
        <h1 className="text-4xl font-black text-coal mb-4 mobile:text-3xl">
          Публичная оферта
        </h1>
        <p className="text-coal/60 mb-10">Редакция от {new Date().toLocaleDateString('ru-RU')}</p>

        <div className="flex flex-col gap-8 text-coal/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-coal mb-3">1. Общие положения</h2>
            <p className="mb-2">
              Данный документ является официальным предложением (публичной офертой) <strong>Ярославой Ковалевской</strong> (далее — Исполнитель) заключить договор на оказание информационно-консультационных услуг в области зоопсихологии и коррекции поведения животных на изложенных ниже условиях.
            </p>
            <p>Акцептом (принятием) настоящей Оферты признается оплата услуг Исполнителя Пользователем (Заказчиком) либо заполнение формы заявки на сайте.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-coal mb-3">2. Предмет договора</h2>
            <p className="mb-2">Исполнитель обязуется оказать Заказчику услуги по консультированию в вопросах поведения и содержания питомца (онлайн, очно или в иных форматах, указанных на сайте), а Заказчик обязуется оплатить эти услуги.</p>
            <p>Услуги носят информационно-рекомендательный характер. Исполнитель не предоставляет ветеринарные медицинские услуги, если иное не оговорено отдельно (при наличии соответствующего образования и лицензий).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-coal mb-3">3. Порядок оказания услуг</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Заказчик оставляет заявку на сайте, указывая достоверные контактные данные и сведения о питомце.</li>
              <li>Стороны согласовывают время, дату и формат консультации через мессенджеры или электронную почту.</li>
              <li>Перенос или отмена консультации Заказчиком возможны не позднее чем за 24 часа до назначенного времени. В случае нарушения данного срока Исполнитель оставляет за собой право удержать часть предоплаты.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-coal mb-3">4. Права и обязанности сторон</h2>
            <p className="mb-2"><strong>Заказчик обязуется:</strong> предоставлять достоверную информацию о состоянии здоровья, условиях содержания и поведении животного; своевременно оплачивать услуги; выполнять рекомендации Исполнителя для достижения результата.</p>
            <p><strong>Исполнитель обязуется:</strong> качественно и в срок оказывать услуги; соблюдать конфиденциальность переданной Заказчиком информации.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-coal mb-3">5. Ответственность и гарантии</h2>
            <p className="mb-2">Исполнитель не несет ответственности за отсутствие результата, если Заказчик не выполняет выданные рекомендации, скрыл важные данные об анамнезе животного или нарушает протоколы коррекции поведения.</p>
            <p>Вся ответственность за безопасность окружающих и самого животного во время выполнения рекомендаций лежит на Заказчике (владельце).</p>
          </section>

          {/* <section>
            <h2 className="text-xl font-bold text-coal mb-3">6. Реквизиты Исполнителя</h2>
            <div className="bg-snow/50 p-5 rounded-xl border border-forest/10">
              <p className="mb-1"><strong>Индивидуальный предприниматель:</strong> [ФИО]</p>
              <p className="mb-1"><strong>ИНН:</strong> [Ваш ИНН]</p>
              <p className="mb-1"><strong>ОГРНИП:</strong> [Ваш ОГРНИП]</p>
              <p className="mb-1"><strong>Email:</strong> [Ваш Email]</p>
            </div>
          </section> */}
        </div>
      </div>
    </main>
  );
}