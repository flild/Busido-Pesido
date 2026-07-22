import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from '@/lib/db';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Eye, Clock, Star } from 'lucide-react';
import { ViewTracker } from "./ViewTracker";

// Функция расчета времени чтения (примерно 1500 символов в минуту)
const getReadTime = (text: string) => Math.max(1, Math.ceil(text.length / 1500));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = db.prepare("SELECT title, summary, created_at, category FROM articles WHERE slug = ?").get(slug) as any;

  if (!article) return { title: "Статья не найдена" };
  const url = `https://busidopesido.ru/blog/${slug}`;

  return {
    title: `${article.title} — Busido-Pesido`,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: url,
      type: "article",
      publishedTime: article.created_at,
      section: article.category,
      authors: ["Ярослава Ковалевская"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Достаем все нужные поля, включая is_premium и views
  const article = db.prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'").get(slug) as any;

  if (!article) {
    notFound();
  }

  const readTime = getReadTime(article.content);
  const publishDate = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Прокачанный JSON-LD для SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    author: [{
      "@type": "Person",
      name: "Ярослава Ковалевская",
      url: "https://busidopesido.ru",
    }],
    datePublished: article.created_at,
    dateModified: article.created_at, 
    publisher: {
      "@type": "Organization",
      name: "Busido-Pesido",
      logo: {
        "@type": "ImageObject",
        url: "https://busidopesido.ru/logo.png", 
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://busidopesido.ru/blog/${slug}`,
    },
    // Передаем счетчик просмотров поисковикам
    interactionStatistic: {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ViewAction",
      "userInteractionCount": article.views
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Невидимый трекер просмотров */}
      <ViewTracker slug={slug} />
      
      {/* ШАПКА СТАТЬИ */}
      <section className="pt-[140px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10 max-w-[900px]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[13px] font-bold text-coal/60 hover:text-forest transition-colors mb-8">
            ← Вернуться в блог
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {article.is_premium === 1 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm">
                <Star size={12} /> Premium
              </span>
            )}
            <span className="eyebrow m-0">{article.tag}</span>
          </div>
          
          <h1 className="text-[48px] max-md:text-[36px] font-bold leading-[1.1] text-coal mb-8 relative after:block after:w-[120px] after:h-[6px] after:mt-8 after:rounded-full after:bg-gradient-dopamine after:opacity-90">
            {article.title}
          </h1>

          {/* ИНФО-ПАНЕЛЬ: Дата, Время чтения, Просмотры */}
          <div className="flex flex-wrap items-center gap-6 text-[14px] font-bold text-coal/60">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-coal/40" />
              {publishDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-coal/40" />
              {readTime} мин. чтения
            </div>
            <div className="flex items-center gap-2" title="Количество прочтений">
              <Eye size={18} className="text-coal/40" />
              {article.views}
            </div>
          </div>
        </div>
      </section>
      
      {/* ТЕЛО СТАТЬИ */}
      <section className="py-[92px] max-md:py-[64px] bg-white">
        <div className="w-[min(820px,100%)] mx-auto px-5 mobile:px-3">
          {/* Лид-абзац (summary) */}
          <p className="text-[22px] max-md:text-[20px] font-medium leading-[1.6] text-coal/80 mb-12 pb-12 border-b border-forest/15">
            {article.summary}
          </p>

          <div className="text-[18px] max-md:text-[17px] leading-[1.8] text-coal/90 
            [&>p]:mb-6 
            [&>h2]:text-[32px] [&>h2]:font-bold [&>h2]:text-coal [&>h2]:mt-14 [&>h2]:mb-6 [&>h2]:leading-tight
            [&>h3]:text-[24px] [&>h3]:font-bold [&>h3]:text-coal [&>h3]:mt-10 [&>h3]:mb-4 
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-2 
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-2 
            [&_a]:text-forest [&_a]:font-bold hover:[&_a]:text-espresso [&_a]:transition-colors [&_a]:underline [&_a]:underline-offset-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-matcha [&_blockquote]:bg-matcha/5 [&_blockquote]:p-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-coal/80
            [&_img]:rounded-2xl [&_img]:my-10 [&_img]:shadow-md [&_img]:w-full [&_img]:object-cover
            [&_strong]:font-bold [&_strong]:text-coal"
          >
            <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
          </div>
        </div>
      </section>
    </main>
  );
}