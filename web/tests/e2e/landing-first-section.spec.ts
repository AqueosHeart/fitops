import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing discovery works on desktop and mobile with accessible, reduced-motion presentation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Progress isa practice.");
  const heroImage = page.locator(".landing-hero-image img");
  await expect(heroImage).toBeVisible();
  await expect.poll(() => heroImage.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: "Join now", exact: true })).toHaveAttribute("href", "/join");
  await expect(page.getByRole("link", { name: "My Account", exact: true })).toHaveAttribute("href", "/portal/login");
  await page.getByRole("link", { name: "Explore activities" }).click();
  await expect(page).toHaveURL(/\/#programs$/);
  await expect(page.locator("#programs")).toBeInViewport();
  const violations = (await new AxeBuilder({ page }).include(".landing-header").include(".landing-hero").analyze()).violations;
  expect(violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".landing-mobile-menu summary").click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.getByRole("link", { name: "My Account" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Plans" })).toHaveAttribute("href", "/pricing");
  await page.locator(".landing-mobile-menu summary").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).include(".landing-header").include(".landing-hero").analyze()).violations).toEqual([]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator(".landing-hero-content").evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  await expect.poll(() => page.locator(".landing-hero-image").evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/?signedOut=1");
  await expect(page.getByRole("status").filter({ hasText: "You’ve signed out securely." })).toBeInViewport();
  expect(errors).toEqual([]);
});
