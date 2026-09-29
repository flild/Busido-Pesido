/**
 * Единственное место, откуда берутся публичный адрес сайта и контакты.
 *
 * Домен меняется здесь (SITE_URL) или переменной NEXT_PUBLIC_BASE_URL
 * на проде. Canonical, Open Graph, JSON-LD, sitemap, robots и IndexNow
 * собирают ссылки через absoluteUrl() — по страницам бегать не нужно.
 *
 * Почта и Telegram — отдельные константы: это не адрес сайта.
 */

const DEFAULT_SITE_URL = "https://busidopesido.com";

function normalizeSiteUrl(value: string | undefined): string {
  const raw = (value || DEFAULT_SITE_URL).trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_SITE_URL;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

/** Публичный origin без завершающего слэша. */
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_BASE_URL);

export const SITE_HOST = new URL(SITE_URL).host;

/** Почта в подвале. Меняется только здесь. */
export const SITE_EMAIL = "info@busidopesido.ru";

/** Telegram-канал в шапке и подвале. Меняется только здесь. */
export const TELEGRAM_URL = "https://t.me/busidopesido";

/** Абсолютный URL страницы или файла. path: "/blog", "blog/slug", "/logo.png". */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
