// app/admin/reviews/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteReview(formData: FormData) {
  const id = formData.get('id');
  if (!id) throw new Error('ID не передан');
  
  const stmt = db.prepare('DELETE FROM reviews WHERE id = ?');
  const info = stmt.run(id);
  
  if (info.changes === 0) throw new Error('Отзыв не найден');
  
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
  const image_url = (formData.get('image_url') as string)?.trim() || '/reviews/placeholder-dog.png';
  const sort_order = parseInt(formData.get('sort_order') as string) || 0;

  if (!category || !tag || !pet_name || !breed || !text || !author || !format) {
    throw new Error('Заполните все обязательные поля');
  }

  if (id) {
    const stmt = db.prepare(`
      UPDATE reviews 
      SET category = ?, tag = ?, pet_name = ?, breed = ?, text = ?, author = ?, format = ?, image_url = ?, sort_order = ?
      WHERE id = ?
    `);
    stmt.run(category, tag, pet_name, breed, text, author, format, image_url, sort_order, id);
  } else {
    const stmt = db.prepare(`
      INSERT INTO reviews (category, tag, pet_name, breed, text, author, format, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(category, tag, pet_name, breed, text, author, format, image_url, sort_order);
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/');
  redirect('/admin/reviews');
}