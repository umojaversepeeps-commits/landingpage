import { expect, test } from "@playwright/test";

const protectedPaths = [
  "/admin",
  "/admin/programs",
  "/admin/programs/new",
  "/admin/programs/not-a-real-program",
  "/admin/posts",
  "/admin/posts/new",
  "/admin/posts/not-a-real-post",
  "/site/umojaverseupdate",
];

test("anonymous dashboard requests redirect before exposing content", async ({ request }) => {
  const requestHeaders: Record<string, string>[] = [{}, { RSC: "1", "Next-Router-Prefetch": "1" }];
  for (const path of protectedPaths) {
    for (const headers of requestHeaders) {
      const response = await request.get(path, { headers, maxRedirects: 0 });
      expect(response.status(), path).toBe(307);
      const location = new URL(response.headers().location, response.url());
      expect(location.pathname, path).toBe("/admin/login");
      expect(location.searchParams.get("next"), path).toBe(path);
      expect(await response.text(), path).not.toContain("Arbitrum Builders Initiative");
    }
  }
});

test("dashboard sign-in stays accessible and the legacy login preserves its destination", async ({ request }) => {
  const login = await request.get("/admin/login");
  expect(login.status()).toBe(200);
  expect(await login.text()).toContain("Sign in to manage content");

  const legacy = await request.get("/site/umojaverseupdate/login", { maxRedirects: 0 });
  expect(legacy.status()).toBe(307);
  const location = new URL(legacy.headers().location, legacy.url());
  expect(location.pathname).toBe("/admin/login");
  expect(location.searchParams.get("next")).toBe("/site/umojaverseupdate");
});

test("legacy logout returns a GET redirect to sign-in", async ({ request }) => {
  const response = await request.post("/site/umojaverseupdate/logout", { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(new URL(response.headers().location, response.url()).pathname).toBe("/admin/login");
});
