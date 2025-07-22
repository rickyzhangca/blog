import { BackButton } from './components/back-button';
import { BackToTopButton } from './components/back-to-top-button';
import { Divider } from './divider';

export const ArticleLayout = ({
  children,
  credit,
}: {
  children: React.ReactNode;
  credit?: React.ReactNode;
}) => {
  return (
    <>
      <Divider />
      <div className="flex flex-col gap-4 p-4">
        <BackButton />
        <article className="prose prose-gray max-w-none py-2 prose-a:text-current prose-a:decoration-foreground/20 prose-a:underline-offset-2 sm:px-4 sm:pt-10 sm:pb-4">
          {children}
        </article>
        {credit && (
          <div className="prose prose-gray prose-sm flex max-w-none flex-col items-center justify-center text-balance border px-4 py-8 text-center prose-a:text-current prose-a:decoration-foreground/20 prose-a:underline-offset-2">
            {credit}
          </div>
        )}
        <div className="flex items-center gap-2">
          <BackButton className="flex-1" />
          <BackToTopButton />
        </div>
      </div>
    </>
  );
};
