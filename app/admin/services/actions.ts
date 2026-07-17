'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Метод обновления базовых данных услуги (цена, описание)
export async function updateServiceBase(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const linkText = formData.get('linkText') as string;

  const stmt = db.prepare(`
    UPDATE services 
    SET title = ?, price = ?, description = ?, link_text = ?
    WHERE id = ?
  `);

  stmt.run(title, price, description, linkText, id);

  // Инвалидируем кэш главной страницы, чтобы изменения появились моментально
  revalidatePath('/');
  revalidatePath('/admin/services');
}