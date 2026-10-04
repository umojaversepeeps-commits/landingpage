import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadModule(path, modules, globals = {}) {
  const source = ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
  ).outputText;
  const context = vm.createContext({
    exports: {},
    ...globals,
    require(name) {
      assert.ok(name in modules, `Unexpected module: ${name}`);
      return modules[name];
    },
  });
  vm.runInContext(source, context);
  return context.exports;
}

function resetApp(options = {}) {
  const calls = [];
  const user = options.user ?? { id: "admin-id", email: "Admin@example.test" };
  const redirect = new Error("Redirect");
  let updateError = options.updateError;
  const modules = {
    "next/navigation": {
      redirect(path) { calls.push(["redirect", path]); throw redirect; },
    },
    "@/lib/supabase/config": {
      isSupabaseConfigured: () => options.configured !== false,
      adminEmails: () => options.allowlist ?? ["admin@example.test"],
    },
    "@/lib/supabase/recovery": {
      async clearRecoveryCookies() { calls.push(["clear"]); },
      async createSupabaseRecoveryClient() {
        calls.push(["client"]);
        return { auth: {
          async verifyOtp(value) {
            calls.push(["verify", JSON.parse(JSON.stringify(value))]);
            return options.invalidToken
              ? { data: { user: null, session: null }, error: { code: "otp_expired" } }
              : { data: { user, session: { access_token: "test-session" } }, error: null };
          },
          async getUser() {
            calls.push(["getUser"]);
            return options.noSession
              ? { data: { user: null }, error: { code: "session_not_found" } }
              : { data: { user }, error: null };
          },
          async updateUser(value) {
            calls.push(["update", JSON.parse(JSON.stringify(value))]);
            const error = updateError;
            updateError = null;
            return { data: { user: error ? null : user }, error };
          },
          async signOut(value) {
            calls.push(["signOut", JSON.parse(JSON.stringify(value))]);
            if (options.signOutThrows) throw new Error("Auth service unavailable");
            return { error: options.signOutError ? { code: "unexpected_failure" } : null };
          },
        } };
      },
    },
  };
  const api = loadModule("../src/app/admin/reset-password/actions.ts", modules);
  return { api, calls, redirect };
}

function form({ tokenHash = "test-recovery-hash", password = " twelve characters ", confirmPassword = password } = {}) {
  const data = new FormData();
  data.set("tokenHash", tokenHash);
  data.set("password", password);
  data.set("confirmPassword", confirmPassword);
  return data;
}

test("password validation happens before consuming a recovery link", async () => {
  for (const values of [
    { password: "short" },
    { password: "x".repeat(129) },
    { confirmPassword: "different password" },
  ]) {
    const app = resetApp();
    const state = await app.api.resetPassword(undefined, form(values));
    assert.ok(state.error);
    assert.equal(state.tokenConsumed, false);
    assert.deepEqual(app.calls, []);
  }
  const app = resetApp();
  const state = await app.api.resetPassword({ tokenConsumed: true }, form({ password: "short" }));
  assert.equal(state.tokenConsumed, true);
  assert.deepEqual(app.calls, []);
});

test("invalid links and missing recovery sessions never change a password", async () => {
  for (const [options, tokenHash] of [
    [{ invalidToken: true }, "invalid-hash"],
    [{ noSession: true }, ""],
    [{ allowlist: [] }, "test-recovery-hash"],
    [{ configured: false }, "test-recovery-hash"],
  ]) {
    const app = resetApp(options);
    const state = await app.api.resetPassword({ tokenConsumed: true }, form({ tokenHash }));
    assert.match(state.error, /invalid or has expired/);
    assert.equal(app.calls.some(([name]) => name === "update"), false);
  }
});

test("only the verified account email grants recovery access", async () => {
  const app = resetApp({ user: { id: "other-id", email: "other@example.test" } });
  const data = form();
  data.set("email", "admin@example.test");
  const state = await app.api.resetPassword(undefined, data);
  assert.match(state.error, /invalid or has expired/);
  assert.equal(state.tokenConsumed, true);
  assert.equal(app.calls.some(([name]) => name === "update"), false);
  assert.equal(app.calls.at(-1)[0], "clear");
});

