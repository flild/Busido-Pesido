// app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, time, name, email, contact, petName, petType, request_text } = body;

    // Валидация базовых полей
    if (!service || !name || !contact) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Сохраняем заявку в базу с новыми полями
    const insertStmt = db.prepare(`
      INSERT INTO applications (service, date, time, name, email, contact, pet_type, pet_name, request_text, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      service, 
      date || null, 
      time || null, 
      name, 
      email || null, 
      contact, 
      petType || 'Не указан',
      petName || 'Не указано',
      request_text || null, 
      'new'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера при сохранении заявки.' }, { status: 500 });
  }
}