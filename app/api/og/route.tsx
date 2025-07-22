/** biome-ignore-all lint/performance/noImgElement: this is og image */

import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import {
  logError,
  logInfo,
  logWarn,
  startPerformanceMonitoring,
} from '@/lib/logger';

// Set runtime to edge for optimal performance
export const runtime = 'edge';

// Set revalidation time for static regeneration (0 = always revalidate)
export const revalidate = 31_536_000; // 1 year in seconds

// Performance optimization: Cache color schemes and common configurations
const COLOR_SCHEMES = {
  light: {
    background: '#FFFFFF',
    foreground: '#252525',
    border: '#EBEBEB',
    muted: '#8D8D8D',
    accent: '#252525',
  },
  dark: {
    background: '#1A1A1A',
    foreground: '#F5F5F5',
    border: '#333333',
    muted: '#A8A8A8',
    accent: '#5B8DEF',
  },
  article: {
    background: '#FFFFFF',
    foreground: '#252525',
    border: '#EBEBEB',
    muted: '#8D8D8D',
    accent: '#5B8DEF',
  },
} as const;

// Performance optimization: Pre-computed dimensions
const OG_DIMENSIONS = {
  width: 1200,
  height: 630,
} as const;

// Cache control constants for better reuse and consistency
const CACHE_CONTROL = {
  LONG: 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
  SHORT: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
  NONE: 'no-store, max-age=0, must-revalidate',
} as const;

