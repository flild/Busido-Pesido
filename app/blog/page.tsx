import { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Блог — Busido-Pesido",
  description: "Статьи о собаках и кошках, поведении, здоровье, обучении и благополучии животных.",
  alternates: {
    canonical: "https://busidopesido.ru/blog",
  },
};

export default function BlogPage() {
  // Вытаскиваем views и is_premium
  const articles = db
    .prepare(
      "SELECT id, title, slug, summary, category, tag, views, is_premium, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC"
    )
    .all() as any[];

  return (
    <main>
      <section className="pt-[108px] pb-[74px] bg-[linear-gradient(135deg,rgba(111,143,191,0.24),theme(colors.snow)_52%,rgba(198,142,107,0.26))] relative overflow-hidden">
        <div className="container relative z-10">
          <span className="eyebrow mb-4">БЛОГ</span>
          <h1 className="relative after:block after:w-[min(270px,48%)] after:h-[9px] after:mt-5 after:rounded-full after:bg-gradient-dopamine after:opacity-90 max-w-[820px] text-coal">
            Поведение без ярлыков, клинические связи без упрощений
          </h1>
          <p className="text-xl text-matcha max-w-[800px] mt-6 leading-relaxed">
            Статьи о собаках и кошках, нервной системе, боли, обучении, среде,
            отношениях с человеком и профессиональной практике.
          </p>
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