import { fireEvent, render, screen } from "@testing-library/react";
import { PageHero } from "../page-hero";

const slideA = {
  image: "https://example.com/slide-a.jpg",
  title: "Title A",
  subtitle: "Subtitle A",
  description: "Description A",
};

const slideB = {
  image: "https://example.com/slide-b.jpg",
  title: "Title B",
  subtitle: "Subtitle B",
  description: "Description B",
};

describe("PageHero", () => {
  it("renders fallback image when slides are empty", () => {
    render(
      <PageHero
        slides={[]}
        autoPlay={false}
        showDots={false}
        showCounter={false}
        fallbackImage="https://example.com/fallback.jpg"
      />
    );

    const heroImage = screen.getByRole("img", { name: "Hero image" });
    expect(heroImage).toHaveAttribute("src", "https://example.com/fallback.jpg");
  });

  it("keeps a visible active slide when slides shrink", () => {
    const { container, rerender } = render(
      <PageHero
        slides={[slideA, slideB]}
        autoPlay={false}
        showDots
        showCounter={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to slide 2" }));

    rerender(
      <PageHero
        slides={[slideA]}
        autoPlay={false}
        showDots
        showCounter={false}
      />
    );

    const slideLayers = container.querySelectorAll(".absolute.inset-0.transition-opacity.duration-1000");
    expect(slideLayers).toHaveLength(1);
    expect(slideLayers[0].className).toContain("opacity-100");
  });
});
