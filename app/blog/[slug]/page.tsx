import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from '@/lib/db';
import Markdown from "react-markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = db
    .prepare("SELECT title, summary, created_at, category FROM articles WHERE slug = ?")
    .get(slug) as any;

  if (!article) return { title: "Статья не найдена" };

  const url = `https://busidopesido.ru/blog/${slug}`;

  return {
    title: `${article.title} — Busido-Pesido`,
    description: article.summary,
    alternates: {
      canonical: url,
    },
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = db
    .prepare("SELECT * FROM articles WHERE slug = ?")
    .get(slug) as any;

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    author: [
      {
        "@type": "Person",
        name: "Ярослава Ковалевская",
        url: "https://busido-pesido.ru",
      },
    ],
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
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-coal/60 hover:text-forest transition-colors mb-6"
          >
            ← В блог
          </Link>
          <div className="mb-4">
            <span className="eyebrow">{article.tag}</span>
          </div>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[900px] text-coal">
            {article.title}
          </h1>
        </div>
      </section>
      
      <section className="py-[92px] max-md:py-[64px]">
        <div className="w-[min(820px,100%)] mx-auto px-5 mobile:px-3">
          <div className="text-[18px] leading-[1.8] text-coal/90 [&>p]:mb-6 [&>h2]:text-[34px] [&>h2]:font-bold [&>h2]:text-coal [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-[26px] [&>h3]:font-bold [&>h3]:text-coal [&>h3]:mt-10 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>li]:mb-2 [&_a]:text-forest [&_a]:font-bold hover:[&_a]:text-espresso [&_a]:transition-colors [&_blockquote]:border-l-4 [&_blockquote]:border-rose/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-8 [&_img]:rounded-2xl [&_img]:my-8">
            <Markdown>{article.content}</Markdown>
          </div>
        </div>
      </section>
    </main>
  );
}