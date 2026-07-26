'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function deleteReview(id: number) {
  const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
  const info = stmt.run(id);
  
  if (info.changes === 0) throw new Error('Отзыв не найден');
  
  revalidatePath('/admin/reviews');
  revalidatePath('/');
}

// Новый экшен: Смена статуса (опубликован/скрыт)
export async function toggleReviewStatus(id: number, currentStatus: string) {
  const newStatus = currentStatus === 'published' ? 'hidden' : 'published';
  db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(newStatus, id);
  revalidatePath('/admin/reviews');
  revalidatePath('/');
}

// Новый экшен: Умная сортировка
export async function moveReview(id: number, direction: 'up' | 'down') {
  const current = db.prepare('SELECT id, sort_order FROM reviews WHERE id = ?').get(id) as { id: number, sort_order: number };
  if (!current) return;

  const op = direction === 'up' ? '<' : '>';
  const order = direction === 'up' ? 'DESC' : 'ASC';

  // Ищем соседний отзыв
  const adjacent = db.prepare(`
    SELECT id, sort_order FROM reviews 
    WHERE sort_order ${op} ? 
    ORDER BY sort_order ${order} LIMIT 1
  `).get(current.sort_order) as { id: number, sort_order: number } | undefined;

  if (adjacent) {
    // Меняем их местами
    db.prepare('UPDATE reviews SET sort_order = ? WHERE id = ?').run(adjacent.sort_order, current.id);
    db.prepare('UPDATE reviews SET sort_order = ? WHERE id = ?').run(current.sort_order, adjacent.id);
  } else {
    // Если соседей нет (он первый/последний), просто двигаем индекс
    const newOrder = direction === 'up' ? current.sort_order - 1 : current.sort_order + 1;
    db.prepare('UPDATE reviews SET sort_order = ? WHERE id = ?').run(newOrder, current.id);
  }
  
  revalidatePath('/admin/reviews');
  revalidatePath('/');
}

export async function saveReview(formData: FormData) {
  const id = formData.get('id');
  const category = (formData.get('category') as string)?.trim();
  const tag = (formData.get('tag') as string)?.trim();
  const pet_name = (formData.get('pet_name') as string)?.trim();
  const breed = (formData.get('breed') as string)?.trim();
  const text = (formData.get('text') as string)?.trim();
  const author = (formData.get('author') as string)?.trim();
  const format = (formData.get('format') as string)?.trim();
  let image_url = (formData.get('existing_image_url') as string)?.trim() || '/reviews/placeholder-dog.png';
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;
  const status = 'published'; // По умолчанию публикуем

  if (!category || !tag || !pet_name || !breed || !text || !author || !format) {
    throw new Error('Заполните все обязательные поля');
  }

  // --- ОБРАБОТКА ФАЙЛА ---
  const file = formData.get('image') as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
    image_url = `/uploads/${filename}`;
  }

  if (id) {
    db.prepare(`
      UPDATE reviews 
      SET category = ?, tag = ?, pet_name = ?, breed = ?, text = ?, author = ?, format = ?, image_url = ?, sort_order = ?
      WHERE id = ?
    `).run(category, tag, pet_name, breed, text, author, format, image_url, sort_order, id);
  } else {
    db.prepare(`
      INSERT INTO reviews (category, tag, pet_name, breed, text, author, format, image_url, sort_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(category, tag, pet_name, breed, text, author, format, image_url, sort_order, status);
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/');
  redirect('/admin/reviews');
}