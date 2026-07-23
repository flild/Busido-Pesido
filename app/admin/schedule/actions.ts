'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateSchedule(formData: FormData) {
  try {
    const dateIds = formData.getAll('date_id') as string[];
    
    const updateStmt = db.prepare(`
      UPDATE free_schedule 
      SET is_available = ?, custom_message = ?, slots = ? 
      WHERE date_id = ?
    `);

    const transaction = db.transaction((dates: string[]) => {
      for (const date of dates) {
        let isAvailable = formData.get(`is_available_${date}`) ? 1 : 0;
        let customMessage = (formData.get(`custom_message_${date}`) as string)?.trim();
        
        const rawSlots = formData.get(`slots_${date}`) as string;
        
        // Строгий парсинг: разбиваем по запятой, убираем пробелы, оставляем только формат ЧЧ:ММ
        let parsedSlots = rawSlots 
          ? rawSlots.split(',')
              .map(s => s.trim())
              .filter(s => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(s)) 
          : [];
        
        // ЗАЩИТА: Если отметили "Доступно", но валидных слотов нет -> снимаем галочку
        if (isAvailable === 1 && parsedSlots.length === 0) {
          isAvailable = 0;
          customMessage = customMessage || 'Нет мест';
        }

        // Если недоступно, а сообщение пустое -> ставим заглушку по умолчанию
        if (isAvailable === 0 && !customMessage) {
          customMessage = 'Нет мест';
        }

        updateStmt.run(isAvailable, customMessage || null, JSON.stringify(parsedSlots), date);
      }
    });

    transaction(dateIds);
    revalidatePath('/');
    revalidatePath('/admin/schedule');
    revalidatePath('/free-consultations');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения расписания:', error);
    return { error: 'Не удалось сохранить расписание. Проверьте базу данных.' };
  }
}