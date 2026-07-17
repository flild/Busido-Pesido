import { MetadataRoute } from "next";
import { db } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://busidopesido.ru";

  // Вытягиваем только опубликованные статьи
  const articles = db
    .prepare("SELECT slug, created_at FROM articles WHERE status = 'published'")
    .all() as { slug: string; created_at: string }[];

  const blogUrls = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/complex-cases",
    "/cats",
    "/professionals",
    "/library",
    "/booking",
    "/free-consultations",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/blog"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...blogUrls];
}