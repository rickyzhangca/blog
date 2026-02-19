import type { Locale } from "@/lib/i18n";

export interface ArticleContent {
  body: React.ReactNode;
  credit?: React.ReactNode;
}

interface ArticleContentMap {
  cn?: ArticleContent;
  en?: ArticleContent;
}

const contentRegistry: Map<string, ArticleContentMap> = new Map();

export function registerArticleContent(
  slug: string,
  locale: Locale,
  content: ArticleContent
): void {
  const existing = contentRegistry.get(slug) || {};
  contentRegistry.set(slug, { ...existing, [locale]: content });
}

export function getArticleContent(
  slug: string,
  locale: Locale
): ArticleContent | null {
  const contentMap = contentRegistry.get(slug);
  if (!contentMap) {
    return null;
  }
  return contentMap[locale] || null;
}
