import { WrenchIcon } from 'lucide-react';
import Link from 'next/link';
import { Divider } from './divider';

export const Footer = () => {
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
        <button className="cursor-pointer border bg-white p-2.5" type="button">
          <WrenchIcon
            absoluteStrokeWidth
            className="text-foreground/50"
            size={20}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </Divider>
  );
};
