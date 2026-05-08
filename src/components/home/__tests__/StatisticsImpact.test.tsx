import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import StatisticsImpact from "@/components/home/StatisticsImpact";

const analyticsResponse = {
  analytics: {
    activeTutors: 1200,
    sessionsBooked: 56780,
    avgRating: 4.9,
    totalReviews: 8420,
  },
};

const fallbackResponse = {
  activeTutors: 900,
  sessionsBooked: 42000,
  avgRating: 4.8,
  totalReviews: 3100,
};

const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("reduce") ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

beforeEach(() => {
  mockMatchMedia(false);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (callback: FrameRequestCallback) => {
      callback(window.performance.now() + 1000);
      return 0;
    },
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("StatisticsImpact", () => {
  it("shows loading state while analytics are in flight", async () => {
    let resolveFetch: ((response: Response) => void) | undefined;

    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(<StatisticsImpact />);

    expect(screen.getByTestId("statistics-impact-loading")).toBeInTheDocument();

    resolveFetch?.(
      new Response(JSON.stringify(analyticsResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("statistics-impact-grid")).toBeInTheDocument();
    });
  });

  it("renders analytics values when the API succeeds", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(analyticsResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }) as Response,
    );

    render(<StatisticsImpact />);

    expect(
      await screen.findByTestId("statistics-impact-grid"),
    ).toBeInTheDocument();
    expect(screen.getByText("1,200+")).toBeInTheDocument();
    expect(screen.getByText("56,780+")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("8,420+")).toBeInTheDocument();
  });

  it("shows the empty analytics state when the backend returns zero data", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          analytics: {
            activeTutors: 0,
            sessionsBooked: 0,
            avgRating: 0,
            totalReviews: 0,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ) as Response,
    );

    render(<StatisticsImpact />);

    expect(await screen.findByText("Data coming soon")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Analytics will appear once the backend has been seeded with real platform activity.",
      ),
    ).toBeInTheDocument();
  });

  it("falls back to local analytics when the API fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));

    render(<StatisticsImpact fallback={fallbackResponse} />);

    expect(
      await screen.findByTestId("statistics-impact-grid"),
    ).toBeInTheDocument();
    expect(screen.getByText("900")).toBeInTheDocument();
    expect(screen.getByText("42,000+")).toBeInTheDocument();
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("3,100+")).toBeInTheDocument();
  });

  it("disables animation for reduced-motion users", async () => {
    mockMatchMedia(true);
    const animationFrameSpy = vi.spyOn(window, "requestAnimationFrame");

    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify(analyticsResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }) as Response,
    );

    render(<StatisticsImpact />);

    expect(await screen.findByText("1,200+")).toBeInTheDocument();
    expect(animationFrameSpy).not.toHaveBeenCalled();
  });
});
