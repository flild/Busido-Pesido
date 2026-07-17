import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container narrow" style={{ padding: '120px 0', textAlign: 'center' }}>
      <span className="eyebrow">ОШИБКА 404</span>
      <h1 style={{ marginBottom: '1rem' }}>Страница не найдена</h1>
      <p className="large" style={{ marginBottom: '2rem' }}>
        Возможно, она была удалена, перемещена или вы перешли по устаревшей ссылке.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link href="/" className="button button-primary">
          Вернуться на главную
        </Link>
      </div>
    </main>
  );
}