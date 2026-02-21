"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getAlternateLocale, getArticlePath } from "@/lib/i18n";

interface ArticleLanguageToggleProps {
  locale: Locale;
  slug: string;
}

export function ArticleLanguageToggle({
  locale,
  slug,
}: ArticleLanguageToggleProps) {
  const alternateLocale = getAlternateLocale(locale);
  const alternatePath = getArticlePath(slug, alternateLocale);

  return (
    <Link
      className="flex w-fit items-center gap-1.5 rounded border px-3 py-1.5 font-medium text-sm transition-colors hover:bg-foreground/5"
      href={alternatePath}
    >
      <span
        className={locale === "en" ? "text-foreground" : "text-foreground/40"}
      >
        EN
      </span>
      <span className="text-foreground/40">/</span>
      <span
        className={locale === "cn" ? "text-foreground" : "text-foreground/40"}
      >
        中文
      </span>
    </Link>
  );
}
