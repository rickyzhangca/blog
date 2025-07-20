import { articles } from '@/lib/articles';
import { ArticleItem } from './components/article-item';
import Scene from './components/scene-r3f';
import { Divider } from './divider';

export default function Home() {
  return (
    <div className="">
      <Scene />
      <Divider />
      <div className="flex flex-col">
        {articles.map((article, idx) => (
          <div key={article.slug}>
            {idx > 0 && <Divider className="h-4" />}
            <ArticleItem article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
