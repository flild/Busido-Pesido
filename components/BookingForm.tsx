'use client';
import { useState, useRef } from 'react';
import { useToast } from './Toast';
import Link from 'next/link';

interface ServiceType {
  id: string;
  name: string;
  price: string;
}

interface SpecialistType {
  id: number;
  name: string;
  role: string;
  city: string;
}

export function BookingForm({ 
  initialService, 
  initialPet, 
  initialSpecialist,
  services,
  specialists,
  minDate
}: { 
  initialService?: string | null, 
  initialPet?: string | null,
  initialSpecialist?: string | null,
  services: ServiceType[],
  specialists: SpecialistType[],
  minDate: string
}) {
  const { say } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const defaultService = initialService ? services.find(s => s.id === initialService) : null;
  const defaultPet = (initialPet === 'dog' || initialPet === 'cat') ? initialPet : null;
  
  const [activeService, setActiveService] = useState<string | null>(defaultService?.name || null);
  const [activePrice, setActivePrice] = useState<string | null>(defaultService?.price || null);
  // Стейт специалиста (храним ID как строку, чтобы совпадало с URL, или 'any')
  const [activeSpecialist, setActiveSpecialist] = useState<string | null>(initialSpecialist || null);
  const [petType, setPetType] = useState<string | null>(defaultPet);
  const [contactValue, setContactValue] = useState('');
  
  const [isPriority, setIsPriority] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... handleContactChange оставляем без изменений ...
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.startsWith('@')) { setContactValue(val); return; }
    let num = val.replace(/\D/g, '');
    if (!num) { setContactValue(''); return; }
    if (num[0] === '8' || num[0] === '7' || num[0] === '9') {
      if (num[0] === '9') num = '7' + num;
      else num = '7' + num.substring(1);
    }
    let formatted = '+7 ';
    if (num.length > 1) formatted += '(' + num.substring(1, 4);
    if (num.length > 4) formatted += ') ' + num.substring(4, 7);
    if (num.length > 7) formatted += '-' + num.substring(7, 9);
    if (num.length > 9) formatted += '-' + num.substring(9, 11);
    setContactValue(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!activeService) { say('Пожалуйста, выберите формат работы.'); return; }
    if (!petType) { say('Пожалуйста, выберите вид питомца.'); return; }

    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    const preferredDate = formData.get('prefDate');
    const preferredTime = formData.get('prefTime');

    const data = {
      service: activeService,
      date: preferredDate ? `${preferredDate}` : 'Не указана',
      time: preferredTime ? `${preferredTime}` : 'Не указано',
      name: formData.get('name'),
      email: formData.get('email'),
      contact: contactValue,
      petName: formData.get('petName'),
      petType: petType,
      request_text: formData.get('request'),
      is_priority: isPriority,
      specialist_id: activeSpecialist === 'any' ? null : activeSpecialist
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Ошибка при отправке');

      say('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
      formRef.current?.reset();
      setActiveService(null);
      setActivePrice(null);
      setActiveSpecialist(null);
      setPetType(null);
      setContactValue('');
      setIsPriority(false);
    } catch (err: any) {
      say(err.message || 'Ошибка при отправке заявки.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_340px] gap-7 items-start tablet:grid-cols-1">
      <div className="p-8 bg-white border border-forest/15 rounded-[34px] mobile:p-5">
        
        {/* ШАГ 1: Формат */}
        <div className="flex gap-4 items-start mt-2 mb-5">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">1</span>
          <div>
            <h2 className="text-[28px] m-0 leading-tight">Выберите формат</h2>
            <p className="text-coal/60 mt-1">Окончательная стоимость обсуждается при подтверждении.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 mb-10 mobile:grid-cols-1">
          {services.map(s => {
            const isSelected = activeService === s.name;
            return (
              <button 
                key={s.id}
                type="button" 
                className={`border rounded-2xl p-4 text-left font-[800] transition-colors cursor-pointer ${isSelected ? 'bg-coal text-white border-coal shadow-md' : 'bg-paper text-coal border-forest/15 hover:bg-snow'}`} 
                onClick={() => { setActiveService(s.name); setActivePrice(s.price); }}
              >
                {s.name} <b className={`block mt-1 ${isSelected ? 'text-white/80' : 'text-forest'}`}>{s.price}</b>
              </button>
            )
          })}
        </div>

        {/* ШАГ 2: Специалист (НОВЫЙ БЛОК) */}
        <div className="flex gap-4 items-start mt-2 mb-5">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">2</span>
          <div>
            <h2 className="text-[28px] m-0 leading-tight">Выберите специалиста</h2>
            <p className="text-coal/60 mt-1">К кому вы хотите попасть на прием?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-10 mobile:grid-cols-1">
          {specialists.map(spec => {
            const isSelected = activeSpecialist === spec.id.toString();
            return (
              <button 
                key={spec.id}
                type="button" 
                className={`border rounded-2xl p-4 text-left font-[800] transition-colors cursor-pointer flex flex-col justify-between ${isSelected ? 'bg-coal text-white border-coal shadow-md' : 'bg-paper text-coal border-forest/15 hover:bg-snow'}`} 
                onClick={() => setActiveSpecialist(spec.id.toString())}
              >
                <div>
                  <div className="text-lg">{spec.name}</div>
                  <div className={`text-[11px] uppercase tracking-wider font-bold mt-1 ${isSelected ? 'text-white/60' : 'text-matcha'}`}>{spec.role}</div>
                </div>
                {spec.city && (
                  <div className={`mt-3 text-xs font-bold ${isSelected ? 'text-caramel' : 'text-coal/40'}`}>
                    📍 {spec.city}
                  </div>
                )}
              </button>
            )
          })}
          <button 
            type="button" 
            className={`border rounded-2xl p-4 text-left font-[800] transition-colors cursor-pointer flex items-center justify-center min-h-[90px] ${activeSpecialist === 'any' || activeSpecialist === null ? 'bg-coal text-white border-coal shadow-md' : 'bg-paper text-coal border-forest/15 hover:bg-snow'}`} 
            onClick={() => setActiveSpecialist('any')}
          >
            Любой свободный специалист
          </button>
        </div>

        {/* ШАГ 3: Анкетные данные */}
        <div className="flex gap-4 items-start mt-2 mb-6">
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-coal text-white font-black">3</span>
          <div>
            <h2 className="text-[28px] m-0 leading-tight">Ваши данные и пожелания</h2>
            <p className="text-coal/60 mt-1">После проверки заявки вы получите ссылку на полную анкету.</p>
          </div>
        </div>
        
        <form className="grid grid-cols-2 gap-4 mobile:grid-cols-1" id="bookingForm" ref={formRef} onSubmit={handleSubmit}>
          
          <label className="flex flex-col gap-2 font-[850] text-coal">
            <span>Имя <span className="text-rose ml-0.5">*</span></span>
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="text" name="name" required placeholder="Как к вам обращаться" maxLength={50} />
          </label>

          <label className="flex flex-col gap-2 font-[850] text-coal">
            <span>Email <span className="text-rose ml-0.5">*</span></span>
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="email" name="email" required placeholder="your@email.com" />
          </label>

          <label className="flex flex-col gap-2 font-[850] text-coal col-span-2 mobile:col-span-1">
            <span>Связь (Телефон или Telegram) <span className="text-rose ml-0.5">*</span></span>
            <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha invalid:focus:border-rose" type="text" name="contact" value={contactValue} onChange={handleContactChange} required minLength={4} maxLength={18} placeholder="+7 (999) 000-00-00 или @username" />
          </label>

          <div className="col-span-2 mobile:col-span-1 grid grid-cols-2 gap-4 bg-snow/50 p-4 rounded-2xl border border-forest/10 my-2">
            <label className="flex flex-col gap-2 font-[850] text-coal">
              <span>Желаемая дата</span>
              <input className="p-3 border border-forest/15 rounded-xl bg-white font-normal outline-none focus:border-matcha text-coal min-h-[50px]" type="date" name="prefDate" min={minDate} />
            </label>
            <label className="flex flex-col gap-2 font-[850] text-coal">
              <span>Время суток</span>
              <select className="p-3 border border-forest/15 rounded-xl bg-white font-normal outline-none focus:border-matcha text-coal min-h-[50px] appearance-none" name="prefTime">
                <option value="">Любое время</option>
                <option value="Утро (10:00 - 13:00)">Утро (10:00 - 13:00)</option>
                <option value="День (13:00 - 17:00)">День (13:00 - 17:00)</option>
                <option value="Вечер (17:00 - 20:00)">Вечер (17:00 - 20:00)</option>
              </select>
            </label>
          </div>

          <div className="col-span-2 mobile:col-span-1 grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 font-[850] text-coal">
              <span>Кличка питомца</span>
              <input className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha" type="text" name="petName" placeholder="Например, Шарик" maxLength={30} />
            </label>
            <div className="flex flex-col gap-2 font-[850] text-coal">
              <span>Вид <span className="text-rose ml-0.5">*</span></span>
              <div className="flex gap-2 h-[54px]">
                <button type="button" onClick={() => setPetType('dog')} className={`flex-1 rounded-xl border font-bold transition-colors ${petType === 'dog' ? 'bg-coal text-white border-coal' : 'bg-paper text-coal border-forest/15 hover:bg-snow'}`}>Собака</button>
                <button type="button" onClick={() => setPetType('cat')} className={`flex-1 rounded-xl border font-bold transition-colors ${petType === 'cat' ? 'bg-coal text-white border-coal' : 'bg-paper text-coal border-forest/15 hover:bg-snow'}`}>Кошка</button>
              </div>
            </div>
          </div>

          <label className="flex flex-col gap-2 font-[850] text-coal col-span-2 mobile:col-span-1">
            <span>Кратко опишите запрос</span>
            <textarea className="p-3.5 border border-forest/15 rounded-xl bg-paper font-normal outline-none focus:border-matcha resize-y" name="request" rows={3} placeholder="С чем нужна помощь? Основные проявления проблемы." maxLength={1000}></textarea>
          </label>

          <label className="col-span-2 mobile:col-span-1 flex gap-3 items-start font-[500] mt-2 p-4 rounded-xl border border-rose/20 bg-rose/5 cursor-pointer transition-colors hover:bg-rose/10">
            <input type="checkbox" className="mt-1 w-5 h-5 accent-rose cursor-pointer shrink-0" checked={isPriority} onChange={(e) => setIsPriority(e.target.checked)} />
            <span className="text-sm text-coal/90 leading-snug">
              <strong className="text-rose block mb-0.5">Мне нужно срочно (Приоритет)</strong>
              Заявка будет рассмотрена вне очереди. Применяется наценка +50%.
            </span>
          </label>
          
          <label className="col-span-2 mobile:col-span-1 flex gap-3 items-start font-[500] mt-4 p-4 rounded-xl bg-snow/80 border border-forest/10 cursor-pointer hover:bg-snow transition-colors">
            <input 
              type="checkbox" 
              name="agreement"
              required 
              className="mt-1 w-5 h-5 accent-matcha cursor-pointer shrink-0 border-forest/20" 
            />
            <span className="text-sm text-coal/80 leading-snug">
              Я даю согласие на обработку персональных данных в соответствии с <Link href="/privacy" className="text-matcha underline underline-offset-2 hover:text-forest">Политикой конфиденциальности</Link> и принимаю условия <Link href="/terms" className="text-matcha underline underline-offset-2 hover:text-forest">Оферты</Link>.
            </span>
          </label>
          
          <button className="button button-primary col-span-2 mobile:col-span-1 mt-4 shadow-none h-[60px] text-lg disabled:bg-coal/40" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Оставить заявку'}
          </button>
        </form>
      </div>

      <aside className="sticky top-[100px] p-[30px] rounded-[30px] bg-coal text-white tablet:static flex flex-col">
        <span className="micro text-forest">ВАША ЗАПИСЬ</span>
        <h3 className="text-[28px] mt-2 mb-1">{activeService || "Формат не выбран"}</h3>
        <div className="text-[40px] font-[950] text-oat leading-none mb-6">{activePrice || "—"}</div>
        
        <dl className="mb-6">
          <div className="flex justify-between py-3 border-b border-white/10">
            <dt>Специалист</dt>
            <dd className="m-0 font-[850] text-right">
              {activeSpecialist && activeSpecialist !== 'any' 
                ? specialists.find(s => s.id.toString() === activeSpecialist)?.name 
                : 'Любой'}
            </dd>
          </div>
          <div className="flex justify-between py-3 border-b border-white/10">
            <dt>Питомец</dt>
            <dd className="m-0 font-[850]">{petType === 'dog' ? 'Собака' : petType === 'cat' ? 'Кошка' : '—'}</dd>
          </div>
        </dl>
        
        {isPriority && (
          <div className="p-4 rounded-2xl bg-rose/10 border border-rose/20 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="inline-block px-2.5 py-1 rounded-md bg-rose text-white text-[10px] font-black uppercase tracking-wider mb-2">Приоритет активирован</span>
            <p className="text-sm text-white/80 leading-relaxed mb-3">Заявка будет рассмотрена вне очереди.</p>
          </div>
        )}
      </aside>
    </div>
  );
}