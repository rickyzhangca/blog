'use client';

import { useAtom } from 'jotai';
import { WrenchIcon } from 'lucide-react';
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
        <p className="border bg-white px-4 py-2 text-foreground/50">
          By{' '}
          <Link
            className="underline underline-offset-2"
            href="https://rickyzhang.me"
            target="_blank"
          >
            Ricky Zhang
          </Link>
        </p>
        {pathname === '/' && (
          <button
            className={cn(
              'cursor-pointer border p-2.5',
              isDevMode ? 'border-transparent bg-foreground' : 'bg-background'
            )}
            onClick={() => {
              setIsDevMode(!isDevMode);
            }}
            type="button"
          >
            <WrenchIcon
              absoluteStrokeWidth
              className={cn(
                isDevMode ? 'text-background' : 'text-foreground/50'
              )}
              size={20}
              strokeWidth={1.2}
            />
          </button>
        )}
      </div>
    </Divider>
  );
};
