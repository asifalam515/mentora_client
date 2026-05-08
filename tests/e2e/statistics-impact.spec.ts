import { expect, test } from "@playwright/test";

const analyticsResponse = {
  analytics: {
    activeTutors: 1200,
    sessionsBooked: 56780,
    avgRating: 4.9,
    totalReviews: 8420,
  },
};

test.describe("StatisticsImpact demo", () => {
  test("renders analytics metrics from the API", async ({ page }) => {
    await page.route("**/api/v1/analytics", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(analyticsResponse),
      }),
    );

    await page.goto("/statistics-impact-demo");

    await expect(
      page.getByRole("heading", { name: "Our impact, in numbers" }),
    ).toBeVisible();
    await expect(page.getByText("1,200+")).toBeVisible();
    await expect(page.getByText("56,780+")).toBeVisible();
    await expect(page.getByText("4.9")).toBeVisible();
    await expect(page.getByText("8,420+")).toBeVisible();
  });

  test("shows the empty state when analytics are zeroed out", async ({
    page,
  }) => {
    await page.route("**/api/v1/analytics", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          analytics: {
            activeTutors: 0,
            sessionsBooked: 0,
            avgRating: 0,
            totalReviews: 0,
          },
        }),
      }),
    );

    await page.goto("/statistics-impact-demo");

    await expect(page.getByText("Data coming soon")).toBeVisible();
    await expect(page.getByText("Open admin dashboard")).toBeVisible();
  });

  test("shows the error state when analytics fail", async ({ page }) => {
    await page.route("**/api/v1/analytics", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unavailable" }),
      }),
    );

    await page.goto("/statistics-impact-demo");

    await expect(
      page.getByText("Live analytics are unavailable"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });
});
