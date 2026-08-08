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
  // Новое поле для главной картинки:
  const main_image = (formData.get('main_image') as string)?.trim() || null; 

  try {
    if (id) {
      const stmt = db.prepare(`
        UPDATE articles 
        SET title = ?, slug = ?, summary = ?, content = ?, category = ?, tag = ?, status = ?, is_premium = ?, main_image = ?
        WHERE id = ?
      `);
      stmt.run(title, slug, summary, content, category, tag, status, is_premium, main_image, id);
    } else {
      const stmt = db.prepare(`
        INSERT INTO articles (title, slug, summary, content, category, tag, status, is_premium, main_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(title, slug, summary, content, category, tag, status, is_premium, main_image);
    }
  } catch (error: any) {
    if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return { error: 'Статья с таким URL (slug) уже существует.' };
    }
    return { error: 'Ошибка базы данных при сохранении.' };
  }

  if (status === 'published') {
    const articleUrl = `https://busidopesido.ru/blog/${slug}`;
    // Бросаем пинг поисковикам в фоновом режиме (без await)
    notifyIndexNow(articleUrl).catch(console.error);
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

async function notifyIndexNow(url: string) {
  const host = 'busidopesido.ru'; 
  const key = 'busido-pesido-indexnow-key-2026'; // Замени на свой ключ
  const endpoint = 'https://yandex.com/indexnow'; 
  // Яндекс и Bing обмениваются ссылками друг с другом, так что достаточно слать в Яндекс
  
  try {
    const fetchUrl = `${endpoint}?url=${encodeURIComponent(url)}&key=${key}`;
    await fetch(fetchUrl, { method: 'GET' });
    console.log(`IndexNow ping sent for: ${url}`);
  } catch (error) {
    console.error('IndexNow ping failed:', error);
  }
}