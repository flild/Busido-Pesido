// app/api/free-booking/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Проверь правильность пути к твоему db.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dateId, time, name, phone, petName, requestText, confirmed } = body;

    // Базовая валидация
    if (!dateId || !time || !name || !phone || !confirmed) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Очищаем телефон от спецсимволов для точной проверки (оставляем только цифры)
    const cleanPhone = phone.replace(/\D/g, '');

    // Проверяем, есть ли уже запись с таким телефоном на бесплатную консультацию
    // В SQLite нет встроенной функции RegEx, поэтому ищем совпадение по очищенному номеру через LIKE
    const existingApp = db.prepare(`
      SELECT id FROM applications 
      WHERE service = 'Бесплатная консультация' 
      AND REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(contact, '+', ''), '-', ''), ' ', ''), '(', ''), ')', '') LIKE ?
    `).get(`%${cleanPhone}%`);

    if (existingApp) {
      return NextResponse.json({ 
        error: 'На этот номер телефона уже была оформлена бесплатная запись. Правила допускают только одно участие.' 
      }, { status: 400 });
    }

    // Сохраняем заявку в базу
    const insertStmt = db.prepare(`
      INSERT INTO applications (service, date, time, name, contact, request_text, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Формируем текст запроса
    const fullRequestText = `Питомец: ${petName || 'Не указано'}. Проблема: ${requestText || 'Не описана'}`;

    insertStmt.run(
      'Бесплатная консультация', 
      dateId, 
      time, 
      name, 
      phone, 
      fullRequestText, 
      'new'
    );

    // TODO для админки: здесь в будущем можно добавить логику уменьшения количества свободных мест (slots) в таблице расписания

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при записи на бесплатную консультацию:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера. Попробуйте позже.' }, { status: 500 });
  }
}