export type Locale = "en" | "cn";

export const SUPPORTED_LOCALES: readonly Locale[] = ["en", "cn"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export function isValidLocale(
  value: string | null | undefined
): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (isValidLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "cn" : "en";
}

export function getHomePath(locale: Locale): string {
  return `/${locale}`;
}

export function getArticlePath(slug: string, locale: Locale): string {
  return `/${locale}/${slug}`;
}

export function getLocaleLabel(locale: Locale): string {
  return locale === "en" ? "EN" : "中文";
}

export function getLocaleHrefLang(locale: Locale): string {
  return locale === "en" ? "en" : "zh-CN";
}
