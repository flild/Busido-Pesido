'use client';
import { useState, useRef } from 'react';
import { useToast } from './Toast';

export function BookingForm() {
  const { say } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [activePrice, setActivePrice] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      service: activeService || 'Не выбран',
      date: activeDate || 'Не выбрана',
      time: activeTime || 'Не выбрано',
      name: formData.get('name'),
      email: formData.get('email'),
      contact: formData.get('contact'),
      request_text: formData.get('request')
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при отправке на сервер');
      }

      say('Заявка сформирована и отправлена в админку.');
      formRef.current?.reset();
      setActiveDate(null);
      setActiveTime(null);
      setActiveService(null);
      setActivePrice(null);
    } catch (err: any) {
      say(err.message || 'Ошибка при отправке заявки.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      date: d.toLocaleDateString('ru-RU'),
      day: d.getDate(),
      weekday: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(d),
    };
  });

  return (
    <div className="grid grid-cols-[1fr_340px] gap-7 items-start tablet:grid-cols-1">
      <div className="p-8 bg-white border border-forest/15 rounded-[34px] mobile:p-5">
        <div className="flex gap-4 items-start mt-2 mb-5">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">1</span>
          <div>
            <h2 className="text-[28px] m-0">Выберите формат</h2>
            <p className="text-coal/60">Стоимость и условия отображаются до подтверждения.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 mb-10 mobile:grid-cols-1">
          {[
            { name: "Онлайн-консультация", price: "6 000 ₽" },
            { name: "Очная / выездная", price: "8 000 ₽" },
            { name: "Онлайн-сопровождение", price: "22 000 ₽" },
            { name: "Сопровождение с выездами", price: "30 000 ₽" },
            { name: "Повторная онлайн-консультация", price: "3 000 ₽" },
            { name: "Второе мнение", price: "2 500 ₽" },
            { name: "Профессиональный разбор", price: "3 000 ₽" },
            { name: "Бесплатная консультация", price: "0 ₽" }
          ].map(s => {
            const isSelected = activeService === s.name;
            return (
              <button 
                key={s.name}
                type="button" 
                className={`border border-forest/15 rounded-2xl p-3.5 text-left font-[800] transition-colors ${isSelected ? 'bg-coal text-white' : 'bg-paper text-coal hover:bg-snow'}`} 
                onClick={() => { setActiveService(s.name); setActivePrice(s.price); }}
              >
                {s.name} <b className={`block mt-1 ${isSelected ? 'text-white' : 'text-forest'}`}>{s.price}</b>
              </button>
            )
          })}
        </div>

        <div className="flex gap-4 items-start mt-2 mb-5">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">2</span>
          <div>
            <h2 className="text-[28px] m-0">Выберите дату и время</h2>
            <p className="text-coal/60">Это демонстрационный календарь. На рабочем сайте подключается реальная синхронизация.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mobile:grid-cols-4">
          {dates.map((d, i) => (
            <button 
              key={i} 
              type="button" 
              className={`text-center p-[12px_6px] border border-forest/15 rounded-2xl font-[800] transition-colors ${activeDate === d.date ? 'bg-coal text-white' : 'bg-paper text-coal hover:bg-snow'}`}
              onClick={() => setActiveDate(d.date)}
            >
              {d.day}<small className="block font-medium mt-1">{d.weekday}</small>
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 flex-wrap my-3.5 mb-10">
          {['10:00', '12:00', '15:30', '18:00'].map(t => (
            <button 
              key={t} 
              type="button" 
              className={`p-3.5 border border-forest/15 rounded-2xl font-[800] transition-colors ${activeTime === t ? 'bg-coal text-white' : 'bg-paper text-coal hover:bg-snow'}`} 
              onClick={() => setActiveTime(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-start mt-2 mb-5">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">3</span>
          <div>
            <h2 className="text-[28px] m-0">Контакты</h2>
            <p className="text-coal/60">После бронирования вы получите ссылку на анкету.</p>
          </div>
        </div>
        
        <form className="grid grid-cols-2 gap-3.5 mobile:grid-cols-1" id="bookingForm" ref={formRef} onSubmit={handleSubmit}>
          <label className="grid gap-2 font-[850]">
            Имя
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="text" name="name" required placeholder="Как к вам обращаться" />
          </label>
          <label className="grid gap-2 font-[850]">
            e-mail
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="email" name="email" required placeholder="name@example.com" />
          </label>
          <label className="grid gap-2 font-[850] col-span-2 mobile:col-span-1">
            Телефон или Telegram
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="text" name="contact" required placeholder="@username или номер" />
          </label>
          <label className="grid gap-2 font-[850] col-span-2 mobile:col-span-1">
            Кратко опишите запрос
            <textarea className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha resize-y" name="request" rows={4} placeholder="Одно животное и основной запрос"></textarea>
          </label>
          <label className="col-span-2 mobile:col-span-1 flex gap-2.5 items-start font-[600]">
            <input type="checkbox" required className="mt-1 accent-matcha" />
            <span>Я согласен(на) с правилами обработки данных и условиями переноса.</span>
          </label>
          <button 
            className="button button-primary col-span-2 mobile:col-span-1 mt-2" 
            type="submit" 
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Отправка...' : 'Сформировать заявку'}
          </button>
        </form>
      </div>

      <aside className="sticky top-[100px] p-[30px] rounded-[30px] bg-coal text-white tablet:static">
        <span className="micro text-forest">ВАША ЗАПИСЬ</span>
        <h3 className="text-[28px] mt-2 mb-1">{activeService || "Формат не выбран"}</h3>
        <div className="text-[40px] font-[950] text-oat leading-none mb-6">{activePrice || "—"}</div>
        <dl>
          <div className="flex justify-between py-3 border-b border-white/10"><dt>Дата</dt><dd className="m-0 font-[850]">{activeDate || "—"}</dd></div>
          <div className="flex justify-between py-3 border-b border-white/10"><dt>Время</dt><dd className="m-0 font-[850]">{activeTime || "—"}</dd></div>
          <div className="flex justify-between py-3 border-b border-white/10"><dt>Животное</dt><dd className="m-0 font-[850]">одно</dd></div>
        </dl>
        <div className="p-3.5 rounded-2xl bg-white/10 text-[13px] text-fog my-6">После выбора слота заполняется анкета. Файлы можно приложить сразу или дослать позднее.</div>
        <a className="text-link text-white hover:text-fog transition-colors" href="/services">Сравнить условия →</a>
      </aside>
    </div>
  );
}