import type { Locale } from "@/lib/i18n";

interface MDXModule {
  credit?: React.ReactNode;
  default: React.ComponentType;
}

type MDXLoader = () => Promise<MDXModule>;

interface ArticleManifest {
  [slug: string]: {
    [locale in Locale]?: MDXLoader;
  };
}

export const mdxManifest: ArticleManifest = {
  "verification-asymmetry": {
    en: () => import("@/content/articles/verification-asymmetry/en.mdx"),
    cn: () => import("@/content/articles/verification-asymmetry/cn.mdx"),
  },
  "ephemeral-design": {
    en: () => import("@/content/articles/ephemeral-design/en.mdx"),
    cn: () => import("@/content/articles/ephemeral-design/cn.mdx"),
  },
};
