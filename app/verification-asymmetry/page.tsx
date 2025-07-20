import type { Metadata } from 'next';
import { ArticleLayout } from '../article-layout';

export const metadata: Metadata = {
  title: 'first article',
  description: 'placeholder content for the first blog post',
};

const FirstArticle = () => {
  return (
    <ArticleLayout>
      <h1>first article</h1>
      <p>
        this is a placeholder for the first blog article. more compelling
        content coming soon. stay tuned!
      </p>
    </ArticleLayout>
  );
};

export default FirstArticle;
