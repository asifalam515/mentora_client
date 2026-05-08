import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import WhyChoosingUs from "@/components/home/WhyChoosingUs";
import type { Metric, Testimonial } from "@/types/why-choosing-us";

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Aisha R.",
    role: "University Student",
    avatarUrl: null,
    rating: 5,
    quote:
      "Mentora matched me with a tutor who understood my goals immediately. My grades improved and lessons are genuinely engaging.",
    verified: true,
  },
  {
    id: "2",
    name: "Daniel S.",
    role: "Working Professional",
    avatarUrl: null,
    rating: 5,
    quote:
      "Found the right tutor within 24 hours and booked sessions around my schedule. Efficient, professional, and results-driven.",
    verified: true,
  },
  {
    id: "3",
    name: "Priya K.",
    role: "Parent",
    avatarUrl: null,
    rating: 5,
    quote:
      "Flexible scheduling and clear lesson plans made learning stress-free for my child. The progress tracking is a lifesaver.",
    verified: true,
  },
];

const metrics: Metric[] = [
  {
    id: "verified-tutors",
    label: "Verified Tutors",
    value: "1,200+",
    icon: "user-check",
  },
  { id: "matches", label: "Successful Matches", value: "98%", icon: "heart" },
  { id: "rating", label: "Avg. Rating", value: "4.8/5", icon: "star" },
];

const analyticsResponse = {
  analytics: {
    activeTutors: 1200,
    sessionsBooked: 56780,
    avgRating: 4.9,
    totalReviews: 8420,
  },
};

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(JSON.stringify(analyticsResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }) as Response,
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("WhyChoosingUs", () => {
  it("renders provided props and placeholder strings", async () => {
    render(
      <WhyChoosingUs
        testimonials={testimonials}
        metrics={metrics}
        variant="compact"
        autoRotate={false}
        strings={{
          eyebrow: "Social proof",
          heading: "Why students choose us",
          intro: "Curated testimonials and live metrics.",
          ctaLabel: "Get matched now",
          ctaDescription: "Fast, reliable tutoring matches.",
          testimonialsLabel: "Testimonials",
          metricsLabel: "Metrics",
          previousLabel: "Previous",
          nextLabel: "Next",
          pauseLabel: "Pause",
          playLabel: "Play",
          readMoreLabel: "Read more",
          showLessLabel: "Show less",
          verifiedLabel: "Verified",
          placeholderTitle: "No data",
          placeholderBody: "No testimonials available.",
          liveRegionLabel: (current, total) =>
            `Testimonial ${current} of ${total}`,
        }}
      />,
    );

    await screen.findByTestId("statistics-impact-grid");

    expect(
      screen.getByRole("heading", { name: "Why students choose us" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Curated testimonials and live metrics."),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("testimonial-card")).toHaveLength(3);
    expect(screen.getByText("1,200+")).toBeInTheDocument();
    expect(screen.getAllByTestId("why-choosing-us-cta")).toHaveLength(2);
    expect(screen.getAllByLabelText("5 out of 5 stars")).toHaveLength(3);
  });

  it("supports keyboard navigation in the carousel", async () => {
    const user = userEvent.setup();

    render(
      <WhyChoosingUs
        testimonials={testimonials}
        metrics={metrics}
        autoRotate={false}
        strings={{
          eyebrow: "Social proof",
          heading: "Why students choose us",
          intro: "Curated testimonials and live metrics.",
          ctaLabel: "Get matched now",
          ctaDescription: "Fast, reliable tutoring matches.",
          testimonialsLabel: "Testimonials",
          metricsLabel: "Metrics",
          previousLabel: "Previous",
          nextLabel: "Next",
          pauseLabel: "Pause",
          playLabel: "Play",
          readMoreLabel: "Read more",
          showLessLabel: "Show less",
          verifiedLabel: "Verified",
          placeholderTitle: "No data",
          placeholderBody: "No testimonials available.",
          liveRegionLabel: (current, total) =>
            `Testimonial ${current} of ${total}`,
        }}
      />,
    );

    await screen.findByTestId("statistics-impact-grid");

    const carousel = screen.getByTestId("why-choosing-us-carousel");
    await user.click(carousel);
    await user.keyboard("{ArrowRight}");

    expect(screen.getByTestId("why-choosing-us-live-region")).toHaveTextContent(
      "Testimonial 2 of 3",
    );

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByTestId("why-choosing-us-live-region")).toHaveTextContent(
      "Testimonial 1 of 3",
    );
  });

  it("invokes the CTA callback", async () => {
    const user = userEvent.setup();
    const onCtaClick = vi.fn();

    render(
      <WhyChoosingUs
        testimonials={testimonials}
        metrics={metrics}
        autoRotate={false}
        onCtaClick={onCtaClick}
        strings={{
          eyebrow: "Social proof",
          heading: "Why students choose us",
          intro: "Curated testimonials and live metrics.",
          ctaLabel: "Get matched now",
          ctaDescription: "Fast, reliable tutoring matches.",
          testimonialsLabel: "Testimonials",
          metricsLabel: "Metrics",
          previousLabel: "Previous",
          nextLabel: "Next",
          pauseLabel: "Pause",
          playLabel: "Play",
          readMoreLabel: "Read more",
          showLessLabel: "Show less",
          verifiedLabel: "Verified",
          placeholderTitle: "No data",
          placeholderBody: "No testimonials available.",
          liveRegionLabel: (current, total) =>
            `Testimonial ${current} of ${total}`,
        }}
      />,
    );

    await screen.findByTestId("statistics-impact-grid");

    await user.click(screen.getAllByTestId("why-choosing-us-cta")[0]);
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("renders a placeholder when no testimonials are available", async () => {
    render(
      <WhyChoosingUs
        testimonials={[]}
        metrics={metrics}
        autoRotate={false}
        strings={{
          eyebrow: "Social proof",
          heading: "Why students choose us",
          intro: "Curated testimonials and live metrics.",
          ctaLabel: "Get matched now",
          ctaDescription: "Fast, reliable tutoring matches.",
          testimonialsLabel: "Testimonials",
          metricsLabel: "Metrics",
          previousLabel: "Previous",
          nextLabel: "Next",
          pauseLabel: "Pause",
          playLabel: "Play",
          readMoreLabel: "Read more",
          showLessLabel: "Show less",
          verifiedLabel: "Verified",
          placeholderTitle: "No data",
          placeholderBody: "No testimonials available.",
          liveRegionLabel: (current, total) =>
            `Testimonial ${current} of ${total}`,
        }}
      />,
    );

    await screen.findByTestId("statistics-impact-grid");

    expect(
      screen.getByRole("heading", { name: "No data" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No testimonials available.")).toBeInTheDocument();
    expect(screen.getByTestId("why-choosing-us-live-region")).toHaveTextContent(
      "No data",
    );
  });
});
