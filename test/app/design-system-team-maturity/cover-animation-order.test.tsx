import { render } from "@testing-library/react";
import type { SVGProps } from "react";
import { describe, expect, it, vi } from "vitest";

interface MotionPathLikeProps extends SVGProps<SVGPathElement> {
  animate?: unknown;
  initial?: unknown;
  transition?: {
    delay?: number;
  };
}

vi.mock("framer-motion", () => ({
  motion: {
    path: ({
      animate: _animate,
      initial: _initial,
      transition,
      ...rest
    }: MotionPathLikeProps) => (
      <path
        {...rest}
        data-delay={
          typeof transition?.delay === "number" ? transition.delay : 0
        }
      />
    ),
  },
  useReducedMotion: () => false,
}));

import { Cover } from "@/app/design-system-team-maturity/cover";

describe("design system team maturity cover animation order", () => {
  it("starts D stem first, then D bowl, then S", () => {
    const { container } = render(<Cover />);
    const delays = Array.from(container.querySelectorAll("path"), (path) =>
      Number(path.getAttribute("data-delay") ?? 0)
    );

    expect(delays).toHaveLength(3);
    expect(delays[1]).toBeGreaterThan(delays[0] + 0.3);
    expect(delays[2]).toBeGreaterThan(delays[1] + 0.3);
  });
});
