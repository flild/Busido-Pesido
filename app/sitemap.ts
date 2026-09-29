import { MetadataRoute } from "next";
import { db } from '@/lib/db';
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

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
    "/services",
    "/support",
    "/dogs",
    "/cats",
    "/complex-cases",
    "/professionals",
    "/specialists",
    "/booking",
    "/free-consultations",
    "/blog",
    "/faq",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency:
      route === "" || route === "/blog"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes, ...blogUrls];
}