import { describe, expect, it } from "vitest";
import type { ArticleMeta } from "../../lib/articles";
import {
  getArticleBySlug,
  getArticleMetaForLocale,
  getArticlesForLocale,
} from "../../lib/articles";

describe("articles utilities", () => {
  describe("getArticleMetaForLocale", () => {
    it("should return locale-specific metadata for en", () => {
      const meta: ArticleMeta = {
        slug: "test-article",
        title: { en: "Test Article", cn: "测试文章" },
        description: { en: "English description", cn: "中文描述" },
        published: "2025-07-01",
      };

      const result = getArticleMetaForLocale(meta, "en");

      expect(result.slug).toBe("test-article");
      expect(result.title).toBe("Test Article");
      expect(result.description).toBe("English description");
      expect(result.published).toBe("2025-07-01");
    });

    it("should return locale-specific metadata for cn", () => {
      const meta: ArticleMeta = {
        slug: "test-article",
        title: { en: "Test Article", cn: "测试文章" },
        description: { en: "English description", cn: "中文描述" },
        published: "2025-07-01",
      };

      const result = getArticleMetaForLocale(meta, "cn");

      expect(result.slug).toBe("test-article");
      expect(result.title).toBe("测试文章");
      expect(result.description).toBe("中文描述");
      expect(result.published).toBe("2025-07-01");
    });
  });

  describe("getArticlesForLocale", () => {
    it("should return articles with localized content for en", () => {
      const articles = getArticlesForLocale("en");

      expect(articles.length).toBeGreaterThan(0);

      for (const article of articles) {
        expect(typeof article.slug).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.description).toBe("string");
        expect(typeof article.published).toBe("string");
      }
    });

    it("should return articles with localized content for cn", () => {
      const articles = getArticlesForLocale("cn");

      expect(articles.length).toBeGreaterThan(0);

      for (const article of articles) {
        expect(typeof article.slug).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.description).toBe("string");
        expect(typeof article.published).toBe("string");
      }
    });

    it("should return same number of articles for both locales", () => {
      const enArticles = getArticlesForLocale("en");
      const cnArticles = getArticlesForLocale("cn");

      expect(enArticles.length).toBe(cnArticles.length);
    });
  });

  describe("getArticleBySlug", () => {
    it("should return article for valid slug", () => {
      const article = getArticleBySlug("verification-asymmetry");

      expect(article).toBeDefined();
      expect(article?.slug).toBe("verification-asymmetry");
      expect(article?.title.en).toBe("Verification asymmetry");
      expect(article?.title.cn).toBe("验证不对称");
    });

    it("should return undefined for invalid slug", () => {
      const article = getArticleBySlug("non-existent-article");

      expect(article).toBeUndefined();
    });
  });
});
