import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Защита от утечек соединений при hot-reload в Next.js
const globalForDb = globalThis as unknown as {
  db: Database.Database | undefined;
};

export const db = globalForDb.db ?? new Database(path.join(dbDir, 'sqlite.db'));

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}

// Включаем WAL (Write-Ahead Logging) для лучшей производительности и конкурентности
db.pragma('journal_mode = WAL');

// Инициализация таблиц
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT,
    tag TEXT,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT,
    date TEXT,
    time TEXT,
    name TEXT,
    email TEXT,
    contact TEXT,
    request_text TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Демо-данные оставляю, как были, они для тестов сойдут
const count = db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number };
if (count.c === 0) {
  const insertApp = db.prepare(`
    INSERT INTO applications (service, date, time, name, email, contact, request_text, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);
  
  insertApp.run('Онлайн-консультация', '12.11.2023', '15:30', 'Анна', 'anna@example.com', '@anna_tg', 'Собака тянет поводок', 'new', '-2 days');
  insertApp.run('Очная / выездная', '15.11.2023', '12:00', 'Михаил', 'mike@example.com', '1234567890', 'Агрессия к собакам', 'contacted', '-5 days');
}

const articleCount = db.prepare('SELECT COUNT(*) as c FROM articles').get() as { c: number };
if (articleCount.c === 0) {
  const insertArticle = db.prepare(`
    INSERT INTO articles (title, slug, summary, content, category, tag)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertArticle.run(
    'Почему известная команда исчезает в сложной ситуации',
    'command-disappears',
    'Доступность внимания, уровень возбуждения, контекст и история подкрепления.',
    'Полный текст статьи...',
    'dogs learning',
    'Собаки · обучение'
  );
}

// Заменяем export default db на export { db } для удобства импортов