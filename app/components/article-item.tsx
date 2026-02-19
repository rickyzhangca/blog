import { ChevronRightIcon } from "lucide-react";
import type { ArticleMetaForLocale } from "@/lib/articles";
import type { Locale } from "@/lib/i18n";
import { getArticlePath } from "@/lib/i18n";
import { Cover } from "./cover";

interface ArticleItemProps {
  article: ArticleMetaForLocale;
  locale: Locale;
}

export function ArticleItem({ article, locale }: ArticleItemProps) {
  const href = getArticlePath(article.slug, locale);

  return (
    <a
      className="flex items-center justify-between gap-2 p-2 xs:p-4"
      href={href}
    >
      <div className="flex flex-1 xs:flex-row flex-col items-center xs:gap-6">
        <Cover id={article.slug} />
        <div className="xs:translate-0 flex w-full translate-y-px flex-col xs:gap-0.5 xs:p-0 px-4 xs:px-0 py-3 xs:outline-none outline outline-border">
          <span className="font-medium text-lg">{article.title}</span>
          <span className="text-foreground/50">{article.description}</span>
        </div>
      </div>
      <ChevronRightIcon className="xs:block hidden text-foreground/40" />
    </a>
  );
}
