'use client';

import { LinkIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

// slugify heading text into kebab-case id
const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// generic heading that adds anchor and copy url button
const H = ({
  level = 2,
  children,
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}): ReactElement => {
  const Tag = `h${level}` as const;
  // derive plain text for slug
  const [text, setText] = useState('');

  useEffect(() => {
    if (typeof children === 'string') {
      setText(children);
    } else if (Array.isArray(children)) {
      const firstStr = children.find((c) => typeof c === 'string');
      if (firstStr) {
        setText(firstStr as string);
      }
    }
  }, [children]);

  const id = slugify(text);

  return (
    <Tag
      className="group relative flex scroll-mt-24 items-center gap-2 font-semibold"
      id={id}
    >
      <div className="-left-12 absolute hidden items-center pr-12 opacity-0 transition group-hover:opacity-100 min-[855px]:flex">
        <a
          aria-label="Anchor link"
          className="border bg-background p-2"
          href={`#${id}`}
        >
          <LinkIcon
            absoluteStrokeWidth
            className="text-foreground/50"
            size={16}
            strokeWidth={1.2}
          />
        </a>
      </div>

      {children}
    </Tag>
  );
};

export const H1 = ({ children }: { children: ReactNode }) => (
  <H level={1}>{children}</H>
);

export const H2 = ({ children }: { children: ReactNode }) => (
  <H level={2}>{children}</H>
);
