'use server';

import { db } from '@/lib/db';

export async function recordView(slug: string) {
  try {
    const article = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug) as { id: number } | undefined;
    if (!article) return;

    // 1. Плюсуем общий счетчик статьи
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
    
    // 2. Пишем лог (для графика просмотров по дням)
    db.prepare('INSERT INTO article_views_log (article_id) VALUES (?)').run(article.id);
  } catch (error) {
    console.error('Ошибка записи просмотра:', error);
  }
}