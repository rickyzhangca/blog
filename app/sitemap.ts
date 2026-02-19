import type { MetadataRoute } from "next";

import { articles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://blog.rickyzhang.me";
  const lastModified = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [];

  routes.push({
    url: `${baseUrl}/en`,
    lastModified,
    changeFrequency: "weekly",
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        "zh-CN": `${baseUrl}/cn`,
        "x-default": `${baseUrl}/en`,
      },
    },
  });

  routes.push({
    url: `${baseUrl}/cn`,
    lastModified,
    changeFrequency: "weekly",
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        "zh-CN": `${baseUrl}/cn`,
        "x-default": `${baseUrl}/en`,
      },
    },
  });

  for (const article of articles) {
    routes.push({
      url: `${baseUrl}/en/${article.slug}`,
      lastModified,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          en: `${baseUrl}/en/${article.slug}`,
          "zh-CN": `${baseUrl}/cn/${article.slug}`,
          "x-default": `${baseUrl}/en/${article.slug}`,
        },
      },
    });

    routes.push({
      url: `${baseUrl}/cn/${article.slug}`,
      lastModified,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          en: `${baseUrl}/en/${article.slug}`,
          "zh-CN": `${baseUrl}/cn/${article.slug}`,
          "x-default": `${baseUrl}/en/${article.slug}`,
        },
      },
    });
  }

  return routes;
}
