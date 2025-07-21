'use client';

import { ArrowUpToLineIcon } from 'lucide-react';

export const BackToTopButton = () => {
  return (
    <button
      className="flex cursor-pointer items-center justify-center border bg-white p-3.5 text-foreground"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type="button"
    >
      <ArrowUpToLineIcon absoluteStrokeWidth size={20} strokeWidth={1.2} />
    </button>
  );
};
