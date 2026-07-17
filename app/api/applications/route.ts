import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  // Этот GET защищен через middleware.ts
  try {
    const apps = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    return NextResponse.json(apps);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: 'Ошибка при загрузке заявок' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, time, name, email, contact, request_text } = body;

    // Базовая валидация на сервере. Очищаем пробелы.
    if (!name?.trim() || !email?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: 'Обязательные поля (имя, email, контакт) не заполнены' }, 
        { status: 400 }
      );
    }

    const stmt = db.prepare(`
      INSERT INTO applications (service, date, time, name, email, contact, request_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      service?.trim() || 'Не выбран',
      date?.trim() || 'Не выбрана',
      time?.trim() || 'Не выбрано',
      name.trim(),
      email.trim(),
      contact.trim(),
      request_text?.trim() || ''
    );
    
    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: 'Ошибка при создании заявки' }, { status: 500 });
  }
}