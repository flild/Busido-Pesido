// app/admin/cases/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteCase(formData: FormData) {
  const id = formData.get('id');
  if (!id) throw new Error('ID не передан');
  
  const stmt = db.prepare('DELETE FROM cases WHERE id = ?');
  const info = stmt.run(id);
  
  if (info.changes === 0) throw new Error('Кейс не найден');
  
  revalidatePath('/admin/cases');
  revalidatePath('/');
}

export async function saveCase(formData: FormData) {
  const id = (formData.get('id') as string)?.trim();
  const oldId = (formData.get('old_id') as string)?.trim(); 
  const theme = (formData.get('theme') as string)?.trim();
  const tab_title = (formData.get('tab_title') as string)?.trim();
  const main_title = (formData.get('main_title') as string)?.trim();
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const steps = formData.get('steps') as string;

  if (!id || !theme || !tab_title || !main_title || !steps) {
    throw new Error('Заполните обязательные поля');
  }

  // Валидация JSON, чтобы не положить фронт кривыми данными
  try {
    JSON.parse(steps);
  } catch {
    throw new Error('Ошибка формата шагов (Invalid JSON)');
  }

  if (oldId) {
    const stmt = db.prepare(`
      UPDATE cases 
      SET id = ?, theme = ?, tab_title = ?, main_title = ?, steps = ?, sort_order = ?
      WHERE id = ?
    `);
    stmt.run(id, theme, tab_title, main_title, steps, sort_order, oldId);
  } else {
    // Защита от дублей Primary Key перехватится глобальным обработчиком, 
    // но можно и тут обернуть в try/catch при желании
    const stmt = db.prepare(`
      INSERT INTO cases (id, theme, tab_title, main_title, steps, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, theme, tab_title, main_title, steps, sort_order);
  }

  revalidatePath('/admin/cases');
  revalidatePath('/');
  redirect('/admin/cases');
}