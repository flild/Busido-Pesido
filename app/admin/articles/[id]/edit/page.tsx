// app/admin/articles/[id]/edit/page.tsx
import { db } from '@/lib/db';
import { ArticleForm } from '../../ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  
  if (!article) {
    notFound();
  }

  return <ArticleForm initialData={article} />;
}