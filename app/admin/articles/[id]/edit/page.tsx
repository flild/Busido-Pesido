import { db } from '@/lib/db';
import { ArticleForm } from '../../ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // В Next 15+ params.id достается через await
  const resolvedParams = await params; 
  
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(resolvedParams.id);
  
  if (!article) return notFound();

  return <ArticleForm initialData={article} />;
}