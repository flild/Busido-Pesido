// app/api/free-booking/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ДОБАВЛЕНО: petType
    const { dateId, time, name, phone, petName, petType, requestText, confirmed } = body;

    if (!dateId || !time || !name || !phone || !confirmed) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');

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

    // ДОБАВЛЕНО: pet_type и pet_name в запрос
    const insertStmt = db.prepare(`
      INSERT INTO applications (service, date, time, name, contact, request_text, status, pet_type, pet_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      'Бесплатная консультация', 
      dateId, 
      time, 
      name, 
      phone, 
      requestText || 'Не описана', // Теперь request_text чистый, без склейки
      'new',
      petType || 'Не указан', // Пишем вид
      petName || 'Не указано' // Пишем имя
    );

    const scheduleStmt = db.prepare('SELECT slots FROM free_schedule WHERE date_id = ?');
    const scheduleRow = scheduleStmt.get(dateId) as { slots: string };
    
    if (scheduleRow) {
      let slots = JSON.parse(scheduleRow.slots);
      slots = slots.filter((s: string) => s !== time);
      
      const updateScheduleStmt = db.prepare('UPDATE free_schedule SET slots = ? WHERE date_id = ?');
      updateScheduleStmt.run(JSON.stringify(slots), dateId);
      
      if (slots.length === 0) {
        db.prepare("UPDATE free_schedule SET is_available = 0, custom_message = 'Нет мест' WHERE date_id = ?").run(dateId);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка при записи на бесплатную консультацию:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера. Попробуйте позже.' }, { status: 500 });
  }
}