'use client';
import { useState } from 'react';
import Link from 'next/link';

export interface ArticleMeta {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tag: string;
  created_at: string;
}

export function BlogList({ initialArticles }: { initialArticles: ArticleMeta[] }) {
  const [filter, setFilter] = useState('all');

  const filteredArticles = initialArticles.filter(
    a => filter === 'all' || (a.category && a.category.includes(filter))
  );

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-7">
        {[
          { id: 'all', label: 'Все' },
          { id: 'dogs', label: 'Собаки' },
          { id: 'cats', label: 'Кошки' },
          { id: 'health', label: 'Здоровье' },
          { id: 'learning', label: 'Обучение' }
        ].map(btn => (
          <button 
            key={btn.id}
            className={`border border-forest/15 rounded-full px-3.5 py-2.5 font-[850] cursor-pointer transition-colors ${filter === btn.id ? 'bg-coal text-white' : 'bg-white hover:bg-snow'}`} 
            onClick={() => setFilter(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((a) => (
            <article key={a.id} className="card flex flex-col min-h-[290px]">
              <span className="tag mb-3 self-start">{a.tag}</span>
              <h3 className="text-[25px] mt-2 mb-3 leading-tight">{a.title}</h3>
              <p className="text-coal/60 mb-6">{a.summary}</p>
              <Link className="mt-auto font-[900] text-forest hover:text-espresso transition-colors" href={`/blog/${a.slug}`}>Читать →</Link>
            </article>
          ))
        ) : (
          <p className="col-span-full text-coal/60">В этой категории пока нет опубликованных статей.</p>
        )}
      </div>
    </>
  );
}