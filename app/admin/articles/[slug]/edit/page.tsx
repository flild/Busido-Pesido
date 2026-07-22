// app/admin/articles/[slug]/edit/page.tsx
import { db } from '@/lib/db';
import { ArticleForm } from '../../ArticleForm';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
  
  if (!article) {
    notFound();
  }

  return <ArticleForm initialData={article} />;
}