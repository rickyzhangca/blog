import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // https://nextjs.org/docs/app/api-reference/components/image#dangerouslyallowsvg
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
};

export default nextConfig;
