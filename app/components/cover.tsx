'use client';

import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { RotateCcwIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { isDevModeAtom } from '../atoms';

type CoverProps = {
  id: string;
};

export const Cover = ({ id }: CoverProps) => {
  const [playId, setPlayId] = useState(`${id}-cover-animation`);
  const [isDevMode] = useAtom(isDevModeAtom);

  return (
    <div className="group/cover relative h-40 w-60 border">
      <button
        className={cn(
          'absolute right-0 bottom-0 z-10 cursor-pointer p-2 outline outline-border transition hover:bg-foreground/3 active:bg-background ',
          !isDevMode && 'opacity-0 group-hover/cover:opacity-100'
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPlayId(`${id}-cover-animation`);
        }}
        type="button"
      >
        <RotateCcwIcon size={16} strokeWidth={1.2} />
      </button>
      <svg
        className="translate-y-1"
        fill="none"
        height="160"
        key={playId}
        viewBox="0 0 240 160"
        width="240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Verification asymmetry cover</title>
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-foreground"
          d="M56 132L56 23"
          initial={{ pathLength: 0 }}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <motion.g
          animate={{ y: -109, scale: 1 }}
          initial={{ y: 0, scale: 0 }}
          transition={{ duration: 1.05, ease: 'easeInOut' }}
        >
          <path
            d="M0 -5 L10 0 L0 5 Z"
            fill="currentColor"
            transform="translate(56 132) rotate(-90)"
          />
        </motion.g>
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-foreground"
          d="M56 132L184 132"
          initial={{ pathLength: 0 }}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <motion.g
          animate={{ x: 128, scale: 1 }}
          initial={{ x: 0, scale: 0 }}
          transition={{ duration: 1.05, ease: 'easeInOut' }}
        >
          <path
            d="M0 -5 L10 0 L0 5 Z"
            fill="currentColor"
            transform="translate(56 132)"
          />
        </motion.g>
        <motion.path
          animate={{ pathLength: 1 }}
          className="stroke-foreground/50"
          d="M56 131.826L168.347 36.4787"
          initial={{ pathLength: 0 }}
          strokeDasharray="4 6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.3}
          strokeWidth={2}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
    </div>
  );
};
