import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

const password = process.env.FITOPS_DEMO_PASSWORD;
const seededSessionId = "00000000-0000-4000-8000-000000000301";

async function signIn(page: Page, email: string, destination: string) {
  await page.goto(`/portal/login?returnTo=${encodeURIComponent(destination)}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password ?? "");
  await page.getByRole("button", { name: "Sign in to My Account" }).click();
  await expect(page).toHaveURL((url) => `${url.pathname}${url.search}` === destination);
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations.map(({ id, impact, help, nodes }) => ({ id, impact, help, targets: nodes.map((node) => node.target) })))).toEqual([]);
}

function captureRuntimeErrors(page: Page, errors: string[]) {
  page.on("pageerror", (error) => errors.push(error.message));
}

test("member booking/waitlist/cancel-promotion and administrator authorization journey", async ({ browser }) => {
  test.skip(!password && !process.env.CI, "Set FITOPS_DEMO_PASSWORD after seeding the disposable E2E database.");
  expect(password, "CI must supply the same ephemeral password used by the fictional seed.").toBeTruthy();

  const memberContext = await browser.newContext();
  const member = await memberContext.newPage();
  const runtimeErrors: string[] = [];
  captureRuntimeErrors(member, runtimeErrors);

  await member.goto("/");
  await expect(member.getByRole("heading", { level: 1 })).toBeVisible();
  await expectAccessible(member);
  await member.goto("/join?plan=complete");
  await member.getByRole("link", { name: /Create demo account/ }).click();
  await expect(member).toHaveURL(/\/register\?plan=complete/);
  await member.getByLabel("Name").fill("Quality Test Member");
  await member.getByLabel("Email").fill(`quality-${randomUUID()}@example.test`);
  await member.getByLabel("Password").fill(password!);
  await member.getByRole("checkbox").check();
  await member.getByRole("button", { name: "Create member account" }).click();
  await expect(member).toHaveURL(/\/app$/);

  await member.goto(`/app/schedule?sessionId=${seededSessionId}`);
  await member.getByRole("button", { name: "Join waitlist" }).click();
  await expect(member.getByRole("status")).toContainText("waitlist at position 3");
  await member.goto("/app/bookings");
  await expect(member.getByRole("heading", { name: "Waitlist entries" })).toBeVisible();
  await expect(member.getByText("Position 3")).toBeVisible();
  await expectAccessible(member);

  const adminContext = await browser.newContext();
  const admin = await adminContext.newPage();
  captureRuntimeErrors(admin, runtimeErrors);
  await signIn(admin, "admin@example.test", "/admin/sessions");
  await expect(admin.getByRole("heading", { name: "Session manager" })).toBeVisible();
  const seededSessionRow = admin.locator(`tr:has(a[href="/admin/sessions/${seededSessionId}/edit"])`);
  await expect(seededSessionRow).toContainText("Strength Foundations");
  await seededSessionRow.getByRole("link", { name: "Edit" }).click();
  await expect(admin.getByRole("heading", { name: "Edit session" })).toBeVisible();
  await admin.getByLabel("Capacity").fill("4");
  await admin.getByRole("button", { name: "Save changes" }).click();
  await expect(admin).toHaveURL(/\/admin\/sessions$/);
  await expect(seededSessionRow).toContainText("4 / 4");
  await admin.goto(`/admin/sessions/${seededSessionId}/participants`);
  await expect(admin.getByRole("heading", { name: "Participants and waitlist" })).toBeVisible();
  const rosters = admin.locator(".admin-roster-grid > .admin-panel");
  await expect(rosters.nth(0)).toContainText("Casey Morgan");
  await expect(rosters.nth(0)).toContainText("Taylor Chen");
  await expect(rosters.nth(1)).toContainText("Quality Test Member");
  await expectAccessible(admin);

  const otherMemberContext = await browser.newContext();
  const otherMember = await otherMemberContext.newPage();
  captureRuntimeErrors(otherMember, runtimeErrors);
  await signIn(otherMember, "alex.rivera@example.test", "/app/bookings");
  const seededBooking = otherMember.locator("article.booking-row").filter({ has: otherMember.locator(`a[href="/sessions/${seededSessionId}"]`) });
  await expect(seededBooking.getByRole("button", { name: "Cancel booking" })).toBeEnabled();
  await seededBooking.getByRole("button", { name: "Cancel booking" }).click();
  await otherMember.getByRole("button", { name: "Confirm cancellation" }).click();
  await expect(otherMember.getByRole("status")).toContainText("reservation was cancelled");

  await member.reload();
  const promotedBooking = member.locator("article.booking-row").filter({ has: member.locator(`a[href="/sessions/${seededSessionId}"]`) });
  await expect(promotedBooking).toContainText("Confirmed");
  await expect(member.getByText(/No active waitlist entries\./)).toBeVisible();

  await member.goto("/admin");
  await expect(member.getByText("Administrator access is required for this workspace.")).toBeVisible();
  const trainerContext = await browser.newContext();
  const trainer = await trainerContext.newPage();
  captureRuntimeErrors(trainer, runtimeErrors);
  await signIn(trainer, "maya.coach@example.test", "/trainer/sessions");
  await trainer.goto("/admin");
  await expect(trainer.getByText("Administrator access is required for this workspace.")).toBeVisible();
  expect(runtimeErrors).toEqual([]);

  await Promise.all([memberContext.close(), adminContext.close(), otherMemberContext.close(), trainerContext.close()]);
});
