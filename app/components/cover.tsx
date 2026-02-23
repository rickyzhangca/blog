"use client";

import { useAtom } from "jotai";
import { RotateCcwIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isDevModeAtom } from "../atoms";
import { Cover as DesignSystemTeamMaturityCover } from "../design-system-team-maturity/cover";
import { Cover as EphemeralDesignCover } from "../ephemeral-design/cover";
import { Cover as VerificationAsymmetryCover } from "../verification-asymmetry/cover";

const covers: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement> & { className?: string }>
> = {
  "design-system-team-maturity": DesignSystemTeamMaturityCover,
  "ephemeral-design": EphemeralDesignCover,
  "verification-asymmetry": VerificationAsymmetryCover,
};

interface CoverProps {
  id: string;
}

export const Cover = ({ id }: CoverProps) => {
  const SvgComponent = covers[id];
  const [countPlayed, setCountPlayed] = useState(0);
  const [playId, setPlayId] = useState(`${id}-cover-animation-${countPlayed}`);
  const [isDevMode] = useAtom(isDevModeAtom);

  return (
    <div className="group/cover relative aspect-3/2 w-full xs:w-40 outline outline-border lg:w-60">
      <button
        className={cn(
          "absolute top-0 right-0 z-10 cursor-pointer bg-white p-2 outline outline-border transition",
          !isDevMode && "opacity-0 group-hover/cover:opacity-100"
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
          className={cn(
            "absolute inset-0 h-full w-full",
            id === "verification-asymmetry" && "translate-y-1"
          )}
          key={playId}
        />
      )}
    </div>
  );
};
