import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const storybookURL = process.env.FITOPS_STORYBOOK_URL;

test("composed landing stories are accessible, responsive and interactive", async ({ page }) => {
  test.skip(!storybookURL, "Set FITOPS_STORYBOOK_URL to the loopback Storybook server.");
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`${storybookURL}/iframe.html?id=landing-complete-preview--full-page&viewMode=story`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Progress isa practice.");
  await expect(page.getByRole("heading", { name: "Find your space." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Move your way." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your rhythm." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Good coaching. A human connection." })).toBeVisible();
  for (const size of [{ width: 1440, height: 960 }, { width: 390, height: 844 }, { width: 320, height: 844 }, { width: 2552, height: 957 }]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const carousel of [
    { track: ".landing-facilities-track", next: "Next space", previous: "Previous space" },
    { track: ".landing-activities-viewport", next: "Next activity", previous: "Previous activity" },
    { track: ".landing-team-viewport", next: "Next coach", previous: "Previous coach" },
  ]) {
    const track = page.locator(carousel.track);
    await page.getByRole("button", { name: carousel.next, exact: true }).click();
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.getByRole("button", { name: carousel.previous, exact: true }).click();
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(2);
    await track.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  }
  await expect(page.getByRole("link", { name: "Choose Training Plus" })).toHaveAttribute("href", "/join?plan=training_plus");
  await expect(page.getByRole("link", { name: "Start now", exact: true })).toHaveAttribute("href", "/join");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const activities = page.locator(".landing-activities");
  await activities.scrollIntoViewIfNeeded();
  await activities.getByRole("button", { name: "Pause motion", exact: true }).click();
  await expect(activities.getByRole("button", { name: "Play motion", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.locator(".landing-activities-marquee").evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
  for (const motion of [
    { section: ".landing-principles", pause: "Pause principles motion", track: ".landing-principles-track" },
    { section: ".landing-team", pause: "Pause marquee", track: ".landing-team-marquee" },
    { section: ".landing-closing", pause: "Pause marquee", track: ".landing-closing-marquee-track" },
  ]) {
    const section = page.locator(motion.section);
    await section.scrollIntoViewIfNeeded();
    const pause = section.getByRole("button", { name: motion.pause, exact: true });
    await pause.click();
    await expect(section.getByRole("button", { pressed: true })).toBeVisible();
    await expect.poll(() => page.locator(motion.track).evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
  }
  expect(errors).toEqual([]);
});
