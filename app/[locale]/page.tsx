import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArticleItem } from "@/app/components/article-item";
import Scene from "@/app/components/scene-r3f";
import { Divider } from "@/app/divider";
import { getArticlesForLocale } from "@/lib/articles";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { generateMetadata as generateOGMetadata } from "@/lib/og-image";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): Array<{ locale: string }> {
  return [{ locale: "en" }, { locale: "cn" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    return { title: "Not Found" };
  }

  const locale: Locale = localeParam;
  const title = locale === "en" ? "Design Engineer Blog" : "设计工程师博客";

  return generateOGMetadata({
    title,
    locale,
  });
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    redirect("/en");
  }

  const locale: Locale = localeParam;
  const articles = getArticlesForLocale(locale);

  return (
    <div className="flex flex-1 flex-col">
      <Divider className="border-t-0" />
      <Scene />
      <Divider />
      <div className="flex flex-col">
        {articles.map((article, idx) => (
          <div className="flex-1" key={article.slug}>
            {idx > 0 && <Divider className="h-4" />}
            <ArticleItem article={article} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
