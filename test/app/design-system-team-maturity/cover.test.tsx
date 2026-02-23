import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cover as ArticleCover } from "@/app/components/cover";
import { S_STROKES } from "@/app/design-system-team-maturity/paths";

describe("design system team maturity cover", () => {
  it("uses a single stroke path for the S letter", () => {
    expect(S_STROKES).toHaveLength(1);
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
