import { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { db } from "@/lib/db";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Блог",
  description: "Статьи о собаках и кошках, поведении, здоровье, обучении и благополучии животных.",
  alternates: {
    canonical: "https://busidopesido.ru/blog",
  },
  openGraph: {
    title: "Блог зоопсихолога",
    description: "Статьи о собаках и кошках, поведении, здоровье, обучении и благополучии животных.",
    url: "https://busidopesido.ru/blog",
    type: "website",
  },
};

// Строгая типизация вместо any
export type ArticleRow = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tag: string;
  views: number;
  is_premium: number;
  created_at: string;
};

export default function BlogPage() {
  const articles = db
    .prepare(
      "SELECT id, title, slug, summary, category, tag, views, is_premium, created_at, main_image, reads_count FROM articles WHERE status = 'published' ORDER BY created_at DESC"
    )
    .all() as ArticleRow[];

    // СХЕМА БЛОГА
  const jsonLdBlog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Блог зоопсихолога",
    "description": "Статьи о собаках и кошках, поведении, здоровье, обучении и благополучии животных.",
    "url": "https://busidopesido.ru/blog",
    "blogPost": articles.slice(0, 5).map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "url": `https://busidopesido.ru/blog/${article.slug}`,
      "datePublished": article.created_at
    }))
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }} />
      <BreadcrumbJsonLd 
        items={[
          { name: "Главная", url: "https://busidopesido.ru" },
          { name: "Блог", url: "https://busidopesido.ru/blog" }
        ]} 
      />
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <ScrollReveal>
            <span className="eyebrow mb-4">БЛОГ</span>
            <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-rose after:opacity-90 max-w-[820px] text-coal font-bold">
              Поведение без ярлыков, клинические связи без упрощений
            </h1>
            <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
              Статьи о собаках и кошках, нервной системе, боли, обучении, среде,
              отношениях с человеком и профессиональной практике.
            </p>
          </ScrollReveal>
        </div>
      </section>
      
      <section className="py-[92px] max-md:py-[64px]">
        <div className="container">
          <BlogList initialArticles={articles} />
        </div>
      </section>
    </main>
  );
}