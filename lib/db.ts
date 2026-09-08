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
    main_image TEXT,                   
    reads_count INTEGER DEFAULT 0,     
    likes INTEGER DEFAULT 0,           
    dislikes INTEGER DEFAULT 0,       
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE IF NOT EXISTS specialists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    city TEXT DEFAULT '', 
    short_bio TEXT NOT NULL,
    full_bio TEXT NOT NULL,
    image_url TEXT,
    is_main INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
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
      specialist_id INTEGER,
      date TEXT,
      time TEXT,
      name TEXT,
      email TEXT,
      contact TEXT,
      request_text TEXT,
      status TEXT DEFAULT 'new',
      pet_type TEXT,
      pet_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    price_int INTEGER NOT NULL DEFAULT 0,
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
    status TEXT NOT NULL DEFAULT 'published',
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    theme TEXT NOT NULL,
    tab_title TEXT NOT NULL,
    main_title TEXT NOT NULL,
    steps TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    image_before TEXT,
    image_after TEXT
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



