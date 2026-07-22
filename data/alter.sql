-- Добавляем новые колонки в таблицу articles
ALTER TABLE articles ADD COLUMN is_premium INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN views INTEGER DEFAULT 0;

-- Создаём таблицу логов просмотров
CREATE TABLE IF NOT EXISTS article_views_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);