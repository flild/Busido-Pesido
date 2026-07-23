import { db } from '@/lib/db';
import Link from 'next/link';
import { ApplicationRow } from './ApplicationRow';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 15;

export default async function AdminApplications({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // В Next.js 15 searchParams — это промис, его нужно дождаться
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;
  const currentStatus = typeof resolvedParams.status === 'string' ? resolvedParams.status : 'all';

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Формируем динамический SQL-запрос
  let whereClause = '';
  let queryParams: any[] = [];

  if (currentStatus !== 'all') {
    whereClause = 'WHERE status = ?';
    queryParams.push(currentStatus);
  }

  // Считаем общее количество для пагинации
  const countStmt = db.prepare(`SELECT COUNT(*) as total FROM applications ${whereClause}`);
  const { total } = countStmt.get(...queryParams) as { total: number };
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Достаем сами данные
  const appsStmt = db.prepare(`
    SELECT * FROM applications
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  const apps = appsStmt.all(...queryParams, ITEMS_PER_PAGE, offset) as any[];

  // Массив для табов фильтрации
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'new', label: 'Новые' },
    { id: 'contacted', label: 'В работе' },
    { id: 'completed', label: 'Завершены' },
    { id: 'cancelled', label: 'Отменены' },
  ];

  return (
    <>
      <div className="flex max-md:flex-col justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-[32px] font-bold text-coal m-0">Заявки</h1>
        
        {/* Табы фильтрации */}
        <div className="flex bg-white rounded-xl p-1 border border-forest/15 shadow-sm overflow-x-auto max-w-full">
          {filters.map(f => (
            <Link
              key={f.id}
              href={`/admin/applications?status=${f.id}&page=1`}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
                currentStatus === f.id 
                  ? 'bg-forest/10 text-forest' 
                  : 'text-coal/60 hover:text-coal hover:bg-snow'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-forest/15 rounded-[24px] shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-snow border-b border-forest/15">
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[60px]">ID</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">Дата</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[160px]">Клиент</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[160px]">Питомец</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider">Запрос</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px]">Статус</th>
                <th className="p-4 text-[13px] font-bold text-coal/60 uppercase tracking-wider w-[120px] text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-10 text-coal/60 font-medium">
                    {currentStatus === 'all' ? 'Пока нет ни одной заявки' : 'В этой категории нет заявок'}
                  </td>
                </tr>
              ) : (
                apps.map(app => (
                  <ApplicationRow key={app.id} app={app} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <Link
              key={pageNum}
              href={`/admin/applications?status=${currentStatus}&page=${pageNum}`}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                currentPage === pageNum
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white border border-forest/15 text-coal hover:border-forest/40'
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}