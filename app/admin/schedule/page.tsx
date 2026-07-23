import { db } from '@/lib/db';
import { ScheduleClient } from './ScheduleClient';

export const dynamic = 'force-dynamic';

export default async function AdminSchedule() {
  const schedule = db.prepare('SELECT * FROM free_schedule ORDER BY day_number ASC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-coal m-0">Расписание бесплатных слотов</h1>
          <p className="text-coal/60 mt-1">Открывается с 1 по 7 число каждого месяца.</p>
        </div>
      </div>
      
      <ScheduleClient scheduleData={schedule} />
    </>
  );
}