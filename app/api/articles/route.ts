import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const articles = db.prepare('SELECT * FROM articles ORDER BY created_at DESC').all();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: 'Не удалось загрузить статьи' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, summary, content, category, tag, status } = body;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Заголовок, URL (slug) и контент обязательны' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO articles (title, slug, summary, content, category, tag, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      title.trim(), 
      slug.trim(), 
      summary?.trim() || '', 
      content.trim(), 
      category?.trim() || 'uncategorized', 
      tag?.trim() || '',
      status || 'published'
    );
    
    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error: any) {
    console.error("POST /api/articles error:", error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Статья с таким URL (slug) уже существует' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Ошибка при создании статьи' }, { status: 500 });
  }
}