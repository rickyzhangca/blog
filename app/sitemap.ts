import type { MetadataRoute } from 'next';

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import fs from 'node:fs/promises';
import path from 'node:path';

async function getStaticPaths(): Promise<string[]> {
  const appDir = path.join(process.cwd(), 'app');
  const pages: string[] = [];

  async function walk(current: string, prefix = ''): Promise<void> {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name.startsWith('_') ||
        entry.name.startsWith('(') ||
        entry.name === 'api'
      ) {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      const routePath = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, routePath);
      } else if (/^page\.(jsx?|tsx?|mdx?)$/.test(entry.name)) {
        const url = routePath.replace(/page\.(jsx?|tsx?|mdx?)$/, '');
        pages.push('/' + url.replace(/index\/$/, '').replace(/\\/g, '/'));
      }
    }
  }

  await walk(appDir);
  return Array.from(new Set(pages.map((p) => (p === '' ? '/' : p))));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.rickyzhang.me';
  const paths = await getStaticPaths();

  const lastModified = new Date().toISOString();

  return paths.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified,
    changeFrequency: 'weekly' as const,
  }));
}
