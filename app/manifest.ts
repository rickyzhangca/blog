import type { MetadataRoute } from 'next';

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.rickyzhang.me';

  return {
    name: 'Design Engineer Blog',
    short_name: 'Design Engineer Blog',
    description: 'Thoughts on design and design engineering',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: `${baseUrl}/favicon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
