'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateAppStatus(id: number, status: string) {
  try {
    const stmt = db.prepare('UPDATE applications SET status = ? WHERE id = ?');
    stmt.run(status, id);
    // Инвалидируем кэш, чтобы серверный компонент сразу перерендерил таблицу с новыми данными
    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    throw new Error('Не удалось обновить статус');
  }
}

export async function deleteApp(id: number) {
  try {
    const stmt = db.prepare('DELETE FROM applications WHERE id = ?');
    stmt.run(id);
    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    throw new Error('Не удалось удалить заявку');
  }
}