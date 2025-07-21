import { cn } from '@/lib/utils';

export const Divider = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex h-16 flex-col items-center justify-center border-y bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/8 dark:[--pattern-fg:var(--color-white)]/8',
        className
      )}
      {...props}
    />
  );
};
