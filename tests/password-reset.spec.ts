import { expect, test } from "@playwright/test";

test("reset links keep their token out of page requests and navigation", async ({ page }) => {
  const token = "test-recovery-token-that-is-not-a-real-credential";
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const response = await page.goto(`/admin/reset-password#token_hash=${token}`);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("button", { name: "Set new password" })).toBeEnabled();
  await expect(page).toHaveURL(/\/admin\/reset-password$/);
  await expect(page.locator('input[name="tokenHash"]')).toHaveValue(token);
  expect(requests.some((url) => url.includes(token))).toBe(false);
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  // A validation error must not discard or consume the single-use token.
  await page.getByLabel("New password", { exact: true }).fill("Private-example-passphrase-1");
  await page.getByLabel("Confirm new password", { exact: true }).fill("Different-example-passphrase-2");
  await page.getByRole("button", { name: "Set new password" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(/match/i);
  await expect(page.locator('input[name="tokenHash"]')).toHaveValue(token);
});

test("anonymous visitors cannot change a password without a recovery link", async ({ page }) => {
  await page.goto("/admin/reset-password");
  await page.getByLabel("New password", { exact: true }).fill("Private-example-passphrase-1");
  await page.getByLabel("Confirm new password", { exact: true }).fill("Private-example-passphrase-1");
  await page.getByRole("button", { name: "Set new password" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(/link|expired|invalid/i);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});
