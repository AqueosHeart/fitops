import { expect, test, type Page } from "@playwright/test";

type LabMetrics = {
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  domContentLoaded: number;
  loadEvent: number;
};

type InstrumentedWindow = Window & { __fitopsLabMetrics?: { lcp: number; cls: number } };

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const sampleCount = 3;
const budgets = { largestContentfulPaintMs: 2500, cumulativeLayoutShift: 0.1 };

function percentile75(values: number[]) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.ceil(sorted.length * 0.75) - 1];
}

async function measureLandingPage(page: Page): Promise<LabMetrics> {
  await page.addInitScript(() => {
    const windowWithMetrics = window as InstrumentedWindow;
    windowWithMetrics.__fitopsLabMetrics = { lcp: 0, cls: 0 };

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          windowWithMetrics.__fitopsLabMetrics!.lcp = entry.startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });

      let sessionStart = 0;
      let previousShift = 0;
      let sessionValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
          if (shift.hadRecentInput || shift.value === undefined) continue;

          if (sessionValue > 0 && shift.startTime - previousShift < 1000 && shift.startTime - sessionStart < 5000) {
            sessionValue += shift.value;
          } else {
            sessionStart = shift.startTime;
            sessionValue = shift.value;
          }
          previousShift = shift.startTime;
          windowWithMetrics.__fitopsLabMetrics!.cls = Math.max(windowWithMetrics.__fitopsLabMetrics!.cls, sessionValue);
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {
      // Missing browser performance entry support is reported as a zero-value failure below.
    }
  });

  const response = await page.goto("/", { waitUntil: "load" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Strength Foundations" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "View session" }).first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => true));

  return page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const metrics = (window as InstrumentedWindow).__fitopsLabMetrics;
    return {
      largestContentfulPaint: metrics?.lcp ?? 0,
      cumulativeLayoutShift: metrics?.cls ?? 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
      loadEvent: navigation?.loadEventEnd ?? 0,
    };
  });
}

test("public landing page meets desktop and mobile lab performance budgets", async ({ browser }) => {
  test.skip(!process.env.CI, "Performance budgets run against the isolated CI database and built production server.");

  const results = [] as Array<{ viewport: string; samples: LabMetrics[]; p75: LabMetrics }>;

  for (const viewport of viewports) {
    const samples: LabMetrics[] = [];
    for (let sample = 0; sample < sampleCount; sample += 1) {
      const page = await browser.newPage({ viewport });
      samples.push(await measureLandingPage(page));
      await page.close();
    }

    const p75 = {
      largestContentfulPaint: percentile75(samples.map(({ largestContentfulPaint }) => largestContentfulPaint)),
      cumulativeLayoutShift: percentile75(samples.map(({ cumulativeLayoutShift }) => cumulativeLayoutShift)),
      domContentLoaded: percentile75(samples.map(({ domContentLoaded }) => domContentLoaded)),
      loadEvent: percentile75(samples.map(({ loadEvent }) => loadEvent)),
    };
    results.push({ viewport: viewport.name, samples, p75 });
    await test.info().attach(`landing-page-lab-performance-${viewport.name}.json`, {
      body: Buffer.from(JSON.stringify({ viewport, sampleCount, budgets, samples, p75 }, null, 2)),
      contentType: "application/json",
    });

    expect(p75.largestContentfulPaint, `${viewport.name} LCP p75: ${JSON.stringify(samples)}`).toBeGreaterThan(0);
    expect(p75.largestContentfulPaint, `${viewport.name} LCP p75: ${JSON.stringify(samples)}`).toBeLessThanOrEqual(budgets.largestContentfulPaintMs);
    expect(p75.cumulativeLayoutShift, `${viewport.name} CLS p75: ${JSON.stringify(samples)}`).toBeLessThanOrEqual(budgets.cumulativeLayoutShift);
  }

  await test.info().attach("landing-page-lab-performance.json", {
    body: Buffer.from(JSON.stringify({ environment: "GitHub-hosted headless Chromium, production build, loopback HTTP", sampleCountPerViewport: sampleCount, budgets, results }, null, 2)),
    contentType: "application/json",
  });
});
