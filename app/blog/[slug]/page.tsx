import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from '@/lib/db';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Eye, Clock, Star, ArrowLeft } from 'lucide-react';
import { ViewTracker } from "./ViewTracker";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { ArticleFeedback } from "./ArticleFeedback";
import Image from "next/image";

// Функция расчета времени чтения (примерно 1500 символов в минуту)
const getReadTime = (text: string) => Math.max(1, Math.ceil(text.length / 1500));

type ArticleFull = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  main_image: string | null;
  tag: string;
  status: string;
  is_premium: number;
  views: number;
  created_at: string;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = db.prepare("SELECT title, summary, created_at, category FROM articles WHERE slug = ?").get(slug) as Pick<ArticleFull, 'title' | 'summary' | 'created_at' | 'category'> | undefined;

  if (!article) return { title: "Статья не найдена" };
  const url = `https://busidopesido.ru/blog/${slug}`;

  return {
    title: article.title,
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
  
  const article = db.prepare("SELECT * FROM articles WHERE slug = ? AND status = 'published'").get(slug) as ArticleFull | undefined;

  if (!article) {
    notFound();
  }

  const readTime = getReadTime(article.content);
  const publishDate = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
    interactionStatistic: {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/ViewAction",
      "userInteractionCount": article.views
    }
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* ДОБАВЛЯЕМ КРОШКИ С ТРЕМЯ УРОВНЯМИ */}
      <BreadcrumbJsonLd 
        items={[
          { name: "Главная", url: "https://busidopesido.ru" },
          { name: "Блог", url: "https://busidopesido.ru/blog" },
          { name: article.title, url: `https://busidopesido.ru/blog/${slug}` }
        ]} 
      />
      <ViewTracker slug={slug} />
      
      {/* ШАПКА СТАТЬИ */}
      <section className="pt-[140px] max-md:pt-[110px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10 max-w-[900px]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[14px] font-[800] text-coal/60 hover:text-forest transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Вернуться в блог
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {article.is_premium === 1 && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm">
                <Star size={12} className="fill-white" /> Premium
              </span>
            )}
            <span className="eyebrow m-0 border-forest/10">{article.tag}</span>
          </div>
          
          <h1 className="text-[48px] max-md:text-[34px] font-bold leading-[1.1] text-coal mb-8 relative after:block after:w-[120px] after:h-[6px] after:mt-8 after:rounded-full after:bg-rose after:opacity-90">
            {article.title}
          </h1>

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
      

      {/* НОВЫЙ БЛОК: Обложка статьи */}
      {article.main_image && (
        <section className="relative -mt-10 mb-10 z-20">
          <div className="container max-w-[1000px]">
            {/* Важно: добавил класс relative в конец строки */}
            <div className="w-full aspect-[21/9] max-md:aspect-[16/9] rounded-[32px] overflow-hidden shadow-lg border border-white/20 bg-snow relative">
              <Image 
                src={article.main_image} 
                alt={article.title} 
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ТЕЛО СТАТЬИ */}
      <section className="py-[92px] max-md:py-[64px] bg-white">
        <div className="w-[min(820px,100%)] mx-auto px-5 mobile:px-3">
          
          <p className="text-[22px] max-md:text-[19px] font-medium leading-[1.65] text-coal/80 mb-12 pb-12 border-b border-forest/10">
            {article.summary}
          </p>

          <div className="text-[18px] max-md:text-[17px] leading-[1.8] text-coal/90 
            [&>p]:mb-7 
            [&>h2]:text-[32px] [&>h2]:max-md:text-[26px] [&>h2]:font-bold [&>h2]:text-coal [&>h2]:mt-16 [&>h2]:mb-6 [&>h2]:leading-tight
            [&>h3]:text-[24px] [&>h3]:max-md:text-[20px] [&>h3]:font-bold [&>h3]:text-coal [&>h3]:mt-12 [&>h3]:mb-4 
            [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-8 [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:mb-3 [&>ul>li]:before:content-['•'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-forest [&>ul>li]:before:font-black [&>ul>li]:before:text-xl [&>ul>li]:before:leading-[1.4]
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-3 [&>ol>li::marker]:text-forest [&>ol>li::marker]:font-bold
            [&_a]:text-forest [&_a]:font-bold hover:[&_a]:text-espresso [&_a]:transition-colors [&_a]:underline [&_a]:underline-offset-4
            [&_blockquote]:border-l-4 [&_blockquote]:border-matcha [&_blockquote]:bg-matcha/5 [&_blockquote]:p-6 max-md:[&_blockquote]:p-5 [&_blockquote]:rounded-r-2xl [&_blockquote]:italic [&_blockquote]:my-10 [&_blockquote]:text-coal/80 [&_blockquote]:font-medium
            [&_img]:rounded-[24px] [&_img]:my-12 [&_img]:shadow-[0_16px_45px_rgba(20,20,20,0.08)] [&_img]:w-full [&_img]:object-cover
            [&_strong]:font-bold [&_strong]:text-coal"
          >
            <Markdown remarkPlugins={[remarkGfm]}>{article.content}</Markdown>
          </div>
          
          {/* НОВЫЙ БЛОК: Сбор фидбека и трекинг дочитывания */}
          <ArticleFeedback slug={slug} />
          
        </div>
      </section>
    </main>
  );
}