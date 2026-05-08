import { expect, test } from "@playwright/test";

test.describe("WhyChoosingUs demo page", () => {
  test("rotates cards, pauses on hover, and triggers the CTA callback", async ({
    page,
  }) => {
    await page.goto("/why-choosing-us-demo");

    const liveRegion = page.getByTestId("why-choosing-us-live-region");
    const carousel = page.getByTestId("why-choosing-us-carousel");
    const status = page.getByTestId("cta-status");

    await expect(liveRegion).toContainText("Showing testimonial 1 of 3");

    await page.waitForTimeout(5000);
    await expect(liveRegion).toContainText("Showing testimonial 2 of 3");

    await carousel.hover();
    const pausedState = await liveRegion.textContent();
    await page.waitForTimeout(5000);
    await expect(liveRegion).toHaveText(pausedState ?? "");

    await page
      .getByRole("button", { name: "Start your learning journey" })
      .click();
    await expect(status).toHaveText("CTA clicked from the demo page.");
  });
});
