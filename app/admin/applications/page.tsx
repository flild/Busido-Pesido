import { db } from '@/lib/db';
import { ApplicationActions } from './ApplicationActions';

// Функция для серверного рендера бейджей
function StatusBadge({ status }: { status: string }) {
  switch(status) {
    case 'new': 
      return <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-ice text-white shadow-sm">Новая</span>;
    case 'contacted': 
      return <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose/15 text-rose">Связались</span>;
    case 'completed': 
      return <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-matcha/15 text-forest">Завершена</span>;
    default: 
      return <span className="inline-block px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-fog text-coal">Отменена</span>;
  }
}

export default async function AdminApplications() {
  // Вытаскиваем заявки синхронно. Сортируем так, чтобы новые были сверху.
  const apps = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all() as any[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Заявки</h1>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Дата</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Услуга</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Клиент</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Контакты</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Запрос</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Статус</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-10 text-coal/60 font-medium">
                    Нет заявок
                  </td>
                </tr>
              ) : (
                apps.map(app => (
                  <tr key={app.id} className="border-b border-forest/5 hover:bg-snow/50 transition-colors">
                    <td className="p-4 text-coal font-medium">{app.id}</td>
                    <td className="p-4 text-coal whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4"><strong className="text-coal font-bold">{app.service}</strong></td>
                    <td className="p-4 text-coal font-medium">{app.name}</td>
                    <td className="p-4 text-coal">
                      {app.email && <span className="block">{app.email}</span>}
                      <small className="text-coal/60 font-medium">{app.contact}</small>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <div className="truncate text-coal/80 text-sm" title={app.request_text}>
                        {app.request_text}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4">
                      {/* Внедряем клиентский компонент для кнопок */}
                      <ApplicationActions id={app.id} currentStatus={app.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}