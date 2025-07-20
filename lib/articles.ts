import fs from 'node:fs';
import path from 'node:path';

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  published: string;
};

const appDir = path.join(process.cwd(), 'app');

function discoverArticles(): ArticleMeta[] {
  const entries = fs.readdirSync(appDir, { withFileTypes: true });
  const metas: ArticleMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) { continue; }
    const metaPath = path.join(appDir, entry.name, 'meta.json');
    if (!fs.existsSync(metaPath)) { continue; }

    try {
      const raw = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as Omit<
        ArticleMeta,
        'slug'
      >;
      metas.push({ slug: entry.name, ...raw });
    } catch {
      // skip malformed meta
    }
  }

  return metas.sort((a, b) => (a.published < b.published ? 1 : -1));
}

export const articles: ArticleMeta[] = discoverArticles();
