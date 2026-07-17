'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0); // Триггер для обновления

  useEffect(() => {
    let isMounted = true;
    
    const loadArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) throw new Error('Ошибка загрузки статей');
        const data = await res.json();
        if (isMounted) setArticles(data);
      } catch (error: any) {
        if (isMounted) alert(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadArticles();
    
    return () => { isMounted = false; };
  }, [refresh]); // Эффект перезапускается при изменении refresh

  const deleteArticle = async (id: number) => {
    if (!confirm('Удалить статью? Действие необратимо.')) return;
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ошибка при удалении');
      }
      setRefresh(prev => prev + 1); // Дергаем триггер, таблица сама обновится
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Загрузка статей...</p>;

  return (
    <>
      <div className="admin-header">
        <h1>Статьи</h1>
        <Link href="/admin/articles/new" className="button button-primary button-small">
          <Plus size={16} /> Написать статью
        </Link>
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Заголовок</th>
              <th>Категория / Тег</th>
              <th>Статус</th>
              <th style={{ width: '80px' }}></th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Статей пока нет</td>
              </tr>
            ) : (
              articles.map(art => (
                <tr key={art.id}>
                  <td>{art.id}</td>
                  <td>{new Date(art.created_at).toLocaleDateString('ru-RU')}</td>
                  <td><strong>{art.title}</strong></td>
                  <td>{art.category} <br/><small>{art.tag}</small></td>
                  <td><span className="admin-badge completed">{art.status || 'published'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/admin/articles/${art.id}/edit`} className="action-btn" title="Редактировать">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => deleteArticle(art.id)} className="action-btn danger" title="Удалить">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}