"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  href?: string;
}

export function BackButton({ className, href = "/" }: BackButtonProps) {
  return (
    <Link
      className={cn(
        "flex items-center justify-center border bg-white px-4 py-3 text-foreground",
        className
      )}
      href={href}
    >
      Back
    </Link>
  );
}
