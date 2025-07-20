import Link from 'next/link';

export const ArticleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Link
        className="flex items-center justify-center border bg-white px-4 py-3 text-foreground"
        href="/"
      >
        Back
      </Link>
      <article className="prose max-w-none px-4 py-8">{children}</article>
    </div>
  );
};
