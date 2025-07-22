import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { ArticleMeta } from '../../lib/articles';
import {
  type GenerateMetadataParams,
  generateArticleOGImageUrl,
  generateDefaultOGImageUrl,
  generateMetadata,
  generateOGImageUrl,
  type OGImageParams,
} from '../../lib/og-image';

beforeAll(() => {
  vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com');
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('OG Image URL Generation', () => {
  describe('generateOGImageUrl', () => {
    it('should generate a basic URL with no parameters', () => {
      const url = generateOGImageUrl({});
      expect(url).toBe('https://example.com/api/og');
    });

    it('should include title parameter when provided', () => {
      const params: OGImageParams = { title: 'Test Title' };
      const url = generateOGImageUrl(params);
      expect(url).toContain('title=');
      expect(url).toContain('Test%2520Title');
    });

    it('should include description parameter when provided', () => {
      const params: OGImageParams = { description: 'Test Description' };
      const url = generateOGImageUrl(params);
      expect(url).toContain('description=');
      expect(url).toContain('Test%2520Description');
    });

    it('should include type parameter when provided with valid value', () => {
      const params: OGImageParams = { type: 'article' };
      const url = generateOGImageUrl(params);
      expect(url).toContain('type=article');
    });

    it('should include author parameter when provided', () => {
      const params: OGImageParams = { author: 'Test Author' };
      const url = generateOGImageUrl(params);
      expect(url).toContain('author=');
      expect(url).toContain('Test%2520Author');
    });

    it('should include all parameters when provided', () => {
      const params: OGImageParams = {
        title: 'Test Title',
        description: 'Test Description',
        type: 'article',
        author: 'Test Author',
      };
      const url = generateOGImageUrl(params);
      expect(url).toContain('title=');
      expect(url).toContain('description=');
      expect(url).toContain('type=article');
      expect(url).toContain('author=');
    });

    it('should properly encode special characters in parameters', () => {
      const params: OGImageParams = {
        title: 'Test & Title: Special "Characters"',
      };
      const url = generateOGImageUrl(params);
      expect(url).toContain('title=');
      expect(url).toContain('%2526'); // Double-encoded &
      expect(url).toContain('%253A'); // Double-encoded :
      expect(url).toContain('%2522'); // Double-encoded "
    });

    it('should use localhost when NEXT_PUBLIC_BASE_URL is not available', () => {
      // Temporarily override the environment variable
      vi.unstubAllEnvs();

      const params: OGImageParams = { title: 'Test Title' };
      const url = generateOGImageUrl(params);
      expect(url).toContain('http://localhost:3000/api/og');

      // Restore the mock for other tests
      vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com');
    });
  });

  describe('generateArticleOGImageUrl', () => {
    it('should generate an article OG image URL with article metadata', () => {
      const article: ArticleMeta = {
        slug: 'test-article',
        title: 'Test Article',
        description: 'This is a test article',
        published: '2025-07-01',
      };

      const url = generateArticleOGImageUrl(article);
      expect(url).toContain('title=');
      expect(url).toContain('Test%2520Article');
      expect(url).toContain('type=article');
      expect(url).not.toContain('description=');
    });
  });

  describe('generateDefaultOGImageUrl', () => {
    it('should generate a default OG image URL with default values', () => {
      const url = generateDefaultOGImageUrl();
      expect(url).toContain('title=');
      expect(url).toContain('Design%2520Engineer%2520Blog');
      expect(url).toContain('description=');
      expect(url).toContain('type=default');
    });

    it('should generate a default OG image URL with custom values', () => {
      const url = generateDefaultOGImageUrl(
        'Custom Title',
        'Custom Description'
      );
      expect(url).toContain('title=');
      expect(url).toContain('Custom%2520Title');
      expect(url).toContain('description=');
      expect(url).toContain('Custom%2520Description');
      expect(url).toContain('type=default');
    });
  });
});

describe('Metadata Generation', () => {
  describe('generateMetadata', () => {
    it('should generate basic metadata for a regular page', () => {
      const params: GenerateMetadataParams = {
        title: 'Test Page',
        description: 'This is a test page',
      };

      const metadata = generateMetadata(params);

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('This is a test page');
      // @ts-expect-error false alarm
      expect(metadata.openGraph?.type).toBe('website');

      // Check image dimensions if available
      const ogImage = metadata.openGraph?.images;
      if (Array.isArray(ogImage) && ogImage.length > 0) {
        // @ts-expect-error false alarm
        expect(ogImage[0].width).toBe(1200);
        // @ts-expect-error false alarm
        expect(ogImage[0].height).toBe(630);
      }

      // @ts-expect-error false alarm
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('should generate metadata for an article page', () => {
      const article: ArticleMeta = {
        slug: 'test-article',
        title: 'Test Article',
        description: 'This is a test article',
        published: '2025-07-01',
      };

      const params: GenerateMetadataParams = {
        title: article.title,
        description: article.description,
        slug: article.slug,
        article,
      };

      const metadata = generateMetadata(params);

      expect(metadata.title).toBe('Test Article');
      expect(metadata.description).toBe('This is a test article');

      // Check article-specific metadata
      const openGraph = metadata.openGraph;
      // @ts-expect-error false alarm
      expect(openGraph?.type).toBe('article');

      // These properties might be type-specific, so we'll check them safely
      const ogArticle = openGraph;
      // @ts-expect-error false alarm
      expect(ogArticle?.publishedTime).toBe('2025-07-01');
      // @ts-expect-error false alarm
      expect(ogArticle?.authors).toContain('Ricky Zhang');
    });

    it('should include canonical URL when slug is provided', () => {
      const params: GenerateMetadataParams = {
        title: 'Test Page',
        description: 'This is a test page',
        slug: 'test-page',
      };

      const metadata = generateMetadata(params);
      expect(metadata.alternates?.canonical).toContain('/test-page');
    });

    it('should use base URL as canonical when no slug is provided', () => {
      const params: GenerateMetadataParams = {
        title: 'Test Page',
        description: 'This is a test page',
      };

      const metadata = generateMetadata(params);
      expect(metadata.alternates?.canonical).toBeTruthy();
    });
  });
});
