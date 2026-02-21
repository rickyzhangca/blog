import type { Locale } from "@/lib/i18n";
import { mdxManifest } from "./mdx-manifest";

export interface ArticleContent {
  body: React.ReactNode;
  credit?: React.ReactNode;
}

export async function getArticleContent(
  slug: string,
  locale: Locale
): Promise<ArticleContent | null> {
  const loaders = mdxManifest[slug];
  if (!loaders) {
    return null;
  }

  const loader = loaders[locale];
  if (!loader) {
    return null;
  }

  try {
    const module = await loader();
    const Body = module.default;
    return {
      body: <Body />,
      credit: module.credit,
    };
  } catch {
    return null;
  }
}
