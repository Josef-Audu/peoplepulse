import { expect, test } from "@playwright/test";

/** Signed-out surface: landing, auth guard, public pulse route, PWA assets. */

test("landing renders approved hero with no placeholder copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Turn assumptions into evidence." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open dashboard" })).toBeVisible();
  await expect(page.getByText("WORKING PROTOTYPE")).toHaveCount(0);
  await expect(page.getByText("App shell")).toHaveCount(0);
});

test("signed-out dashboard redirects to Clerk sign-in", async ({ page }) => {
  const resp = await page.goto("/dashboard");
  expect(resp?.status()).toBe(200); // followed redirect renders sign-in
  expect(page.url()).toContain("/sign-in");
  await expect(page.getByText("Welcome back", { exact: false }).first()).toBeVisible();
});

test("signed-out profile redirects to sign-in (no contradictory state)", async ({ page }) => {
  await page.goto("/profile");
  expect(page.url()).toContain("/sign-in");
  await expect(page.getByText("No accounts exist in this shell")).toHaveCount(0);
});

test("unknown public pulse is a clean 404, not a 500", async ({ page }) => {
  const resp = await page.goto("/p/does-not-exist-123");
  expect(resp?.status()).toBe(404);
});

test("PWA manifest is exact", async ({ request }) => {
  const resp = await request.get("/manifest.webmanifest");
  expect(resp.status()).toBe(200);
  const m = await resp.json();
  expect(m.name).toBe("PeoplePulse");
  expect(m.short_name).toBe("PeoplePulse");
  expect(m.display).toBe("standalone");
  expect(m.start_url).toBe("/");
});

test("PWA icons and service worker serve", async ({ request }) => {
  for (const p of ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/maskable-512.png", "/icons/apple-touch-icon.png", "/sw.js"]) {
    const resp = await request.get(p);
    expect(resp.status(), p).toBe(200);
  }
  const sw = await (await request.get("/sw.js")).text();
  expect(sw).toContain("peoplepulse-v1");
});

test("legal pages render finished copy", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Your data, with boundaries." })).toBeVisible();
  await expect(page.getByText("draft legal document")).toHaveCount(0);
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Honest research, honestly run." })).toBeVisible();
});
