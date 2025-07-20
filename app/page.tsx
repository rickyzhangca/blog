import { articles } from '@/lib/articles';
import { ArticleItem } from './components/article-item';
import Scene from './components/scene-r3f';
import { Divider } from './divider';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Divider />
      <Scene />
      <Divider />
      <div className="flex">
        {articles.map((article, idx) => (
          <div className="flex-1" key={article.slug}>
            {idx > 0 && <Divider className="h-4" />}
            <ArticleItem article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
