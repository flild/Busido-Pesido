import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!article) return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    console.error(`GET /api/articles/${id} error:`, error);
    return NextResponse.json({ error: 'Ошибка загрузки статьи' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { title, slug, summary, content, category, tag, status } = body;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Заголовок, URL (slug) и контент обязательны' }, { status: 400 });
    }

    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, summary = ?, content = ?, category = ?, tag = ?, status = ?
      WHERE id = ?
    `);
    
    const info = stmt.run(
      title.trim(), 
      slug.trim(), 
      summary?.trim() || '', 
      content.trim(), 
      category?.trim() || 'uncategorized', 
      tag?.trim() || '', 
      status || 'published',
      id
    );

    if (info.changes === 0) {
      return NextResponse.json({ error: 'Статья не найдена или данные не изменились' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`PUT /api/articles/${id} error:`, error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Статья с таким URL (slug) уже существует' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Ошибка обновления статьи' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const info = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    
    if (info.changes === 0) {
      return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/articles/${id} error:`, error);
    return NextResponse.json({ error: 'Ошибка удаления статьи' }, { status: 500 });
  }
}