'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // В будущем сюда можно прикрутить Sentry или другой логгер
    console.error("Unhandled Runtime Exception:", error);
  }, [error]);

  return (
    <main className="container narrow" style={{ padding: '120px 0', textAlign: 'center' }}>
      <span className="eyebrow" style={{ color: 'var(--color-pink)' }}>ОШИБКА 500</span>
      <h1 style={{ marginBottom: '1rem' }}>Что-то пошло не так</h1>
      <p className="large" style={{ marginBottom: '2rem' }}>
        Произошла внутренняя ошибка при обработке запроса. Мы уже зафиксировали проблему.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button className="button button-primary" onClick={() => reset()}>
          Попробовать снова
        </button>
        <Link href="/" className="button button-ghost">
          На главную
        </Link>
      </div>
    </main>
  );
}