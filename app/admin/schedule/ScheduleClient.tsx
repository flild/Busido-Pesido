'use client';

import { useState, useTransition } from 'react';
import { updateSchedule } from './actions';
import { useToast } from '@/components/Toast';
import { Check, Clock, MessageSquare, AlertCircle, CalendarDays } from 'lucide-react';

function ScheduleRow({ day }: { day: any }) {
  // Чистый стейт. Никаких useEffect. 
  // React сам пересоздаст этот компонент, когда сервер пришлет обновленные данные.
  const [isAvailable, setIsAvailable] = useState(day.is_available === 1);
  const [slots, setSlots] = useState(JSON.parse(day.slots).join(', '));
  const [message, setMessage] = useState(day.custom_message || '');
  
  // Безопасный парсинг даты
  const [y, m, d] = day.date_id.split('-');
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const formattedDate = dateObj.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={`transition-all duration-300 p-5 rounded-2xl border ${isAvailable ? 'bg-white border-forest/20 shadow-sm' : 'bg-snow/60 border-forest/5 opacity-80'}`}>
      <input type="hidden" name="date_id" value={day.date_id} />
      
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        
        {/* ЧЕКБОКС И ДАТА */}
        <label className="flex items-center gap-4 cursor-pointer select-none min-w-[220px]">
          <div className="relative flex items-center justify-center shrink-0">
            <input 
              type="checkbox" 
              name={`is_available_${day.date_id}`} 
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="peer sr-only"
            />
            <div className={`w-7 h-7 rounded-lg border-2 transition-colors ${isAvailable ? 'bg-matcha border-matcha' : 'border-forest/30 bg-white'}`}></div>
            <Check size={18} className={`absolute text-white transition-opacity ${isAvailable ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div>
            <span className="block font-black text-coal text-xl">{day.day_number} число</span>
            <span className="block text-sm font-medium text-coal/50 capitalize mt-0.5">{formattedDate}</span>
          </div>
        </label>

        {/* СЛОТЫ */}
        <div className="flex-1 w-full relative">
          <label className="block text-[11px] font-[800] text-coal/50 uppercase tracking-widest mb-2 ml-1">
            Время (через запятую)
          </label>
          <div className="relative">
            <Clock size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isAvailable ? 'text-matcha' : 'text-coal/30'}`} />
            <input 
              type="text" 
              name={`slots_${day.date_id}`} 
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
              disabled={!isAvailable}
              placeholder="10:00, 12:00, 15:30"
              className={`w-full py-3 pl-10 pr-4 rounded-xl border outline-none transition-all font-bold text-[15px] ${isAvailable ? 'bg-snow border-forest/15 focus:border-forest/40 focus:bg-white text-coal shadow-inner' : 'bg-transparent border-transparent text-coal/40 cursor-not-allowed'}`}
            />
          </div>
        </div>

        {/* ПРИЧИНА ЗАКРЫТИЯ */}
        <div className="flex-1 w-full relative">
          <label className={`block text-[11px] font-[800] uppercase tracking-widest mb-2 ml-1 transition-colors ${!isAvailable ? 'text-rose/70' : 'text-coal/50'}`}>
            Сообщение клиенту
          </label>
          <div className="relative">
            <MessageSquare size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${!isAvailable ? 'text-rose/50' : 'text-coal/30'}`} />
            <input 
              type="text" 
              name={`custom_message_${day.date_id}`} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isAvailable}
              placeholder={isAvailable ? "—" : "Например: Нет мест"}
              className={`w-full py-3 pl-10 pr-4 rounded-xl border outline-none transition-all font-bold text-[15px] ${!isAvailable ? 'bg-rose/5 border-rose/20 focus:border-rose/40 focus:bg-white text-rose shadow-inner' : 'bg-transparent border-transparent text-coal/40 cursor-not-allowed'}`}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export function ScheduleClient({ scheduleData }: { scheduleData: any[] }) {
  const [isPending, startTransition] = useTransition();
  const { say } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await updateSchedule(formData);
      if (res?.error) {
        say(res.error);
      } else {
        say('Расписание успешно сохранено. Некорректные данные отфильтрованы.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* ИНФОБЛОК */}
      <div className="flex items-start gap-4 p-5 bg-snow/80 border border-forest/10 rounded-2xl text-sm font-medium text-coal/80">
        <AlertCircle className="text-forest shrink-0 mt-0.5" size={20} />
        <div>
          <p className="mb-2"><strong>Как заполнять:</strong> Укажите время слотов в формате <code className="bg-white px-1.5 py-0.5 rounded text-matcha font-bold border border-forest/5">ЧЧ:ММ</code> через запятую. Любой другой формат будет автоматически отфильтрован сервером.</p>
          <p className="m-0">Если вы отметите день как доступный, но сотрете все слоты — система автоматически закроет день с пометкой «Нет мест».</p>
        </div>
      </div>

      {/* СПИСОК ДНЕЙ */}
      <div className="flex flex-col gap-3">
        {scheduleData.map((day) => {
          // Изящное решение: составной ключ из самой "сырой" даты.
          // Как только сервер вернет новые данные, ключ поменяется,
          // и React убьет старый компонент строки, отрендерив новый с чистым стейтом.
          const dataKey = `${day.date_id}-${day.is_available}-${day.slots}-${day.custom_message || ''}`;
          
          return <ScheduleRow key={dataKey} day={day} />;
        })}
      </div>
      
      {/* ПЛАВАЮЩАЯ ПАНЕЛЬ СОХРАНЕНИЯ */}
      <div className="sticky bottom-6 z-20 flex justify-between items-center p-4 bg-white/90 backdrop-blur-md border border-forest/15 rounded-2xl shadow-xl mt-4 max-sm:flex-col max-sm:gap-4">
        <div className="flex items-center gap-3 text-coal font-bold">
          <CalendarDays size={20} className="text-forest" />
          <span>Настроено {scheduleData.length} дней</span>
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-coal text-white font-bold hover:bg-forest transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed max-sm:w-full max-sm:justify-center"
        >
          {isPending ? (
            <>Сохраняем...</>
          ) : (
            <>Сохранить расписание</>
          )}
        </button>
      </div>
    </form>
  );
}