import { BackButton } from './components/back-button';
import { BackToTopButton } from './components/back-to-top-button';
import { Divider } from './divider';

export const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Divider />
      <div className="flex flex-col gap-4 p-4">
        <BackButton />
        <article className="prose max-w-none py-2 pt-8 prose-a:text-current prose-a:decoration-foreground/20 prose-a:underline-offset-2 sm:px-4 sm:pb-8">
          {children}
        </article>
        <div className="flex items-center gap-2">
          <BackButton className="flex-1" />
          <BackToTopButton />
        </div>
      </div>
    </>
  );
};
