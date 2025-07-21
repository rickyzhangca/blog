'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type BackButtonProps = {
  className?: string;
};

export const BackButton = ({ className }: BackButtonProps) => {
  return (
    <Link
      className={cn(
        'flex items-center justify-center border bg-white px-4 py-3 text-foreground',
        className
      )}
      href="/"
    >
      Back
    </Link>
  );
};
