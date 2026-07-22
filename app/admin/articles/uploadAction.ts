'use server';

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'Файл не найден' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем безопасное имя файла
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    
    // Путь к папке
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Создаем папку, если её нет (recursive: true не бросит ошибку, если папка уже есть)
    await mkdir(uploadDir, { recursive: true });
    
    // Путь сохранения файла
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    
    // Возвращаем URL
    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return { error: 'Не удалось сохранить файл на сервере' };
  }
}