import { expect, test } from "@playwright/test";

test("appearance follows the device and remembers explicit choices across pages and reloads", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-theme", "dark");
  const trigger = page.getByRole("button", { name: "Choose color theme" });
  await trigger.click();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await expect(root).toHaveAttribute("data-theme", "light");
  await expect(trigger).toBeFocused();
  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "light");
  await page.goto("/partners");
  await expect(root).toHaveAttribute("data-theme", "light");
  await trigger.click();
  await page.getByRole("button", { name: "System", exact: true }).click();
  await expect(root).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(root).toHaveAttribute("data-theme", "light");
});

test("the appearance control works alongside mobile navigation and closes with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const trigger = page.getByRole("button", { name: "Choose color theme" });
  await trigger.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(page.getByRole("group", { name: "Color theme" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("group", { name: "Color theme" })).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("all main pages have a heading, working internal destinations, and fit the viewport", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/programs",
    "/projects",
    "/about",
    "/partners",
    "/join",
  ]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `${path} should fit the viewport`).toBe(false);
    await expect(page.locator('img[alt="Umojaverse"]').first()).toBeVisible();
  }
});

test("the mobile menu supports Escape and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const openMenu = page.getByRole("button", { name: "Open navigation" });
  await openMenu.click();
  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(navigation).toBeHidden();
  await expect(openMenu).toBeFocused();
  await openMenu.click();
  await navigation.getByRole("link", { name: /Programs/ }).click();
  await expect(page).toHaveURL(/\/programs$/);
  await expect(navigation).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
});

test("program filters show matching programs and an honest upcoming state", async ({
  page,
}) => {
  await page.goto("/programs");
  await expect(page.locator(".program-row")).toHaveCount(3);
  await page.getByRole("button", { name: "Bootcamps", exact: true }).click();
  await expect(page.locator(".program-row")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Arbitrum Pulse Bootcamp" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Upcoming", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "The next chapter is on its way." }),
  ).toBeVisible();
  await expect(page.locator(".program-row")).toHaveCount(0);
  await page.getByRole("button", { name: "Explore past programs" }).click();
  await page
    .getByRole("link", { name: "Arbitrum Builders Initiative", exact: true })
    .click();
  await expect(page.locator("main h1")).toHaveText(
    "Arbitrum Builders Initiative",
  );
  await expect(page.getByText("Past event", { exact: true })).toBeVisible();
});

test("a partnership enquiry is prepared honestly and can be edited", async ({
  page,
}) => {
  await page.goto("/partners");
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page.locator(".draft-result")).toHaveCount(0);
  await page.getByLabel("Your name").fill("Test Builder");
  await page.getByLabel("Email address").fill("builder@example.com");
  await page
    .getByLabel("Organization", { exact: false })
    .fill("Test community");
  await page
    .getByLabel("What do you have in mind?")
    .fill(
      "We would like to organize a practical developer workshop for our student community.",
    );
  await page.getByRole("button", { name: "Prepare enquiry" }).click();
  await expect(page.getByText("Your message is ready to share")).toBeVisible();
  await expect(page.getByText(/Your enquiry has not been sent/)).toBeVisible();
  await expect(page.getByLabel("Your prepared enquiry")).toHaveValue(
    /builder@example.com/,
  );
  await page.getByRole("button", { name: "Edit my enquiry" }).click();
  await expect(page.getByLabel("Your name")).toHaveValue("Test Builder");
  await expect(page.getByLabel("Your name")).toBeFocused();
});

test("unknown programs return a useful 404", async ({ page }) => {
  const response = await page.goto("/programs/not-a-real-program");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page isn’t here." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL(/\/$/);
});
