'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function AdminApplications() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0); // Триггер для обновления данных

  useEffect(() => {
    let isMounted = true;
    
    const loadApps = async () => {
      try {
        const res = await fetch('/api/applications');
        if (!res.ok) throw new Error('Ошибка при загрузке заявок');
        const data = await res.json();
        if (isMounted) setApps(data);
      } catch (error: any) {
        if (isMounted) alert(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApps();
    
    return () => { isMounted = false; };
  }, [refresh]); // Эффект сам перезапустится при изменении refresh

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при обновлении статуса');
      }
      
      setRefresh(prev => prev + 1); // Дергаем триггер, данные обновятся
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deleteApp = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку? Действие необратимо.')) return;
    
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при удалении');
      }
      
      setRefresh(prev => prev + 1);
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div className="p-10 text-forest font-bold animate-pulse">Загрузка заявок...</div>;

  // Оформление бейджей статусов на Tailwind
  const getStatusBadge = (status: string) => {
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
  };

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
                    <td className="p-4 text-coal whitespace-nowrap">{new Date(app.created_at).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4"><strong className="text-coal font-bold">{app.service}</strong></td>
                    <td className="p-4 text-coal font-medium">{app.name}</td>
                    <td className="p-4 text-coal">
                      <span className="block">{app.email}</span>
                      <small className="text-coal/60 font-medium">{app.contact}</small>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <div className="truncate text-coal/80 text-sm" title={app.request_text}>
                        {app.request_text}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end items-center">
                        <select 
                          value={app.status} 
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="px-2 py-1.5 rounded-lg border border-forest/15 bg-white text-coal font-medium text-sm outline-none focus:border-forest/40 cursor-pointer transition-colors"
                        >
                          <option value="new">Новая</option>
                          <option value="contacted">Связались</option>
                          <option value="completed">Завершена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                        <button 
                          onClick={() => deleteApp(app.id)} 
                          className="p-2 rounded-xl text-coal/60 hover:bg-rose/10 hover:text-rose transition-colors cursor-pointer border-none bg-transparent" 
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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