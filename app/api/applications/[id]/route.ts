import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const ALLOWED_STATUSES = ['new', 'contacted', 'completed', 'cancelled'];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Вытаскиваем id до блока try, чтобы безопасно использовать в логах ошибок
  const { id } = await params;
  
  try {
    const body = await req.json();
    const { status } = body;

    // Жесткая валидация по белому списку
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Некорректный статус заявки' }, { status: 400 });
    }

    const stmt = db.prepare('UPDATE applications SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PUT /api/applications/${id} error:`, error);
    return NextResponse.json({ error: 'Ошибка обновления заявки' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const result = db.prepare('DELETE FROM applications WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Заявка не найдена' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/applications/${id} error:`, error);
    return NextResponse.json({ error: 'Ошибка удаления заявки' }, { status: 500 });
  }
}