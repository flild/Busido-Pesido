'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteService(id: string) {
  const stmt = db.prepare('DELETE FROM services WHERE id = ?');
  const info = stmt.run(id);
  
  if (info.changes === 0) throw new Error('Услуга не найдена');
  
  revalidatePath('/admin/services');
  revalidatePath('/');
}

export async function moveService(id: string, direction: 'up' | 'down') {
  const current = db.prepare('SELECT id, sort_order FROM services WHERE id = ?').get(id) as { id: string, sort_order: number };
  if (!current) return;

  const op = direction === 'up' ? '<' : '>';
  const order = direction === 'up' ? 'DESC' : 'ASC';

  const adjacent = db.prepare(`
    SELECT id, sort_order FROM services 
    WHERE sort_order ${op} ? 
    ORDER BY sort_order ${order} LIMIT 1
  `).get(current.sort_order) as { id: string, sort_order: number } | undefined;

  if (adjacent) {
    db.prepare('UPDATE services SET sort_order = ? WHERE id = ?').run(adjacent.sort_order, current.id);
    db.prepare('UPDATE services SET sort_order = ? WHERE id = ?').run(current.sort_order, adjacent.id);
  } else {
    const newOrder = direction === 'up' ? current.sort_order - 1 : current.sort_order + 1;
    db.prepare('UPDATE services SET sort_order = ? WHERE id = ?').run(newOrder, current.id);
  }
  
  revalidatePath('/admin/services');
  revalidatePath('/');
}

export async function saveService(formData: FormData) {
  const id = (formData.get('id') as string)?.trim();
  const oldId = (formData.get('old_id') as string)?.trim(); 
  const title = (formData.get('title') as string)?.trim();
  const price = (formData.get('price') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const tag = (formData.get('tag') as string)?.trim() || null;
  const theme = (formData.get('theme') as string)?.trim();
  const link = (formData.get('link') as string)?.trim();
  const link_text = (formData.get('link_text') as string)?.trim();
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const is_featured = formData.get('is_featured') === 'on' ? 1 : 0;
  const steps = formData.get('steps') as string;

  if (!id || !title || !price || !description || !theme || !link || !link_text || !steps) {
    throw new Error('Заполните все обязательные поля');
  }

  try {
    JSON.parse(steps);
  } catch {
    throw new Error('Ошибка формата шагов (Invalid JSON)');
  }

  if (oldId) {
    db.prepare(`
      UPDATE services 
      SET id = ?, title = ?, price = ?, description = ?, tag = ?, theme = ?, is_featured = ?, link = ?, link_text = ?, steps = ?, sort_order = ?
      WHERE id = ?
    `).run(id, title, price, description, tag, theme, is_featured, link, link_text, steps, sort_order, oldId);
  } else {
    db.prepare(`
      INSERT INTO services (id, title, price, description, tag, theme, is_featured, link, link_text, steps, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, price, description, tag, theme, is_featured, link, link_text, steps, sort_order);
  }

  revalidatePath('/admin/services');
  revalidatePath('/');
  redirect('/admin/services');
}