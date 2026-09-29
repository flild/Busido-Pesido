import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Сейчас весь сайт закрыт от индексации (disallow: "/").
// Перед релизом открыть: allow: "/", disallow: ["/admin/", "/api/"].
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}