import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/app/article-layout";
import { ArticleLanguageToggle } from "@/app/components/article-language-toggle";
import { H1 } from "@/app/components/h";
import { getArticleContent } from "@/lib/article-content";
import {
  getArticleBySlug,
  getArticleMetaForLocale,
  getArticlesForLocale,
} from "@/lib/articles";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { generateMetadata as generateOGMetadata } from "@/lib/og-image";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams(): Array<{
  locale: string;
  slug: string;
}> {
  const locales: Locale[] = ["en", "cn"];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const articles = getArticlesForLocale(locale);
    for (const article of articles) {
      params.push({ locale, slug: article.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isValidLocale(localeParam)) {
    return { title: "Not Found" };
  }

  const locale: Locale = localeParam;
  const articleMeta = getArticleBySlug(slug);

  if (!articleMeta) {
    return { title: "Not Found" };
  }

  const articleForLocale = getArticleMetaForLocale(articleMeta, locale);

  return generateOGMetadata({
    title: articleForLocale.title,
    slug: `${locale}/${slug}`,
    article: articleForLocale,
    locale,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const articleMeta = getArticleBySlug(slug);

  if (!articleMeta) {
    notFound();
  }

  const articleForLocale = getArticleMetaForLocale(articleMeta, locale);
  const content = await getArticleContent(slug, locale);

  if (!content) {
    notFound();
  }

  return (
    <ArticleLayout backHref={`/${locale}`} credit={content.credit}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <H1>{articleForLocale.title}</H1>
        <div className="not-prose shrink-0">
          <ArticleLanguageToggle locale={locale} slug={slug} />
        </div>
      </div>
      {content.body}
    </ArticleLayout>
  );
}
