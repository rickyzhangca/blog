import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cover as ArticleCover } from "@/app/components/cover";
import { D_STROKES, S_STROKES } from "@/app/design-system-team-maturity/paths";

const NUMBER_REGEX = /-?\d*\.?\d+/g;

const getNumbers = (d: string): number[] => {
  const values = d.match(NUMBER_REGEX);

  if (!values) {
    throw new Error(`Path data has no numeric values: ${d}`);
  }

  return values.map(Number);
};

const getStartY = (d: string): number => {
  const values = getNumbers(d);

  return values[1];
};

const getEndY = (d: string): number => {
  const values = getNumbers(d);

  const endY = values.at(-1);

  if (endY === undefined) {
    throw new Error(`Path data is missing a final Y value: ${d}`);
  }

  return endY;
};

describe("design system team maturity cover", () => {
  it("uses a single stroke path for the S letter", () => {
    expect(S_STROKES).toHaveLength(1);
  });

  it("draws D and S strokes from top to bottom", () => {
    const strokes = [...D_STROKES, ...S_STROKES];

    for (const stroke of strokes) {
      const startY = getStartY(stroke.d);
      const endY = getEndY(stroke.d);

      expect(startY).toBeLessThan(endY);
    }

    expect(getStartY(S_STROKES[0].d)).toBeLessThan(70);
  });

  it("renders the DS cover through shared cover mapping", () => {
    const { container } = render(
      <ArticleCover id="design-system-team-maturity" />
    );

    expect(container.querySelector("title")?.textContent).toBe(
      "Design System Team Maturity cover"
    );
  });

  it("keeps the replay control available", () => {
    render(<ArticleCover id="design-system-team-maturity" />);

    const replayButton = screen.getByRole("button");
    fireEvent.click(replayButton);

    expect(replayButton).toBeInTheDocument();
  });
});
