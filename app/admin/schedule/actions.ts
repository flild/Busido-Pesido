'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateSchedule(formData: FormData) {
  // Получаем массив всех дат, которые мы отправили из формы
  const dateIds = formData.getAll('date_id') as string[];
  
  // Используем транзакцию для атомарного обновления расписания
  const updateStmt = db.prepare(`
    UPDATE free_schedule 
    SET is_available = ?, custom_message = ?, slots = ? 
    WHERE date_id = ?
  `);

  const transaction = db.transaction((dates: string[]) => {
    for (const date of dates) {
      const isAvailable = formData.get(`is_available_${date}`) ? 1 : 0;
      const customMessage = formData.get(`custom_message_${date}`) as string;
      
      // Парсим введенные слоты через запятую (например "10:00, 12:00") в JSON массив
      const rawSlots = formData.get(`slots_${date}`) as string;
      const parsedSlots = rawSlots ? rawSlots.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      
      updateStmt.run(isAvailable, customMessage || null, JSON.stringify(parsedSlots), date);
    }
  });

  transaction(dateIds);
  revalidatePath('/');
  revalidatePath('/admin/schedule');
}