// fetch logo and convert to base64 data url (satori only renders data URIs reliably)
const LOGO_RES = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`
);
const LOGO_ARRAY = await LOGO_RES.arrayBuffer();
const LOGO_SRC = `data:image/png;base64,${Buffer.from(LOGO_ARRAY).toString('base64')}`;

const DEFAULT_OG_IMAGE = new ImageResponse(
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    }}
  >
    <img
      alt="logo"
      src={LOGO_SRC}
      style={{
        width: '80%',
        height: '80%',
        transform: 'translateX(-25px) translateY(5px)',
      }}
    />
  </div>,
  {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': CACHE_CONTROL.SHORT,
      'Content-Type': 'image/png',
      Vary: 'Accept',
      'X-Image-Type': 'fallback',
    },
  }
);

/**
 * OG Image generation API endpoint
 * Generates dynamic Open Graph images for social media sharing
 *
 * @param request - The incoming request with query parameters
 * @returns ImageResponse - A 1200x630 PNG image for social media previews
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: it's readable
export async function GET(request: NextRequest) {
  // Start performance monitoring for the entire request
  const perfMonitor = startPerformanceMonitoring('og-image-generation');

  // Log the incoming request
  logInfo('OG Image request received', {
    url: request.url,
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || 'unknown',
  });

  const isDev = process.env.NODE_ENV !== 'production';

  // Check for conditional requests (If-None-Match header) only in production to speed up local development
  if (!isDev) {
    const ifNoneMatch = request.headers.get('If-None-Match');
    const cacheKey = `"${Buffer.from(request.url).toString('base64')}"`;
    if (ifNoneMatch === cacheKey) {
      logInfo('Cache hit: returning 304 Not Modified', { cacheKey });
      return new Response(null, {
        status: 304,
        headers: {
          'Cache-Control': CACHE_CONTROL.LONG,
          ETag: cacheKey,
        },
      });
    }
  }

  // Implement timeout handling for image generation (requirement 3.1, 3.3)
  // Set a 3-second timeout for the entire operation (reduced from 5s for better UX)
  const TIMEOUT_MS = 3000;

  try {
    // Use Promise.race to implement timeout handling (requirement 3.1, 3.3)
    const response = await Promise.race([
      // The actual image generation logic
      generateOGImage(request),

      // The timeout promise that rejects after TIMEOUT_MS milliseconds
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error(`Operation timed out after ${TIMEOUT_MS}ms`)),
          TIMEOUT_MS
        );
      }),
    ]);

    // Log successful generation
    const duration = perfMonitor.end({ url: request.url });
    logInfo('OG Image generated successfully', {
      url: request.url,
      duration,
      contentType: response.headers.get('Content-Type'),
      cacheControl: response.headers.get('Cache-Control'),
    });

    return response;
  } catch (error) {
    // Log the error for debugging purposes
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('timed out');

    if (isTimeout) {
      logWarn('OG Image generation timed out', {
        url: request.url,
        timeout: TIMEOUT_MS,
        error: errorMessage,
      });
    } else {
      logError(
        'OG Image generation error',
        {
          url: request.url,
        },
        error instanceof Error ? error : new Error(errorMessage)
      );
    }

    // Create a fallback image with default branding (requirement 2.4, 3.3)
    try {
      logInfo('Attempting to generate fallback image');
      const fallbackResponse = await createFallbackImage();

      // Log fallback success
      const duration = perfMonitor.end({ url: request.url, fallback: true });
      logInfo('Fallback image generated successfully', {
        url: request.url,
        duration,
        fallback: true,
      });

      return fallbackResponse;
    } catch (fallbackError) {
      // Last resort fallback if image generation completely fails
      const fallbackErrorMessage =
        fallbackError instanceof Error
          ? fallbackError.message
          : 'Unknown error';

      logError(
        'Fallback image generation failed',
        {
          url: request.url,
          originalError: errorMessage,
        },
        fallbackError instanceof Error
          ? fallbackError
          : new Error(fallbackErrorMessage)
      );

      // Return a simple error response with appropriate headers
      perfMonitor.end({ url: request.url, failed: true });

      return new Response('Error generating image', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': CACHE_CONTROL.NONE,
          'X-Error': 'Failed to generate OG image',
        },
      });
    }
  }
}

/**
 * Generates the OG image based on request parameters
 *
 * @param request - The incoming request with query parameters
 * @returns ImageResponse - A 1200x630 PNG image for social media previews
 */
async function generateOGImage(request: NextRequest): Promise<ImageResponse> {
  // Start performance monitoring for image generation
  const perfMonitor = startPerformanceMonitoring('og-image-render');

  // Parse the request URL and extract query parameters
  const url = new URL(request.url);

  // Extract and sanitize title parameter with validation (requirement 2.1, 2.2, 2.4)
  const title = sanitizeInput(url.searchParams.get('title'), {
    maxLength: 100, // Limit title length for visual balance
    minLength: 3, // Require at least 3 characters for a meaningful title
    defaultValue: 'Design Engineer Blog',
    allowedChars: /[A-Za-z0-9\s.,!?:;'"()[\]{}\-_+=&%$#@]/g, // Allow common text characters
  });

  // Extract and sanitize description parameter with validation (requirement 2.1, 2.2, 2.4)
  const description = sanitizeInput(url.searchParams.get('description'), {
    maxLength: 250, // Limit description length to fit in OG image
    defaultValue:
      'Thoughts on design, engineering, and the intersection of both.',
    allowedChars: /[A-Za-z0-9\s.,!?:;'"()[\]{}\-_+=&%$#@]/g, // Allow common text characters
  });

  // Extract and validate content type parameter (article or default)
  const typeParam = url.searchParams.get('type');
  const type = ['article', 'default'].includes(typeParam || '')
    ? typeParam
    : 'default';

  // Extract and sanitize author parameter (optional)
  const author = sanitizeInput(url.searchParams.get('author'), {
    maxLength: 50,
    defaultValue: 'Ricky Zhang',
    allowedChars: /[A-Za-z0-9\s.\-_]/g, // More restrictive for author names
  });

  // Log parameter validation results
  logInfo('OG Image parameters processed', {
    title: title !== url.searchParams.get('title') ? 'sanitized' : 'unchanged',
    description:
      description !== url.searchParams.get('description')
        ? 'sanitized'
        : 'unchanged',
    type,
    author:
      author !== url.searchParams.get('author') ? 'sanitized' : 'unchanged',
    titleLength: title.length,
    descriptionLength: description.length,
  });

  // Use pre-computed dimensions for performance (requirement 1.2)
  const { width, height } = OG_DIMENSIONS;

  // Use cached color scheme (no theme switch needed)
  const colorScheme = type === 'article' ? 'article' : 'default';
  const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES];

  // Wrap the actual image generation in another try-catch for more granular error handling
  try {
    // Log the start of image rendering
    logInfo('Starting OG image rendering', {
      type,
      colorScheme,
      dimensions: `${width}x${height}`,
    });

    // article OG: logo and title only
    if (type === 'article') {
      const imageResponse = await new ImageResponse(
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            backgroundColor: colors.background,
          }}
        >
          <img
            alt="logo"
            src={LOGO_SRC}
            style={{
              height: '240px',
              margin: '40px',
              transform: 'translateX(-15px) translateY(5px)',
            }}
          />
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              width: '100%',
              padding: '50px 60px',
              backgroundColor: colors.foreground,
            }}
          >
            <h1
              style={{
                fontSize: '88px',
                color: colors.background,
                margin: 0,
                lineHeight: 1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h1>
          </div>
        </div>,
        {
          width,
          height,
          headers: {
            'Cache-Control': CACHE_CONTROL.SHORT,
          },
        }
      );
      const durationArticle = perfMonitor.end();
      logInfo('Article OG image rendered', { duration: durationArticle });
      return imageResponse;
    }

    const imageResponse = await DEFAULT_OG_IMAGE;

    const duration = perfMonitor.end();
    imageResponse.headers.set('Server-Timing', `gen;dur=${duration}`);
    logInfo('OG image rendered', { duration });

    return imageResponse;
  } catch (renderError) {
    // Handle specific rendering errors
    const errorMessage =
      renderError instanceof Error ? renderError.message : 'Unknown error';

    // Log the error with detailed context
    logError(
      'OG Image rendering error',
      {
        type,
        titleLength: title.length,
        descriptionLength: description.length,
        url: request.url,
      },
      renderError instanceof Error ? renderError : new Error(errorMessage)
    );

    // End performance monitoring with error status
    perfMonitor.end({ error: true });

    throw new Error(`Image rendering failed: ${errorMessage}`);
  }
}

/**
 * Creates a default branded fallback image for error scenarios
 *
 * @returns ImageResponse with default branding
 */
async function createFallbackImage(): Promise<ImageResponse> {
  // Start performance monitoring for fallback image generation
  const perfMonitor = startPerformanceMonitoring('og-fallback-image');

  logInfo('Generating fallback OG image');

  try {
    const fallbackResponse = await DEFAULT_OG_IMAGE;

    // Add fallback-specific cache headers
    fallbackResponse.headers.set('Cache-Control', CACHE_CONTROL.SHORT);
    fallbackResponse.headers.set('Vary', 'Accept');
    fallbackResponse.headers.set('X-Image-Type', 'fallback');

    // Log successful fallback generation
    const duration = perfMonitor.end();
    logInfo('Fallback image generated successfully', { duration });

    return fallbackResponse;
  } catch (error) {
    // Log error in fallback generation
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(
      'Fallback image generation failed',
      {},
      error instanceof Error ? error : new Error(errorMessage)
    );

    // End performance monitoring with error status
    perfMonitor.end({ error: true });

    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Sanitizes and validates input strings to prevent XSS and other injection attacks
 * Implements length limits and character filtering for parameters
 *
 * @param input - The input string to sanitize
 * @param options - Optional configuration for validation
 * @returns The sanitized string
 */
function sanitizeInput(
  input: string | null | undefined,
  options: {
    maxLength?: number;
    minLength?: number;
    defaultValue?: string;
    allowedChars?: RegExp;
    paramName?: string; // Added for better logging
  } = {}
): string {
  // Set default options
  const {
    maxLength = 200,
    minLength = 0,
    defaultValue = '',
    allowedChars,
    paramName = 'parameter',
  } = options;

  // Handle null, undefined or empty input
  if (!input || input.trim().length === 0) {
    logInfo(`Empty ${paramName} provided, using default value`, {
      paramName,
      defaultValue,
    });
    return defaultValue;
  }

  // Trim whitespace
  let sanitized = input.trim();
  const validationIssues: string[] = [];
  let wasModified = false;

  // Enforce minimum length
  if (sanitized.length < minLength) {
    validationIssues.push(`too_short:${sanitized.length}<${minLength}`);
    logWarn(`${paramName} too short, using default value`, {
      paramName,
      inputLength: sanitized.length,
      minLength,
      defaultValue,
    });
    return defaultValue;
  }

  // Limit length (prevent excessively long inputs)
  if (sanitized.length > maxLength) {
    validationIssues.push(`too_long:${sanitized.length}>${maxLength}`);
    sanitized = `${sanitized.substring(0, maxLength)}...`;
    wasModified = true;
  }

  // Check for HTML tags
  const originalBeforeHtmlRemoval = sanitized;
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  if (sanitized !== originalBeforeHtmlRemoval) {
    validationIssues.push('html_tags_removed');
    wasModified = true;
  }

  // Filter out disallowed characters
  if (allowedChars) {
    const originalBeforeCharFiltering = sanitized;
    const matches = sanitized.match(allowedChars);

    if (matches) {
      const filtered = matches.join('');
      if (filtered !== originalBeforeCharFiltering) {
        validationIssues.push('invalid_chars_removed');
        sanitized = filtered;
        wasModified = true;
      }
    } else {
      validationIssues.push('no_valid_chars');
      sanitized = defaultValue;
      wasModified = true;
    }
  }

  // Check for potentially dangerous patterns
  const originalBeforeDangerousPatterns = sanitized;
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');

  if (sanitized !== originalBeforeDangerousPatterns) {
    validationIssues.push('dangerous_patterns_removed');
    wasModified = true;
  }

  // Log validation results if there were issues
  if (wasModified) {
    logWarn(`${paramName} required sanitization`, {
      paramName,
      issues: validationIssues,
      originalLength: input.length,
      sanitizedLength: sanitized.length,
    });
  }

  return sanitized;
}
