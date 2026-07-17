'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveArticle(id: number | null, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const summary = formData.get('summary') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const tag = formData.get('tag') as string;
  const status = formData.get('status') as string;

  try {
    if (id) {
      const stmt = db.prepare(`
        UPDATE articles 
        SET title = ?, slug = ?, summary = ?, content = ?, category = ?, tag = ?, status = ?
        WHERE id = ?
      `);
      stmt.run(title, slug, summary, content, category, tag, status, id);
    } else {
      const stmt = db.prepare(`
        INSERT INTO articles (title, slug, summary, content, category, tag, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(title, slug, summary, content, category, tag, status);
    }
  } catch (error: any) {
    // В SQLite 19 ошибка — это ограничение уникальности (например, дубль slug)
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { error: 'Статья с таким URL (slug) уже существует.' };
    }
    return { error: 'Ошибка базы данных при сохранении.' };
  }

  // Сбрасываем кэш, чтобы изменения сразу появились на проде и в админке
  revalidatePath('/admin/articles');
  revalidatePath('/');
  revalidatePath('/library');
  
  // Редирект должен быть вне блока try-catch, так как под капотом он кидает ошибку NEXT_REDIRECT
  redirect('/admin/articles');
}

export async function deleteArticle(id: number) {
  try {
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    revalidatePath('/admin/articles');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Не удалось удалить статью' };
  }
}