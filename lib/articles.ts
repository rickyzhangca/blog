import fs from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";

export type LocalizedString = {
  en: string;
  cn: string;
};

export type ArticleMeta = {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  published: string;
};

export type ArticleMetaForLocale = {
  slug: string;
  title: string;
  description: string;
  published: string;
};

const appDir = path.join(process.cwd(), "app");

function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "cn" in value &&
    typeof (value as LocalizedString).en === "string" &&
    typeof (value as LocalizedString).cn === "string"
  );
}

function parseLocalizedField(
  value: unknown,
  fieldName: string
): LocalizedString {
  if (isLocalizedString(value)) {
    return value;
  }
  if (typeof value === "string") {
    return { en: value, cn: value };
  }
  return { en: fieldName, cn: fieldName };
}

function discoverArticles(): ArticleMeta[] {
  const entries = fs.readdirSync(appDir, { withFileTypes: true });
  const metas: ArticleMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const metaPath = path.join(appDir, entry.name, "meta.json");
    if (!fs.existsSync(metaPath)) {
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(metaPath, "utf8")) as Record<
        string,
        unknown
      >;
      metas.push({
        slug: entry.name,
        title: parseLocalizedField(raw.title, "title"),
        description: parseLocalizedField(raw.description, "description"),
        published: typeof raw.published === "string" ? raw.published : "",
      });
    } catch {
      // skip malformed meta
    }
  }

  return metas.sort((a, b) => (a.published < b.published ? 1 : -1));
}

export const articles: ArticleMeta[] = discoverArticles();

export function getArticleMetaForLocale(
  meta: ArticleMeta,
  locale: Locale
): ArticleMetaForLocale {
  return {
    slug: meta.slug,
    title: meta.title[locale],
    description: meta.description[locale],
    published: meta.published,
  };
}

export function getArticlesForLocale(locale: Locale): ArticleMetaForLocale[] {
  return articles.map((meta) => getArticleMetaForLocale(meta, locale));
}

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return articles.find((article) => article.slug === slug);
}
