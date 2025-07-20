'use client';

import { useAtom } from 'jotai';
import { ArrowUpRightIcon, WrenchIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { isDevModeAtom } from './atoms';
import { Divider } from './divider';

export const Footer = () => {
  const [isDevMode, setIsDevMode] = useAtom(isDevModeAtom);
  const pathname = usePathname();
  return (
    <Divider className="h-42">
      <div className="flex items-center justify-between gap-2">
        {pathname === '/' && (
          <button
            className={cn(
              'cursor-pointer border p-2.5 transition',
              isDevMode
                ? 'border-transparent bg-foreground text-background'
                : 'bg-background text-foreground/40 hover:border-foreground/30 hover:text-foreground/60'
            )}
            onClick={() => {
              setIsDevMode(!isDevMode);
            }}
            type="button"
          >
            <WrenchIcon absoluteStrokeWidth size={16} strokeWidth={1.2} />
          </button>
        )}
        <Link
          className="flex cursor-pointer items-center gap-2 border bg-white py-2 pr-3 pl-4 text-foreground/50 text-sm transition hover:border-foreground/30 hover:text-foreground/70"
          href="https://rickyzhang.me"
          target="_blank"
        >
          By Ricky Zhang
          <ArrowUpRightIcon size={16} strokeWidth={1.2} />
        </Link>
      </div>
    </Divider>
  );
};
