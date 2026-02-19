import type { Metadata } from "next";
import type { ArticleMetaForLocale } from "./articles";
import type { Locale } from "./i18n";
import { getLocaleHrefLang } from "./i18n";

export interface OGImageParams {
  author?: string;
  title?: string;
  type?: "article" | "default";
}

export function generateOGImageUrl(params: OGImageParams): string {
  const baseUrl = new URL(
    "/api/og",
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  );

  if (params.title) {
    baseUrl.searchParams.append("title", params.title);
  }

  if (params.type && ["article", "default"].includes(params.type)) {
    baseUrl.searchParams.append("type", params.type);
  }

  if (params.author) {
    baseUrl.searchParams.append("author", params.author);
  }

  return baseUrl.toString();
}

export function generateArticleOGImageUrl(
  article: ArticleMetaForLocale
): string {
  return generateOGImageUrl({
    title: article.title,
    type: "article",
  });
}

export function generateDefaultOGImageUrl(
  title = "Design Engineer Blog"
): string {
  return generateOGImageUrl({
    title,
    type: "default",
  });
}

export interface GenerateMetadataParams {
  article?: ArticleMetaForLocale;
  description?: string;
  locale?: Locale;
  slug?: string;
  title: string;
}

export function generateMetadata(params: GenerateMetadataParams): Metadata {
  const {
    title,
    article,
    description: customDescription,
    locale = "en",
  } = params;

  const isArticle = !!article;

  const description =
    customDescription ??
    (article ? article.description : "Design Engineer Blog");

  const ogImageUrl = isArticle
    ? generateArticleOGImageUrl(article)
    : generateDefaultOGImageUrl(title);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = params.slug ? `${baseUrl}/${params.slug}` : baseUrl;

  const alternateLocales: Locale[] =
    locale === "en" ? ["en", "cn"] : ["cn", "en"];

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      siteName: "Design Engineer Blog",
      type: isArticle ? "article" : "website",
      url,
      locale: getLocaleHrefLang(locale),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(isArticle && {
        publishedTime: article.published,
        authors: ["Ricky Zhang"],
      }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@rickyrickyriri",
    },

    alternates: {
      canonical: url,
      languages: {
        [getLocaleHrefLang(alternateLocales[0])]: params.slug
          ? `${baseUrl}/${alternateLocales[0]}/${params.slug.replace(/^(en|cn)\//, "")}`
          : `${baseUrl}/${alternateLocales[0]}`,
        [getLocaleHrefLang(alternateLocales[1])]: params.slug
          ? `${baseUrl}/${alternateLocales[1]}/${params.slug.replace(/^(en|cn)\//, "")}`
          : `${baseUrl}/${alternateLocales[1]}`,
        "x-default": params.slug
          ? `${baseUrl}/en/${params.slug.replace(/^(en|cn)\//, "")}`
          : `${baseUrl}/en`,
      },
    },
  };
}
