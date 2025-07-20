import { ChevronRightIcon } from 'lucide-react';
import type { ArticleMeta } from '@/lib/articles';
import { Cover } from './cover';

export const ArticleItem = ({ article }: { article: ArticleMeta }) => {
  return (
    <a
      className="flex items-center justify-between gap-2 p-4"
      href={`/${article.slug}`}
    >
      <div className="flex items-center gap-6">
        <Cover id={article.slug} />
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-lg">{article.title}</span>
          <span className="text-foreground/50">{article.description}</span>
        </div>
      </div>
      <ChevronRightIcon className="text-foreground/40" />
    </a>
  );
};
