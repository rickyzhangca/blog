import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { generateMetadata as generateOGMetadata } from '@/lib/og-image';
import { cn } from '@/lib/utils';
import { Footer } from './footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = generateOGMetadata({
  title: 'Design Engineer Blog',
  description: 'Thoughts on design and design engineering',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          'mx-auto flex min-h-screen max-w-[800px] flex-col border-x'
        )}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
