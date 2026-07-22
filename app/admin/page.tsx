import { db } from '@/lib/db';
import Link from 'next/link';
import { Users, FileText, TrendingUp, Activity, Eye, Calendar, ArrowRight, Star } from 'lucide-react';
import DashboardCharts from './DashboardCharts';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // ============================================================================
  // 1. БАЗОВЫЕ МЕТРИКИ (KPI)
  // ============================================================================
  const totalApps = (db.prepare("SELECT COUNT(*) as c FROM applications").get() as any).c;
  const newApps = (db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'new'").get() as any).c;
  
  const completedApps = (db.prepare("SELECT COUNT(*) as c FROM applications WHERE status = 'completed'").get() as any).c;
  const conversionRate = totalApps > 0 ? Math.round((completedApps / totalApps) * 100) : 0;
  
  const totalViews = (db.prepare("SELECT SUM(views) as c FROM articles").get() as any).c || 0;

  // Считаем оставшиеся бесплатные слоты (парсим JSON "на лету")
  const freeSchedules = db.prepare("SELECT slots FROM free_schedule WHERE is_available = 1").all() as any[];
  const remainingSlots = freeSchedules.reduce((acc, row) => acc + JSON.parse(row.slots).length, 0);

  // ============================================================================
  // 2. ДАННЫЕ ДЛЯ ГРАФИКОВ
  // ============================================================================
  const appsDynamicsRaw = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as count
    FROM applications
    WHERE created_at >= date('now', '-30 days')
    GROUP BY date(created_at)
    ORDER BY date(created_at) ASC
  `).all() as any[];

  const appsDynamics = appsDynamicsRaw.map(row => ({
    date: new Date(row.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
    Заявки: row.count
  }));

  const viewsDynamicsRaw = db.prepare(`
    SELECT date(viewed_at) as date, COUNT(*) as count
    FROM article_views_log
    WHERE viewed_at >= date('now', '-30 days')
    GROUP BY date(viewed_at)
    ORDER BY date(viewed_at) ASC
  `).all() as any[];

  const viewsDynamics = viewsDynamicsRaw.map(row => ({
    date: new Date(row.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
    Просмотры: row.count
  }));

  const appsByService = db.prepare(`
    SELECT service as name, COUNT(*) as value
    FROM applications
    GROUP BY service
    ORDER BY value DESC
  `).all() as any[];

  // ============================================================================
  // 3. ТАБЛИЦЫ ДЛЯ ДАШБОРДА
  // ============================================================================
  // Последние 5 необработанных заявок
  const recentLeads = db.prepare(`
    SELECT id, name, service, date, created_at 
    FROM applications 
    WHERE status = 'new' 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all() as any[];

  // Топ 5 самых читаемых статей
  const topArticles = db.prepare(`
    SELECT id, title, views, is_premium, category 
    FROM articles 
    ORDER BY views DESC 
    LIMIT 5
  `).all() as any[];


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[32px] font-bold text-coal m-0 mb-2">Дашборд</h1>
        <p className="text-coal/60">Сводка по заявкам, трафику контента и нагрузке.</p>
      </div>

      {/* ----------------------------------------------------------------------
          СЕКЦИЯ 1: KPI КАРТОЧКИ
      ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-5 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-white border border-forest/15 rounded-[20px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-rose/10 flex items-center justify-center text-rose">
            <Activity size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-coal leading-none mb-1">{newApps}</div>
            <div className="text-[11px] font-bold text-coal/50 uppercase tracking-wider">Новых заявок</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[20px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-snow flex items-center justify-center text-forest">
            <Users size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-coal leading-none mb-1">{totalApps}</div>
            <div className="text-[11px] font-bold text-coal/50 uppercase tracking-wider">Всего заявок</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[20px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-matcha/10 flex items-center justify-center text-matcha">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-coal leading-none mb-1">{conversionRate}%</div>
            <div className="text-[11px] font-bold text-coal/50 uppercase tracking-wider">Конверсия</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[20px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-ice/10 flex items-center justify-center text-ice">
            <Eye size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-coal leading-none mb-1">{totalViews}</div>
            <div className="text-[11px] font-bold text-coal/50 uppercase tracking-wider">Просмотров</div>
          </div>
        </div>

        <div className="bg-white border border-forest/15 rounded-[20px] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-caramel/10 flex items-center justify-center text-caramel">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-coal leading-none mb-1">{remainingSlots}</div>
            <div className="text-[11px] font-bold text-coal/50 uppercase tracking-wider">Слотов (Беспл.)</div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          СЕКЦИЯ 2: ГРАФИКИ (Клиентский компонент)
      ---------------------------------------------------------------------- */}
      {/* Прокидываем в твой компонент данные о просмотрах, чтобы ты мог отрендерить второй график */}
      <DashboardCharts dynamics={appsDynamics} viewsDynamics={viewsDynamics} services={appsByService} />

      {/* ----------------------------------------------------------------------
          СЕКЦИЯ 3: ТАБЛИЦЫ (Горящие задачи и Контент)
      ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-6">
        
        {/* ЛЕВЫЙ БЛОК: Последние заявки */}
        <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-forest/15 flex justify-between items-center bg-snow/30">
            <h2 className="text-lg font-bold text-coal m-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose animate-pulse"></span>
              Требуют ответа
            </h2>
            <Link href="/admin/applications" className="text-sm font-bold text-forest hover:text-matcha flex items-center gap-1 transition-colors">
              Все заявки <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-grow">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-coal/50 text-sm">Нет новых заявок. Можно выдохнуть.</div>
            ) : (
              <div className="flex flex-col">
                {recentLeads.map((lead, i) => (
                  <div key={lead.id} className={`p-4 flex items-center justify-between gap-4 hover:bg-snow transition-colors ${i !== recentLeads.length -1 ? 'border-b border-forest/5' : ''}`}>
                    <div className="overflow-hidden">
                      <div className="font-bold text-coal truncate">{lead.name}</div>
                      <div className="text-xs text-coal/60 truncate mt-0.5">{lead.service}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-coal/40 mb-1">
                        {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                      </div>
                      <Link href={`/admin/applications`} className="text-[11px] font-bold px-3 py-1.5 bg-rose/10 text-rose rounded-full hover:bg-rose hover:text-white transition-colors">
                        Обработать
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ПРАВЫЙ БЛОК: Популярные статьи */}
        <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-forest/15 flex justify-between items-center bg-snow/30">
            <h2 className="text-lg font-bold text-coal m-0 flex items-center gap-2">
              <Star size={18} className="text-caramel" />
              Топ контента
            </h2>
            <Link href="/admin/articles" className="text-sm font-bold text-forest hover:text-matcha flex items-center gap-1 transition-colors">
              База знаний <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-0 flex-grow">
            {topArticles.length === 0 ? (
              <div className="p-8 text-center text-coal/50 text-sm">Никто ничего не читал.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <tbody>
                  {topArticles.map((art, i) => (
                    <tr key={art.id} className={`hover:bg-snow transition-colors ${i !== topArticles.length -1 ? 'border-b border-forest/5' : ''}`}>
                      <td className="p-4 w-8 text-coal/30 font-bold">{i + 1}</td>
                      <td className="p-4 max-w-[200px]">
                        <div className="font-bold text-coal truncate mb-1" title={art.title}>{art.title}</div>
                        <div className="flex gap-2">
                          {art.is_premium === 1 && (
                            <span className="text-[9px] font-black tracking-widest text-white bg-forest px-1.5 py-0.5 rounded uppercase">Premium</span>
                          )}
                          <span className="text-[11px] text-coal/50 truncate">{art.category}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-snow border border-forest/10 rounded-lg text-sm font-bold text-coal">
                          <Eye size={14} className="text-coal/40" />
                          {art.views}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}