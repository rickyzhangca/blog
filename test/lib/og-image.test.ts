import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ArticleMetaForLocale } from "../../lib/articles";
import {
  type GenerateMetadataParams,
  generateArticleOGImageUrl,
  generateDefaultOGImageUrl,
  generateMetadata,
  generateOGImageUrl,
  type OGImageParams,
} from "../../lib/og-image";

beforeAll(() => {
  vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.com");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("OG Image URL Generation", () => {
  describe("generateOGImageUrl", () => {
    it("should generate a basic URL with no parameters", () => {
      const url = generateOGImageUrl({});
      expect(url).toBe("https://example.com/api/og");
    });

    it("should include title parameter when provided", () => {
      const params: OGImageParams = { title: "Test Title" };
      const url = generateOGImageUrl(params);
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe("Test Title");
    });

    it("should include type parameter when provided with valid value", () => {
      const params: OGImageParams = { type: "article" };
      const url = generateOGImageUrl(params);
      expect(url).toContain("type=article");
    });

    it("should include author parameter when provided", () => {
      const params: OGImageParams = { author: "Test Author" };
      const url = generateOGImageUrl(params);
      expect(url).toContain("author=");
      expect(new URL(url).searchParams.get("author")).toBe("Test Author");
    });

    it("should include all parameters when provided", () => {
      const params: OGImageParams = {
        title: "Test Title",
        type: "article",
        author: "Test Author",
      };
      const url = generateOGImageUrl(params);
      expect(url).toContain("title=");
      expect(url).toContain("type=article");
      expect(url).toContain("author=");
    });

    it("should properly encode special characters in parameters", () => {
      const params: OGImageParams = {
        title: 'Test & Title: Special "Characters"',
      };
      const url = generateOGImageUrl(params);
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe(
        'Test & Title: Special "Characters"'
      );
    });

    it("should use localhost when NEXT_PUBLIC_BASE_URL is not available", () => {
      vi.unstubAllEnvs();

      const params: OGImageParams = { title: "Test Title" };
      const url = generateOGImageUrl(params);
      expect(url).toContain("http://localhost:3000/api/og");

      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.com");
    });
  });

  describe("generateArticleOGImageUrl", () => {
    it("should generate an article OG image URL with article metadata", () => {
      const article: ArticleMetaForLocale = {
        slug: "test-article",
        title: "Test Article",
        description: "This is a test article",
        published: "2025-07-01",
      };

      const url = generateArticleOGImageUrl(article);
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe("Test Article");
      expect(url).toContain("type=article");
    });

    it("should generate an article OG image URL with Chinese title", () => {
      const article: ArticleMetaForLocale = {
        slug: "test-article",
        title: "验证不对称",
        description: "这是一篇测试文章",
        published: "2025-07-01",
      };

      const url = generateArticleOGImageUrl(article);
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe("验证不对称");
      expect(url).toContain("type=article");
    });
  });

  describe("generateDefaultOGImageUrl", () => {
    it("should generate a default OG image URL with default values", () => {
      const url = generateDefaultOGImageUrl();
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe(
        "Design Engineer Blog"
      );
      expect(url).toContain("type=default");
    });

    it("should generate a default OG image URL with custom values", () => {
      const url = generateDefaultOGImageUrl("Custom Title");
      expect(url).toContain("title=");
      expect(new URL(url).searchParams.get("title")).toBe("Custom Title");
      expect(url).toContain("type=default");
    });
  });
});

describe("Metadata Generation", () => {
  describe("generateMetadata", () => {
    it("should generate basic metadata for a regular page", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
      };

      const metadata = generateMetadata(params);

      expect(metadata.title).toBe("Test Page");
      // @ts-expect-error false alarm
      expect(metadata.openGraph?.type).toBe("website");

      const ogImage = metadata.openGraph?.images;
      if (Array.isArray(ogImage) && ogImage.length > 0) {
        // @ts-expect-error false alarm
        expect(ogImage[0].width).toBe(1200);
        // @ts-expect-error false alarm
        expect(ogImage[0].height).toBe(630);
      }

      // @ts-expect-error false alarm
      expect(metadata.twitter?.card).toBe("summary_large_image");

      expect(metadata.description).toBe("Design Engineer Blog");
      expect(metadata.openGraph?.description).toBe("Design Engineer Blog");
      expect(metadata.openGraph?.siteName).toBe("Design Engineer Blog");
      expect(metadata.twitter?.description).toBe("Design Engineer Blog");
    });

    it("should generate metadata for an article page", () => {
      const article: ArticleMetaForLocale = {
        slug: "test-article",
        title: "Test Article",
        description: "This is a test article",
        published: "2025-07-01",
      };

      const params: GenerateMetadataParams = {
        title: article.title,
        slug: article.slug,
        article,
      };

      const metadata = generateMetadata(params);

      expect(metadata.title).toBe("Test Article");

      const openGraph = metadata.openGraph;
      // @ts-expect-error false alarm
      expect(openGraph?.type).toBe("article");

      const ogArticle = openGraph;
      // @ts-expect-error false alarm
      expect(ogArticle?.publishedTime).toBe("2025-07-01");
      // @ts-expect-error false alarm
      expect(ogArticle?.authors).toContain("Ricky Zhang");

      expect(metadata.description).toBe(article.description);
      expect(metadata.openGraph?.description).toBe(article.description);
      expect(metadata.openGraph?.siteName).toBe("Design Engineer Blog");
      expect(metadata.twitter?.description).toBe(article.description);
    });

    it("should include canonical URL when slug is provided", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
        slug: "test-page",
      };

      const metadata = generateMetadata(params);
      expect(metadata.alternates?.canonical).toContain("/test-page");
    });

    it("should use base URL as canonical when no slug is provided", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
      };

      const metadata = generateMetadata(params);
      expect(metadata.alternates?.canonical).toBeTruthy();
    });

    it("should include language alternates for localized content", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
        slug: "test-article",
        locale: "en",
      };

      const metadata = generateMetadata(params);
      const languages = metadata.alternates?.languages;

      expect(languages).toBeDefined();
      expect(languages?.en).toBe("https://example.com/en/test-article");
      expect(languages?.["zh-CN"]).toBe("https://example.com/cn/test-article");
      expect(languages?.["x-default"]).toBe(
        "https://example.com/en/test-article"
      );
    });

    it("should include correct locale in OpenGraph metadata", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
        locale: "cn",
      };

      const metadata = generateMetadata(params);
      expect(metadata.openGraph?.locale).toBe("zh-CN");
    });

    it("should include correct locale for en in OpenGraph metadata", () => {
      const params: GenerateMetadataParams = {
        title: "Test Page",
        locale: "en",
      };

      const metadata = generateMetadata(params);
      expect(metadata.openGraph?.locale).toBe("en");
    });
  });
});
