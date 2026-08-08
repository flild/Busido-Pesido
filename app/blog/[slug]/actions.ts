'use server';

import { db } from '@/lib/db';

export async function recordView(slug: string) {
  try {
    const article = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug) as { id: number } | undefined;
    if (!article) return;

    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
    db.prepare('INSERT INTO article_views_log (article_id) VALUES (?)').run(article.id);
  } catch (error) {
    console.error(`Ошибка записи просмотра для статьи ${slug}:`, error);
  }
}

export async function recordReadCompletion(slug: string) {
  try {
    db.prepare('UPDATE articles SET reads_count = reads_count + 1 WHERE slug = ?').run(slug);
  } catch (error) {
    console.error(`Ошибка записи дочитывания ${slug}:`, error);
  }
}

export async function recordFeedback(slug: string, isLike: boolean) {
  try {
    const column = isLike ? 'likes' : 'dislikes';
    db.prepare(`UPDATE articles SET ${column} = ${column} + 1 WHERE slug = ?`).run(slug);
  } catch (error) {
    console.error(`Ошибка записи фидбека ${slug}:`, error);
  }
}