import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing discovery works on desktop and mobile with accessible, reduced-motion presentation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Progress isa practice.");
  await expect(page.getByText("NEIGHBORHOOD TRAINING", { exact: false })).toHaveCount(0);
  expect(await page.locator(".landing-hero").evaluate((element) => element.getBoundingClientRect().height)).toBe(960);
  const heroImage = page.locator(".landing-hero-image img");
  await expect(heroImage).toBeVisible();
  await expect.poll(() => heroImage.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: "Join now", exact: true })).toHaveAttribute("href", "/join");
  await expect(page.getByRole("link", { name: "My Account", exact: true })).toHaveAttribute("href", "/portal/login");
  await page.getByRole("link", { name: "Explore activities" }).click();
  await expect(page).toHaveURL(/\/#programs$/);
  await expect(page.locator("#programs")).toBeInViewport();
  await expect.poll(() => page.locator(".landing-hero-word").last().evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  const violations = (await new AxeBuilder({ page }).include(".landing-header").include(".landing-hero").analyze()).violations;
  expect(violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(await page.locator(".landing-hero").evaluate((element) => element.getBoundingClientRect().height)).toBe(844);
  await page.locator(".landing-mobile-menu summary").click();
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.getByRole("link", { name: "My Account" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Plans" })).toHaveAttribute("href", "/pricing");
  await page.locator(".landing-mobile-menu summary").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect.poll(() => page.locator(".landing-hero-word").last().evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
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

test("hero focus reveal staggers words, replays on refresh and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const words = page.locator(".landing-hero-word");
  await expect(words).toHaveText(["Progress", "is", "a", "practice."]);
  for (let load = 0; load < 2; load++) {
    if (load) await page.reload();
    const frame = await words.evaluateAll((elements) => elements.map((element) => {
      const animation = element.getAnimations()[0];
      animation.pause();
      animation.currentTime = 450;
      const style = getComputedStyle(element);
      return { opacity: Number(style.opacity), blur: Number(style.filter.match(/[\d.]+/)?.[0]), name: style.animationName };
    }));
    expect(frame.every((word) => word.name === "landing-focus-in")).toBe(true);
    expect(frame[0].opacity).toBeGreaterThan(frame[3].opacity);
    expect(frame[0].blur).toBeLessThan(frame[3].blur);
    await words.evaluateAll((elements) => elements.forEach((element) => { element.getAnimations()[0].finish(); }));
    await expect.poll(() => words.first().evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await words.evaluateAll((elements) => elements.every((element) => {
    const style = getComputedStyle(element);
    return style.animationName === "none" && style.filter === "none" && style.opacity === "1";
  }))).toBe(true);
});
