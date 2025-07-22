import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// GET will be dynamically imported after mocks are set up
let GET: (req: NextRequest) => Promise<Response>;

// Mock the logger module (support both alias and relative import)
vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logDebug: vi.fn(),
  startPerformanceMonitoring: vi.fn().mockImplementation(() => ({
    end: vi.fn().mockReturnValue(100),
  })),
  PerformanceMonitor: vi.fn().mockImplementation(() => ({
    end: vi.fn().mockReturnValue(100),
  })),
}));

// Mock the logger module with relative path
vi.mock('../../lib/logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logDebug: vi.fn(),
  startPerformanceMonitoring: vi.fn().mockImplementation(() => ({
    end: vi.fn().mockReturnValue(100), // Mock returning 100ms as duration
  })),
  PerformanceMonitor: vi.fn().mockImplementation(() => ({
    end: vi.fn().mockReturnValue(100),
  })),
}));

// Mock the ImageResponse class
vi.mock('next/og', () => ({
  ImageResponse: vi.fn().mockImplementation((element, options) => {
    return {
      element,
      options,
      headers: new Headers({
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      }),
    };
  }),
}));

describe('OG Image API Endpoint', () => {
  // Setup environment and mocks
  beforeAll(async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://example.com');

    // mock global fetch to avoid real network requests
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(new Uint8Array(), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      })
    ) as unknown as typeof fetch;

    // dynamically import route after mocks
    const route = await import('../../app/api/og/route');
    GET = route.GET;
  });

  afterAll(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  describe('GET handler', () => {
    it('should generate an OG image with default parameters', async () => {
      // Create a mock request
      const request = new NextRequest('https://example.com/api/og');

      // Call the GET handler
      const response = await GET(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();

      // Get the last call to ImageResponse
      //@ts-expect-error mocked
      const lastCall = ImageResponse.mock.calls.at(-1);
      const element = lastCall[0];

      // no content assertions needed for logo-only image
      // logo-only default OG does not include title text
      expect(element).toBeDefined();
    });

    it('should generate an OG image with type parameter', async () => {
      // Create a mock request with type parameter
      const request = new NextRequest(
        'https://example.com/api/og?type=article'
      );

      // Call the GET handler
      const response = await GET(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it('should generate an OG image with author parameter', async () => {
      // Create a mock request with author parameter
      const request = new NextRequest(
        'https://example.com/api/og?author=Test%20Author'
      );

      // Call the GET handler
      const response = await GET(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();
    });

    it('should generate an OG image with all parameters', async () => {
      // Create a mock request with all parameters
      const request = new NextRequest(
        'https://example.com/api/og?title=Test%20Title'
      );

      // Call the GET handler
      const response = await GET(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();

      // Get the last call to ImageResponse
      //@ts-expect-error mocked
      const lastCall = ImageResponse.mock.calls.at(-1);
      const element = lastCall[0];

      // logo-only default OG does not include title text
      expect(element).toBeDefined();
    });

    it('should sanitize input parameters', async () => {
      // Create a mock request with potentially dangerous input
      const request = new NextRequest(
        'https://example.com/api/og?title=<script>alert("XSS")</script>&description=javascript:alert(1)'
      );

      // Call the GET handler
      const response = await GET(request);

      // Verify the response
      expect(response).toBeDefined();
      expect(ImageResponse).toHaveBeenCalled();

      // Get the last call to ImageResponse
      //@ts-expect-error mocked
      const lastCall = ImageResponse.mock.calls.at(-1);
      const element = lastCall[0];

      // Convert element to string to check if it sanitized the input
      const elementString = JSON.stringify(element);
      expect(elementString).not.toContain('<script>');
      expect(elementString).not.toContain('javascript:');
    });

    it('should handle errors gracefully', async () => {
      // Mock ImageResponse to throw an error
      //@ts-expect-error mocked
      ImageResponse.mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      // Create a mock request
      const request = new NextRequest('https://example.com/api/og');

      // Call the GET handler
      const response = await GET(request);

      // Verify the response is still defined (fallback image)
      expect(response).toBeDefined();
    });

    it('should handle timeout errors', async () => {
      // Mock a timeout error by making ImageResponse take longer than the timeout
      vi.useFakeTimers();

      //@ts-expect-error mocked
      ImageResponse.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              headers: new Headers({
                'Content-Type': 'image/png',
              }),
            });
          }, 10_000); // Longer than the timeout
        });
      });

      // Create a mock request
      const request = new NextRequest('https://example.com/api/og');

      // Call the GET handler
      const responsePromise = GET(request);

      // Fast-forward time
      vi.advanceTimersByTime(6000);

      // Resolve the promise
      const response = await responsePromise;

      // Verify the response is still defined (fallback image)
      expect(response).toBeDefined();

      // Restore real timers
      vi.useRealTimers();
    });
  });
});
