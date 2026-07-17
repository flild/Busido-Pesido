import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `).all();

    const serviceCounts = db.prepare(`
      SELECT service as name, COUNT(*) as value 
      FROM applications 
      GROUP BY service
    `).all();

    const trend = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count
      FROM applications
      GROUP BY date(created_at)
      ORDER BY date(created_at) DESC
      LIMIT 14
    `).all().reverse();

    const totalApps = db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number } | undefined;
    const totalArticles = db.prepare('SELECT COUNT(*) as c FROM articles').get() as { c: number } | undefined;

    return NextResponse.json({
      statusCounts,
      serviceCounts,
      trend,
      totalApps: totalApps?.c || 0,
      totalArticles: totalArticles?.c || 0
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: 'Не удалось получить статистику' }, { status: 500 });
  }
}