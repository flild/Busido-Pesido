//app\admin\navigator\actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveNavigatorConfig(formData: FormData) {
  const stepsJson = formData.get('steps') as string;

  try {
    // Жесткая проверка валидности
    JSON.parse(stepsJson);
  } catch {
    return { error: 'Ошибка формата (Invalid JSON)' };
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO settings (key, value) 
      VALUES ('navigator_steps', ?) 
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);
    
    stmt.run(stepsJson);

    revalidatePath('/admin/navigator');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения навигатора:', error);
    return { error: 'Ошибка базы данных при сохранении' };
  }
}