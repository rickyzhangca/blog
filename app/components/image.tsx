'use client';

import { motion } from 'framer-motion';
import type { ImageProps as NextImageProps } from 'next/image';
import NextImage from 'next/image';
import { useRef } from 'react';
import { useCanDrag } from '@/lib/use-can-drag';
import { cn } from '@/lib/utils';
import { Divider } from '../divider';

type ImageProps = Omit<
  NextImageProps,
  | 'layout'
  | 'onDrag'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onDragEnd'
  | 'onDragStart'
>;

export const Image = ({ className, ...imgProps }: ImageProps) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const MotionNextImage = motion.create(NextImage);

  const canDrag = useCanDrag();

  return (
    <motion.div className="relative " ref={constraintsRef}>
      <MotionNextImage
        className={cn(
          'overflow-hidden rounded-lg transition-shadow duration-500 active:shadow-xl',
          className
        )}
        draggable={false}
        {...(canDrag && {
          drag: true,
          dragConstraints: constraintsRef,
          dragElastic: 0.15,
        })}
        {...imgProps}
      />
      <Divider className="-z-10 absolute inset-0 h-full w-full rounded-lg border" />
    </motion.div>
  );
};
