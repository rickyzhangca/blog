'use client';

import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { RotateCcwIcon } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useState } from 'react';
import { isDevModeAtom } from '../atoms';
import { Cover as VerificationAsymmetryCover } from '../verification-asymmetry/cover';

const covers: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement> & { className?: string }>
> = {
  'verification-asymmetry': VerificationAsymmetryCover,
}


type CoverProps = {
  id: string;
};

export const Cover = ({ id }: CoverProps) => {
  const SvgComponent = covers[id];
  const [countPlayed, setCountPlayed] = useState(0);
  const [playId, setPlayId] = useState(`${id}-cover-animation-${countPlayed}`);
  const [isDevMode] = useAtom(isDevModeAtom);

  return (
    <div className="group/cover relative aspect-3/2 w-full xs:w-40 outline outline-border lg:w-60">
      <button
        className={cn(
          'absolute top-0 right-0 z-10 cursor-pointer bg-white p-2 outline outline-border transition',
          !isDevMode && 'opacity-0 group-hover/cover:opacity-100'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPlayId(`${id}-cover-animation-${countPlayed + 1}`);
          setCountPlayed((prev) => prev + 1);
        }}
        type="button"
      >
        <RotateCcwIcon size={16} strokeWidth={1.2} />
      </button>
      {SvgComponent && (
        <SvgComponent
          className="absolute inset-0 h-full w-full translate-y-1"
          key={playId}
        />
      )}
    </div>
  );
};
