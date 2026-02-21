import { describe, expect, it, vi } from "vitest";
import { getArticleContent } from "@/lib/article-content";

vi.mock("@/lib/article-content/mdx-manifest", () => ({
  mdxManifest: {
    "verification-asymmetry": {
      en: async () => ({
        default: () => "English body content",
        credit: "English credit",
      }),
      cn: async () => ({
        default: () => "Chinese body content",
        credit: "Chinese credit",
      }),
    },
    "article-without-credit": {
      en: async () => ({
        default: () => "Body without credit",
      }),
    },
  },
}));

describe("getArticleContent", () => {
  it("returns content for valid slug and locale (en)", async () => {
    const content = await getArticleContent("verification-asymmetry", "en");
    expect(content).not.toBeNull();
    expect(content?.body).toBeDefined();
  });

  it("returns content for valid slug and locale (cn)", async () => {
    const content = await getArticleContent("verification-asymmetry", "cn");
    expect(content).not.toBeNull();
    expect(content?.body).toBeDefined();
  });

  it("returns null for missing slug", async () => {
    const content = await getArticleContent("non-existent-article", "en");
    expect(content).toBeNull();
  });

  it("returns null for missing locale", async () => {
    const content = await getArticleContent(
      "verification-asymmetry",
      "fr" as "en"
    );
    expect(content).toBeNull();
  });

  it("exposes credit when present", async () => {
    const content = await getArticleContent("verification-asymmetry", "en");
    expect(content?.credit).toBeDefined();
    expect(content?.credit).toBe("English credit");
  });

  it("exposes credit for cn locale when present", async () => {
    const content = await getArticleContent("verification-asymmetry", "cn");
    expect(content?.credit).toBeDefined();
    expect(content?.credit).toBe("Chinese credit");
  });

  it("returns undefined credit when not present in module", async () => {
    const content = await getArticleContent("article-without-credit", "en");
    expect(content).not.toBeNull();
    expect(content?.credit).toBeUndefined();
  });
});
