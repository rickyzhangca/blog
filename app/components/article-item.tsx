import { ChevronRightIcon } from 'lucide-react';
import type { ArticleMeta } from '@/lib/articles';
import { Cover } from './cover';

export const ArticleItem = ({ article }: { article: ArticleMeta }) => {
  return (
    <a
      className="flex items-center justify-between gap-2 p-2 xs:p-4"
      href={`/${article.slug}`}
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
};
