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
    is_premium INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS article_views_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    tag TEXT,
    theme TEXT NOT NULL,
    is_featured INTEGER DEFAULT 0,
    link TEXT NOT NULL,
    link_text TEXT NOT NULL,
    steps TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    tag TEXT NOT NULL,
    pet_name TEXT NOT NULL,
    breed TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    format TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    theme TEXT NOT NULL,
    tab_title TEXT NOT NULL,
    main_title TEXT NOT NULL,
    steps TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS free_schedule (
    date_id TEXT PRIMARY KEY,
    day_number INTEGER NOT NULL,
    is_available INTEGER DEFAULT 1,
    custom_message TEXT,
    slots TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// --- БЕЗОПАСНАЯ МИГРАЦИЯ (Добавляем колонки для животных в заявки) ---
try {
  db.prepare('ALTER TABLE applications ADD COLUMN pet_type TEXT').run();
  db.prepare('ALTER TABLE applications ADD COLUMN pet_name TEXT').run();
} catch (e: any) {
  // Ошибка "duplicate column name" ожидаема, если миграция уже прошла
  if (!e.message.includes('duplicate column name')) {
    console.error('Ошибка миграции applications:', e);
  }
}

// Сид данных для услуг (выполняется только если таблица пустая)
const servicesCount = db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number };
if (servicesCount.c === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (id, title, price, description, tag, theme, is_featured, link, link_text, steps, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const defaultSteps = JSON.stringify([
    ["Кому подходит", "Владельцам собак и кошек..."], 
    ["Что подготовить", "Анкету, короткие видео..."]
  ]);

  insertService.run('online', 'Онлайн-консультация', '6 000 ₽', 'Полный разбор одного животного...', 'Основной формат', 'matcha', 1, '/booking?service=online', 'Записаться', defaultSteps, 1);
  insertService.run('offline', 'Очная / выездная', '8 000 ₽', 'Наблюдение в реальной среде...', null, 'caramel', 0, '/booking?service=offline', 'Выбрать дату', defaultSteps, 2);
  insertService.run('support', 'Онлайн-сопровождение', '22 000 ₽', 'Регулярная проверка ДЗ...', null, 'rose', 0, '/support', 'Подробнее', defaultSteps, 3);
  insertService.run('second', 'Второе мнение', '2 500 ₽', 'Детальный разбор медицинских документов...', null, 'ice', 0, '/complex-cases', 'Как проходит', defaultSteps, 4);
}

const scheduleCount = db.prepare('SELECT COUNT(*) as c FROM free_schedule').get() as { c: number };
if (scheduleCount.c === 0) {
  const insertSchedule = db.prepare(`
    INSERT INTO free_schedule (date_id, day_number, is_available, custom_message, slots)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  insertSchedule.run('2026-08-01', 1, 1, null, JSON.stringify(["10:00", "12:00", "15:30"]));
  insertSchedule.run('2026-08-02', 2, 1, null, JSON.stringify(["11:00", "16:00"]));
  insertSchedule.run('2026-08-03', 3, 1, null, JSON.stringify(["18:00"]));
  insertSchedule.run('2026-08-04', 4, 0, 'Нет мест', JSON.stringify([]));
  insertSchedule.run('2026-08-05', 5, 1, null, JSON.stringify(["10:00", "12:00", "14:00", "17:00"]));
  insertSchedule.run('2026-08-06', 6, 0, 'Отменено', JSON.stringify([]));
  insertSchedule.run('2026-08-07', 7, 1, null, JSON.stringify(["10:00", "13:00"]));
}

const navCount = db.prepare("SELECT COUNT(*) as c FROM settings WHERE key = 'navigator_steps'").get() as { c: number };
if (navCount.c === 0) {
  const defaultNavSteps = [
    { key: "species", title: "С кем связан запрос?", options: [["dog", "Собака", "Щенок, подросток, взрослая или пожилая собака"], ["cat", "Кошка", "Одна кошка или несколько животных дома"]] },
  ];
  db.prepare("INSERT INTO settings (key, value) VALUES ('navigator_steps', ?)").run(JSON.stringify(defaultNavSteps));
}

// Демо-данные с учетом новых колонок
const count = db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number };
if (count.c === 0) {
  const insertApp = db.prepare(`
    INSERT INTO applications (service, date, time, name, email, contact, request_text, status, pet_type, pet_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);
  
  insertApp.run('Онлайн-консультация', '12.11.2023', '15:30', 'Анна', 'anna@example.com', '@anna_tg', 'Очень длинный текст запроса. Собака тянет поводок так сильно, что я уже не могу с ней гулять. Пробовали разные методы, ничего не помогает. Помогите, пожалуйста, разобраться с этой проблемой!', 'new', 'dog', 'Шарик', '-2 days');
  insertApp.run('Очная / выездная', '15.11.2023', '12:00', 'Михаил', 'mike@example.com', '1234567890', 'Агрессия к собакам', 'contacted', 'dog', 'Рекс', '-5 days');
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