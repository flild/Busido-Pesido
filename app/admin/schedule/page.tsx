import { db } from '@/lib/db';
import { updateSchedule } from './actions';

export default async function AdminSchedule() {
  const schedule = db.prepare('SELECT * FROM free_schedule ORDER BY day_number ASC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Расписание консультаций</h1>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm p-8">
        <form action={updateSchedule} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {schedule.map((day) => {
              const slotsArray = JSON.parse(day.slots);
              const slotsString = slotsArray.join(', ');

              return (
                <div key={day.date_id} className="grid grid-cols-[100px_1fr_1.5fr_1fr] gap-4 items-center p-4 border border-forest/15 rounded-xl bg-snow">
                  <input type="hidden" name="date_id" value={day.date_id} />
                  
                  <div className="font-bold text-coal text-lg">
                    {day.day_number} число
                  </div>

                  <label className="flex items-center gap-2 font-medium text-coal cursor-pointer">
                    <input 
                      type="checkbox" 
                      name={`is_available_${day.date_id}`} 
                      defaultChecked={day.is_available === 1}
                      className="w-4 h-4 accent-matcha"
                    />
                    Доступно для записи
                  </label>

                  <label className="flex flex-col gap-1 text-[12px] font-bold text-coal/70">
                    Слоты (через запятую)
                    <input 
                      type="text" 
                      name={`slots_${day.date_id}`} 
                      defaultValue={slotsString} 
                      placeholder="10:00, 12:00, 15:30"
                      className="p-2 border border-forest/15 rounded-md bg-white text-coal outline-none focus:border-forest/40" 
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-[12px] font-bold text-coal/70">
                    Сообщение (если недоступно)
                    <input 
                      type="text" 
                      name={`custom_message_${day.date_id}`} 
                      defaultValue={day.custom_message || ''} 
                      placeholder="Нет мест"
                      className="p-2 border border-forest/15 rounded-md bg-white text-coal outline-none focus:border-forest/40" 
                    />
                  </label>
                </div>
              );
            })}
          </div>
          
          <button type="submit" className="self-end px-8 py-3 rounded-full bg-forest text-white font-bold hover:bg-coal transition-colors">
            Сохранить расписание
          </button>
        </form>
      </div>
    </>
  );
}