import { generateMetadata as generateOGMetadata } from '@/lib/og-image';
import type { Metadata } from 'next';
import { ArticleLayout } from '../article-layout';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import meta from './meta.json' with { type: 'json' };
import { Team } from './team';

export const metadata: Metadata = generateOGMetadata({
  title: meta.title,
  slug: 'translating-taste-into-quality',
  article: { ...meta, slug: 'translating-taste-into-quality' },
});

const VerificationAsymmetry = () => {
  return (
    <ArticleLayout
      credit={
        <>
          <div className="not-prose -space-x-3 flex w-fit transition-all hover:space-x-1.5">
            <Avatar>
              <AvatarImage src="/verification-asymmetry/jerry-wang.webp" />
              <AvatarFallback>JW</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/verification-asymmetry/ryan-yao.webp" />
              <AvatarFallback>RY</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/verification-asymmetry/anthony-ung.webp" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </div>
          <p>
            Thanks to{' '}
            <a
              href="https://www.jw.works/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Jerry Wang
            </a>
            ,{' '}
            <a
              href="https://ryanyao.design/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ryan Yao
            </a>
            , and{' '}
            <a
              href="https://anthonyung.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Anthony Ung
            </a>{' '}
            for reviewing this article, and the design engineering team at{' '}
            <a
              href="https://wealthsimple.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Wealthsimple
            </a>{' '}
            for inspirations.
          </p>
        </>
      }
    >
      <Team />
    </ArticleLayout>
  );
};

export default VerificationAsymmetry;
