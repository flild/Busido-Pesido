'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveArticle(id: number | null, formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim();
  const summary = (formData.get('summary') as string)?.trim();
  const content = formData.get('content') as string;
  const category = (formData.get('category') as string)?.trim();
  const tag = (formData.get('tag') as string)?.trim();
  const status = (formData.get('status') as string)?.trim();
  const is_premium = formData.get('is_premium') ? 1 : 0;

  try {
    if (id) {
      const stmt = db.prepare(`
        UPDATE articles 
        SET title = ?, slug = ?, summary = ?, content = ?, category = ?, tag = ?, status = ?, is_premium = ?
        WHERE id = ?
      `);
      stmt.run(title, slug, summary, content, category, tag, status, is_premium, id);
    } else {
      const stmt = db.prepare(`
        INSERT INTO articles (title, slug, summary, content, category, tag, status, is_premium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(title, slug, summary, content, category, tag, status, is_premium);
    }
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { error: 'Статья с таким URL (slug) уже существует.' };
    }
    return { error: 'Ошибка базы данных при сохранении.' };
  }

  revalidatePath('/admin/articles');
  revalidatePath('/blog');
  revalidatePath('/');
  redirect('/admin/articles');
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get('id');
  if (!id) throw new Error('ID не передан');
  
  db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  
  revalidatePath('/admin/articles');
  revalidatePath('/blog');
  revalidatePath('/');
}