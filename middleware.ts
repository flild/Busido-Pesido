import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Разрешаем всем POST-запросы к публичным API-формам записи
  const isPublicApi = 
    (pathname === '/api/applications' || pathname === '/api/free-booking') 
    && req.method === 'POST';

  // Если это админка ИЛИ это API (и при этом НЕ публичное API) -> просим пароль
  if (pathname.startsWith('/admin') || (pathname.startsWith('/api/') && !isPublicApi)) {
    const basicAuth = req.headers.get('authorization');
    
    const user = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;

    if (!user || !password) {
      console.error("CRITICAL: Missing ADMIN_USER or ADMIN_PASSWORD in .env");
      return new NextResponse('Internal Server Error: Missing Auth Configuration', { status: 500 });
    }

    const expectedAuth = `Basic ${btoa(`${user}:${password}`)}`;

    if (!basicAuth || basicAuth !== expectedAuth) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};