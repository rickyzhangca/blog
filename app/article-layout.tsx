import { BackButton } from './components/back-button';
import { Divider } from './divider';

export const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Divider />
      <div className="flex flex-col gap-4 p-4">
        <BackButton />
        <article className="prose max-w-none px-4 py-8">{children}</article>
        <BackButton />
      </div>
    </>
  );
};