test("successful recovery preserves password whitespace, revokes sessions, and clears scoped cookies", async () => {
  const app = resetApp();
  await assert.rejects(app.api.resetPassword(undefined, form()), (error) => error === app.redirect);
  assert.deepEqual(app.calls, [
    ["client"],
    ["verify", { type: "recovery", token_hash: "test-recovery-hash" }],
    ["update", { password: " twelve characters " }],
    ["signOut", { scope: "global" }],
    ["clear"],
    ["redirect", "/admin/login?reset=success"],
  ]);
});

test("password policy errors retain the recovery session for a tokenless retry", async () => {
  for (const code of ["same_password", "weak_password", "unexpected_failure"]) {
    const app = resetApp({ updateError: { code, message: "Private provider details" } });
    const state = await app.api.resetPassword(undefined, form());
    assert.ok(state.error);
    assert.equal(state.error.includes("Private provider details"), false);
    assert.equal(state.tokenConsumed, true);
    assert.equal(app.calls.some(([name]) => name === "clear" || name === "signOut"), false);
    await assert.rejects(
      app.api.resetPassword(state, form({ tokenHash: "", password: "another long password" })),
      (error) => error === app.redirect,
    );
    assert.equal(app.calls.filter(([name]) => name === "verify").length, 1);
    assert.equal(app.calls.filter(([name]) => name === "getUser").length, 1);
  }
});

test("a sign-out service failure does not misreport a completed password change", async () => {
  for (const options of [{ signOutThrows: true }, { signOutError: true }]) {
    const app = resetApp(options);
    await assert.rejects(app.api.resetPassword(undefined, form()), (error) => error === app.redirect);
    assert.equal(app.calls.at(-2)[0], "clear");
    assert.equal(app.calls.at(-1)[1], "/admin/login?reset=success");
  }
});

test("recovery cookies cannot read or overwrite normal sessions and expire after fifteen minutes", async () => {
  const values = new Map([
    ["sb-project-auth-token", "normal-session"],
    ["uv-admin-recovery.0", "recovery-session"],
    ["uv-admin-recovery-extra", "unrelated"],
  ]);
  const writes = [];
  let clientOptions;
  const api = loadModule("../src/lib/supabase/recovery.ts", {
    "server-only": {},
    "next/headers": {
      cookies: async () => ({
        getAll: () => [...values].map(([name, value]) => ({ name, value })),
        set(name, value, options) {
          values.set(name, value);
          writes.push({ name, value, options: JSON.parse(JSON.stringify(options)) });
        },
      }),
    },
    "@supabase/ssr": {
      createServerClient(url, key, options) {
        assert.equal(url, "https://project.example.test");
        assert.equal(key, "public-anon-key");
        clientOptions = options;
        return {};
      },
    },
    "./config": { SUPABASE_URL: "https://project.example.test", SUPABASE_ANON_KEY: "public-anon-key" },
  }, { process: { env: { NODE_ENV: "production" } } });

  await api.createSupabaseRecoveryClient();
  assert.equal(clientOptions.cookieOptions.name, "uv-admin-recovery");
  assert.equal(clientOptions.cookies.getAll().length, 1);
  assert.equal(clientOptions.cookies.getAll()[0].name, "uv-admin-recovery.0");
  clientOptions.cookies.setAll([
    { name: "uv-admin-recovery.1", value: "new-chunk", options: { maxAge: 31_536_000, path: "/", httpOnly: false } },
    { name: "uv-admin-recovery.0", value: "", options: { maxAge: 0 } },
    { name: "sb-project-auth-token", value: "forbidden", options: {} },
  ]);
  assert.equal(writes.length, 2);
  assert.deepEqual(writes[0].options, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/admin/reset-password", maxAge: 900,
  });
  assert.equal(writes[1].options.maxAge, 0);
  await api.clearRecoveryCookies();
  assert.equal(values.get("sb-project-auth-token"), "normal-session");
  assert.equal(values.get("uv-admin-recovery-extra"), "unrelated");
  assert.equal(values.get("uv-admin-recovery.1"), "");
  assert.equal(writes.at(-1).options.maxAge, 0);
});
