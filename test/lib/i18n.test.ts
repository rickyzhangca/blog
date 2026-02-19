import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  getAlternateLocale,
  getArticlePath,
  getHomePath,
  getLocaleHrefLang,
  getLocaleLabel,
  isValidLocale,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from "../../lib/i18n";

describe("i18n utilities", () => {
  describe("constants", () => {
    it("should have correct supported locales", () => {
      expect(SUPPORTED_LOCALES).toEqual(["en", "cn"]);
    });

    it("should have correct default locale", () => {
      expect(DEFAULT_LOCALE).toBe("en");
    });
  });

  describe("isValidLocale", () => {
    it("should return true for valid locales", () => {
      expect(isValidLocale("en")).toBe(true);
      expect(isValidLocale("cn")).toBe(true);
    });

    it("should return false for invalid locales", () => {
      expect(isValidLocale("fr")).toBe(false);
      expect(isValidLocale("de")).toBe(false);
      expect(isValidLocale("")).toBe(false);
      expect(isValidLocale(null)).toBe(false);
      expect(isValidLocale(undefined)).toBe(false);
    });
  });

  describe("normalizeLocale", () => {
    it("should return the locale if valid", () => {
      expect(normalizeLocale("en")).toBe("en");
      expect(normalizeLocale("cn")).toBe("cn");
    });

    it("should return default locale for invalid values", () => {
      expect(normalizeLocale("fr")).toBe("en");
      expect(normalizeLocale("")).toBe("en");
      expect(normalizeLocale(null)).toBe("en");
      expect(normalizeLocale(undefined)).toBe("en");
    });
  });

  describe("getAlternateLocale", () => {
    it("should return cn for en", () => {
      expect(getAlternateLocale("en")).toBe("cn");
    });

    it("should return en for cn", () => {
      expect(getAlternateLocale("cn")).toBe("en");
    });
  });

  describe("getHomePath", () => {
    it("should return correct path for en", () => {
      expect(getHomePath("en")).toBe("/en");
    });

    it("should return correct path for cn", () => {
      expect(getHomePath("cn")).toBe("/cn");
    });
  });

  describe("getArticlePath", () => {
    it("should return correct path for en article", () => {
      expect(getArticlePath("my-article", "en")).toBe("/en/my-article");
    });

    it("should return correct path for cn article", () => {
      expect(getArticlePath("my-article", "cn")).toBe("/cn/my-article");
    });
  });

  describe("getLocaleLabel", () => {
    it("should return EN for en locale", () => {
      expect(getLocaleLabel("en")).toBe("EN");
    });

    it("should return 中文 for cn locale", () => {
      expect(getLocaleLabel("cn")).toBe("中文");
    });
  });

  describe("getLocaleHrefLang", () => {
    it("should return en for en locale", () => {
      expect(getLocaleHrefLang("en")).toBe("en");
    });

    it("should return zh-CN for cn locale", () => {
      expect(getLocaleHrefLang("cn")).toBe("zh-CN");
    });
  });
});
