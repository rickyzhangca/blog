import type { Metadata } from 'next';
import type { ArticleMeta } from './articles';

export interface OGImageParams {
  title?: string;
  type?: 'article' | 'default';
  author?: string;
}

/**
 * Generates an OG image URL with properly encoded parameters
 *
 * @param params - Parameters for the OG image
 * @returns The fully constructed OG image URL
 */
export function generateOGImageUrl(params: OGImageParams): string {
  // Start with the base URL for the OG image endpoint
  const baseUrl = new URL(
    '/api/og',
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  );

  // Add title parameter if provided
  if (params.title) {
    baseUrl.searchParams.append('title', encodeURIComponent(params.title));
  }

  // Add type parameter if provided (article or default)
  if (params.type && ['article', 'default'].includes(params.type)) {
    baseUrl.searchParams.append('type', params.type);
  }

  // Add author parameter if provided
  if (params.author) {
    baseUrl.searchParams.append('author', encodeURIComponent(params.author));
  }

  return baseUrl.toString();
}

/**
 * Generates an OG image URL specifically for an article
 *
 * @param article - The article metadata
 * @returns The fully constructed OG image URL for the article
 */
export function generateArticleOGImageUrl(article: ArticleMeta): string {
  return generateOGImageUrl({
    title: article.title,
    type: 'article',
  });
}

/**
 * Generates a default OG image URL for pages without specific metadata
 *
 * @param title - Optional title override
 * @returns The fully constructed default OG image URL
 */
export function generateDefaultOGImageUrl(
  title = 'Design Engineer Blog'
): string {
  return generateOGImageUrl({
    title,
    type: 'default',
  });
}

export interface GenerateMetadataParams {
  title: string;
  slug?: string;
  article?: ArticleMeta;
  description?: string;
}

/**
 * Generates a Next.js Metadata object with OG image and other social meta tags
 *
 * @param params - Parameters for metadata generation
 * @returns A Next.js Metadata object with OG image and other social meta tags
 */
export function generateMetadata(params: GenerateMetadataParams): Metadata {
  const { title, article, description: customDescription } = params;

  // Determine if this is an article page or a regular page
  const isArticle = !!article;

  // Determine description
  const description =
    customDescription ??
    (article ? article.description : 'Design Engineer Blog');

  // Generate the appropriate OG image URL
  const ogImageUrl = isArticle
    ? generateArticleOGImageUrl(article)
    : generateDefaultOGImageUrl(title);

  // Construct the canonical URL if slug is provided
  const url = params.slug
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${params.slug}`
    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Construct the metadata object with all required tags
  return {
    // Basic metadata
    title,
    description,

    // Open Graph metadata
    openGraph: {
      title,
      description,
      siteName: 'Design Engineer Blog',
      type: isArticle ? 'article' : 'website',
      url,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(isArticle && {
        publishedTime: article.published,
        authors: ['Ricky Zhang'],
      }),
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@rickyrickyriri',
    },

    // Canonical URL
    alternates: {
      canonical: url,
    },
  };
}
