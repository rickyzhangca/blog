import type { Metadata } from 'next';
import type { ArticleMeta } from './articles';

/**
 * Parameters for generating OG image URLs
 */
export interface OGImageParams {
  title?: string;
  description?: string;
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
  const baseUrl = new URL('/api/og', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  
  // Add title parameter if provided
  if (params.title) {
    baseUrl.searchParams.append('title', encodeURIComponent(params.title));
  }
  
  // Add description parameter if provided
  if (params.description) {
    baseUrl.searchParams.append('description', encodeURIComponent(params.description));
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
 * @param description - Optional description override
 * @returns The fully constructed default OG image URL
 */
export function generateDefaultOGImageUrl(
  title = 'Design Engineer Blog',
  description = 'Thoughts on design, engineering, and the intersection of both.'
): string {
  return generateOGImageUrl({
    title,
    description,
    type: 'default',
  });
}/**

 * Parameters for generating metadata objects
 */
export interface GenerateMetadataParams {
  title: string;
  description: string;
  slug?: string;
  article?: ArticleMeta;
}

/**
 * Generates a Next.js Metadata object with OG image and other social meta tags
 * 
 * @param params - Parameters for metadata generation
 * @returns A Next.js Metadata object with OG image and other social meta tags
 */
export function generateMetadata(params: GenerateMetadataParams): Metadata {
  const { title, description, article } = params;
  
  // Determine if this is an article page or a regular page
  const isArticle = !!article;
  
  // Generate the appropriate OG image URL
  const ogImageUrl = isArticle 
    ? generateArticleOGImageUrl(article)
    : generateDefaultOGImageUrl(title, description);
  
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
      // Add article-specific OG tags if this is an article
      ...(isArticle && {
        publishedTime: article.published,
        authors: ['Ricky Zhang'], // This could be dynamic if author info is available
      }),
    },
    
    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@rickyrickyriri', // This could be configurable
    },
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
  };
}