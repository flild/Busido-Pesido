import { db } from '@/lib/db';
import { updateServiceBase } from './actions';
import { Pencil } from 'lucide-react';

// Это Server Component. Он выполняется на бэкенде.
export default async function AdminServices() {
  // Вытаскиваем данные синхронно, как в C# Dapper (better-sqlite3 синхронный по дизайну)
  const services = db.prepare('SELECT * FROM services ORDER BY sort_order').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Услуги и форматы</h1>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Название</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Цена</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Описание</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
                  <td className="p-4 text-coal font-bold">{service.id}</td>
                  <td className="p-4 text-coal font-medium">{service.title}</td>
                  <td className="p-4 text-matcha font-bold text-lg">{service.price}</td>
                  <td className="p-4 text-coal/70 text-sm max-w-[300px] truncate">{service.description}</td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      {/* Пока сделаем форму прямо в строке через <details> для простоты, потом можно вынести в модалку */}
                      <details className="group relative">
                        <summary className="p-2 rounded-xl text-coal/60 hover:bg-snow hover:text-forest transition-colors cursor-pointer list-none">
                          <Pencil size={18} />
                        </summary>
                        <div className="absolute right-0 top-full mt-2 w-[400px] p-6 bg-white border border-forest/15 rounded-2xl shadow-2xl z-50">
                          <h3 className="font-bold mb-4 text-coal">Редактировать {service.id}</h3>
                          {/* Форма использует Server Action напрямую в action={} */}
                          <form action={updateServiceBase.bind(null, service.id)} className="flex flex-col gap-4">
                            <label className="flex flex-col gap-1 text-sm font-bold text-coal/70">
                              Название
                              <input type="text" name="title" defaultValue={service.title} className="p-2 border border-forest/15 rounded-lg bg-snow text-coal outline-none focus:border-forest/40" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-bold text-coal/70">
                              Цена (с валютой)
                              <input type="text" name="price" defaultValue={service.price} className="p-2 border border-forest/15 rounded-lg bg-snow text-coal outline-none focus:border-forest/40" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-bold text-coal/70">
                              Текст кнопки
                              <input type="text" name="linkText" defaultValue={service.link_text} className="p-2 border border-forest/15 rounded-lg bg-snow text-coal outline-none focus:border-forest/40" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-bold text-coal/70">
                              Краткое описание
                              <textarea name="description" rows={3} defaultValue={service.description} className="p-2 border border-forest/15 rounded-lg bg-snow text-coal outline-none focus:border-forest/40 resize-none" />
                            </label>
                            <button type="submit" className="mt-2 py-2.5 rounded-xl bg-forest text-white font-bold hover:bg-coal transition-colors">Сохранить</button>
                          </form>
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}