import { BackButton } from './components/back-button';
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
        <BackButton />
      </div>
    </>
  );
};
