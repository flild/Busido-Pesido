import { db } from '@/lib/db';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import DashboardCharts from './DashboardCharts';

export const dynamic = 'force-dynamic'; // Отключаем статику, дашборд должен быть свежим

export default async function AdminDashboard() {
  // 1. Быстрые метрики (KPI)
  const totalApps = (db.prepare("SELECT COUNT(*) as c FROM applications").get() as any).c;
  const newApps = (db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'new'").get() as any).c;
  
  // Конверсия (Завершенные заявки к общему числу)
  const completedApps = (db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'completed'").get() as any).c;
  const conversionRate = totalApps > 0 ? Math.round((completedApps / totalApps) * 100) : 0;
  
  const totalArticles = (db.prepare("SELECT COUNT(*) as c FROM articles").get() as any).c;

  // 2. Данные для графиков (Группировка средствами SQLite)
  // Динамика заявок за последние 30 дней
  const appsDynamicsRaw = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as count
    FROM applications
    WHERE created_at >= date('now', '-30 days')
    GROUP BY date(created_at)
    ORDER BY date(created_at) ASC
  `).all() as any[];

  // Форматируем даты для фронта и заполняем пустые дни (базовая логика)
  const appsDynamics = appsDynamicsRaw.map(row => ({
    date: new Date(row.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
    Заявки: row.count
  }));

  // Популярность услуг
  const appsByService = db.prepare(`
    SELECT service as name, COUNT(*) as value
    FROM applications
    GROUP BY service
    ORDER BY value DESC
  `).all() as any[];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[32px] font-bold text-coal m-0 mb-2">Дашборд</h1>
        <p className="text-coal/60">Сводка по заявкам и активности за последние 30 дней.</p>
      </div>

      {/* KPI Карточки */}
      <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-white border border-forest/15 rounded-[24px] p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-snow flex items-center justify-center text-forest">
            <Users size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-coal leading-none mb-1">{totalApps}</div>
            <div className="text-xs font-bold text-coal/50 uppercase tracking-wider">Всего заявок</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[24px] p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-coal leading-none mb-1">{newApps}</div>
            <div className="text-xs font-bold text-coal/50 uppercase tracking-wider">Новых (Необработанных)</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[24px] p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-matcha/10 flex items-center justify-center text-matcha">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-coal leading-none mb-1">{conversionRate}%</div>
            <div className="text-xs font-bold text-coal/50 uppercase tracking-wider">Конверсия в работу</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[24px] p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-ice/10 flex items-center justify-center text-ice">
            <FileText size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-coal leading-none mb-1">{totalArticles}</div>
            <div className="text-xs font-bold text-coal/50 uppercase tracking-wider">Статей в базе</div>
          </div>
        </div>
      </div>

      {/* Передаем данные в клиентский компонент с графиками */}
      <DashboardCharts dynamics={appsDynamics} services={appsByService} />
    </div>
  );
}