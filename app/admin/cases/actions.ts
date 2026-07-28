'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteCase(id: string) {
  const stmt = db.prepare('DELETE FROM cases WHERE id = ?');
  const info = stmt.run(id);
  
  if (info.changes === 0) throw new Error('Кейс не найден');
  
  revalidatePath('/admin/cases');
  revalidatePath('/');
}

// Умная сортировка кейсов
export async function moveCase(id: string, direction: 'up' | 'down') {
  const current = db.prepare('SELECT id, sort_order FROM cases WHERE id = ?').get(id) as { id: string, sort_order: number };
  if (!current) return;

  const op = direction === 'up' ? '<' : '>';
  const order = direction === 'up' ? 'DESC' : 'ASC';

  const adjacent = db.prepare(`
    SELECT id, sort_order FROM cases 
    WHERE sort_order ${op} ? 
    ORDER BY sort_order ${order} LIMIT 1
  `).get(current.sort_order) as { id: string, sort_order: number } | undefined;

  if (adjacent) {
    db.prepare('UPDATE cases SET sort_order = ? WHERE id = ?').run(adjacent.sort_order, current.id);
    db.prepare('UPDATE cases SET sort_order = ? WHERE id = ?').run(current.sort_order, adjacent.id);
  } else {
    const newOrder = direction === 'up' ? current.sort_order - 1 : current.sort_order + 1;
    db.prepare('UPDATE cases SET sort_order = ? WHERE id = ?').run(newOrder, current.id);
  }
  
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

  try {
    JSON.parse(steps);
  } catch {
    throw new Error('Ошибка формата шагов (Invalid JSON)');
  }

  if (oldId) {
    db.prepare(`
      UPDATE cases 
      SET id = ?, theme = ?, tab_title = ?, main_title = ?, steps = ?, sort_order = ?
      WHERE id = ?
    `).run(id, theme, tab_title, main_title, steps, sort_order, oldId);
  } else {
    db.prepare(`
      INSERT INTO cases (id, theme, tab_title, main_title, steps, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, theme, tab_title, main_title, steps, sort_order);
  }

  revalidatePath('/admin/cases');
  revalidatePath('/');
  redirect('/admin/cases');
}