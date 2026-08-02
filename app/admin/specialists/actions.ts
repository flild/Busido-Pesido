'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function saveSpecialist(formData: FormData, id?: number) {
  const name = formData.get('name')?.toString().trim();
  const role = formData.get('role')?.toString().trim();
  const short_bio = formData.get('short_bio')?.toString().trim();
  const full_bio = formData.get('full_bio')?.toString().trim();
  const sort_order = Number(formData.get('sort_order')) || 0;
  const is_main = formData.get('is_main') === 'on' ? 1 : 0;
  
  // Берем старое фото по умолчанию
  let image_url = formData.get('existing_image_url')?.toString().trim() || null;

  if (!name || !role || !short_bio || !full_bio) {
    return { error: 'Заполните все обязательные поля' };
  }

  try {
    // --- ОБРАБОТКА ФАЙЛА ---
    const file = formData.get('image') as File | null;
    
    // Проверяем, что файл реально выбран (Next.js может прислать пустой File с size 0)
    if (file && file.size > 0 && file.name && file.name !== 'undefined') {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const filename = `${Date.now()}-${safeName}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        
        // Перезаписываем URL только если файл успешно сохранен
        image_url = `/uploads/${filename}`;
      } catch (fsError) {
        console.error("Ошибка сохранения файла на диск:", fsError);
        return { error: 'Не удалось сохранить фотографию на сервере.' };
      }
    }

    // Если этого спеца делаем главным — сбрасываем остальных
    if (is_main === 1) {
      db.prepare('UPDATE specialists SET is_main = 0').run();
    }

    // --- СОХРАНЕНИЕ В БД ---
    if (id) {
      db.prepare(`
        UPDATE specialists 
        SET name = ?, role = ?, short_bio = ?, full_bio = ?, image_url = ?, is_main = ?, sort_order = ?
        WHERE id = ?
      `).run(name, role, short_bio, full_bio, image_url, is_main, sort_order, id);
    } else {
      db.prepare(`
        INSERT INTO specialists (name, role, short_bio, full_bio, image_url, is_main, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, role, short_bio, full_bio, image_url, is_main, sort_order);
    }
  } catch (error: any) {
    console.error("Ошибка SQL:", error);
    return { error: 'Ошибка сохранения в базу данных' };
  }

  // Сбрасываем кэш, чтобы новые данные сразу появились на сайте
  revalidatePath('/admin/specialists');
  revalidatePath('/specialists');
  revalidatePath('/');
  
  redirect('/admin/specialists');
}

export async function deleteSpecialist(id: number) {
  try {
    db.prepare('DELETE FROM specialists WHERE id = ?').run(id);
    
    revalidatePath('/admin/specialists');
    revalidatePath('/specialists');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    return { error: 'Ошибка при удалении специалиста' };
  }
}