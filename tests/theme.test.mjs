import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/lib/theme.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;

function browser({ dark = false, saved = null, storageBlocked = false } = {}) {
  const data = new Map(saved === null ? [] : [["umojaverse-theme", saved]]);
  const document = { documentElement: { dataset: {} } };
  const media = Object.assign(new EventTarget(), { matches: dark });
  const window = Object.assign(new EventTarget(), { matchMedia: () => media });
  const localStorage = {
    getItem(key) {
      if (storageBlocked) throw new Error("Storage unavailable");
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error("Storage unavailable");
      data.set(key, value);
    },
  };
  const context = vm.createContext({
    document,
    window,
    localStorage,
    exports: {},
    Event,
  });
  vm.runInContext(source, context);
  const api = context.exports;
  vm.runInContext(api.themeInitScript, context);
  return {
    api,
    data,
    root: document.documentElement.dataset,
    changeSystem(value) {
      media.matches = value;
      media.dispatchEvent(new Event("change"));
    },
    changeOtherTab(key, newValue) {
      window.dispatchEvent(
        Object.assign(new Event("storage"), { key, newValue }),
      );
    },
  };
}

test("first paint honors the device or a saved override, including invalid saved values", () => {
  for (const [dark, saved, expected, preference] of [
    [true, null, "dark", "system"],
    [false, null, "light", "system"],
    [true, "light", "light", "light"],
    [false, "dark", "dark", "dark"],
    [true, "system", "dark", "system"],
    [true, "invalid-value", "dark", "system"],
  ]) {
    const app = browser({ dark, saved });
    assert.equal(app.root.theme, expected);
    assert.equal(app.api.getThemePreference(), preference);
    assert.equal(app.api.getServerThemePreference(), "system");
  }
});

test("a chosen theme survives a reload and system changes do not override it", () => {
  const app = browser({ dark: true });
  let updates = 0;
  const unsubscribe = app.api.subscribeToTheme(() => updates++);
  app.api.setThemePreference("light");
  assert.equal(app.root.theme, "light");
  assert.equal(app.data.get("umojaverse-theme"), "light");
  app.changeSystem(false);
  app.changeSystem(true);
  assert.equal(app.root.theme, "light");
  const reloaded = browser({
    dark: true,
    saved: app.data.get("umojaverse-theme"),
  });
  assert.equal(reloaded.root.theme, "light");
  app.api.setThemePreference("system");
  assert.equal(app.root.theme, "dark");
  app.changeSystem(false);
  assert.equal(app.root.theme, "light");
  assert.equal(app.api.getThemePreference(), "system");
  assert.ok(updates > 1);
  unsubscribe();
  app.changeSystem(true);
  assert.equal(
    app.root.theme,
    "light",
    "unsubscribed listeners must not remain active",
  );
});

test("storage restrictions do not prevent switching or following the device", () => {
  const app = browser({ dark: true, storageBlocked: true });
  assert.equal(app.root.theme, "dark");
  const unsubscribe = app.api.subscribeToTheme(() => {});
  app.api.setThemePreference("light");
  assert.equal(app.root.theme, "light");
  app.changeSystem(false);
  app.changeSystem(true);
  assert.equal(app.root.theme, "light");
  app.api.setThemePreference("system");
  assert.equal(app.root.theme, "dark");
  unsubscribe();
});

test("other tabs can update or clear the preference without unrelated storage interference", () => {
  const app = browser({ dark: true });
  const unsubscribe = app.api.subscribeToTheme(() => {});
  app.changeOtherTab("umojaverse-theme", "light");
  assert.equal(app.root.theme, "light");
  app.changeOtherTab("unrelated", "dark");
  assert.equal(app.root.theme, "light");
  app.changeOtherTab("umojaverse-theme", null);
  assert.equal(app.root.theme, "dark");
  assert.equal(app.api.getThemePreference(), "system");
  app.changeOtherTab("umojaverse-theme", "light");
  app.changeOtherTab(null, null);
  assert.equal(app.api.getThemePreference(), "system");
  assert.equal(app.root.theme, "dark");
  unsubscribe();
});
