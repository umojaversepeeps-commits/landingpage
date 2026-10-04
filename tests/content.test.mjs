import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(
  readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;

function content({ authorized = false, configured = true, databaseError = false } = {}) {
  let clients = 0;
  let authorizationChecks = 0;
  const denied = new Error("Admin session required");
  const records = [
    { slug: "published", title: "Published", published: true, published_at: null },
    { slug: "draft", title: "Draft", published: false, published_at: null },
  ];

  function client() {
    clients += 1;
    return {
      from() {
        let rows = records;
        const query = {
          select() { return query; },
          order() { return query; },
          eq(key, value) {
            rows = rows.filter((row) => row[key] === value);
            return query;
          },
          maybeSingle() {
            return Promise.resolve({
              data: databaseError ? null : rows[0] ?? null,
              error: databaseError ? new Error("Database unavailable") : null,
            });
          },
          then(resolve, reject) {
            return Promise.resolve({
              data: databaseError ? null : rows,
              error: databaseError ? new Error("Database unavailable") : null,
            }).then(resolve, reject);
          },
        };
        return query;
      },
    };
  }

  const modules = {
    "server-only": {},
    "./auth": {
      async requireAdmin() {
        authorizationChecks += 1;
        if (!authorized) throw denied;
        return { id: "admin", email: "admin@example.test" };
      },
    },
    "./content-types": { sortPrograms: (programs) => [...programs] },
    "./site": { seedPosts: records, seedPrograms: records },
    "./supabase/config": {
      isSupabaseConfigured: () => configured,
      isSupabaseAdminConfigured: () => true,
    },
    "./supabase/server": {
      createSupabaseAdminClient: client,
      createSupabasePublicClient: client,
    },
  };
  const context = vm.createContext({
    exports: {},
    require(name) {
      assert.ok(name in modules, `Unexpected module: ${name}`);
      return modules[name];
    },
  });
  vm.runInContext(source, context);
  return {
    api: context.exports,
    denied,
    get clients() { return clients; },
    get authorizationChecks() { return authorizationChecks; },
  };
}

test("unpublished reads require an admin before accessing data or falling back", async () => {
  for (const configured of [true, false]) {
    const app = content({ configured });
    for (const method of ["getPrograms", "getPosts", "getProgram", "getPost"]) {
      const args = method.endsWith("s")
        ? [{ includeUnpublished: true }]
        : ["draft", { includeUnpublished: true }];
      await assert.rejects(app.api[method](...args), (error) => error === app.denied);
    }
    assert.equal(app.authorizationChecks, 4);
    assert.equal(app.clients, 0);
  }
});

test("public lists and detail reads exclude drafts even without a database policy", async () => {
  const { api } = content();
  for (const method of ["getPrograms", "getPosts"]) {
    const rows = await api[method]();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].slug, "published");
  }
  for (const method of ["getProgram", "getPost"]) {
    assert.equal(await api[method]("draft"), null);
    assert.equal((await api[method]("published")).slug, "published");
  }
});

test("public fallback content excludes drafts when unconfigured or unavailable", async () => {
  for (const options of [{ configured: false }, { databaseError: true }]) {
    const { api } = content(options);
    for (const method of ["getPrograms", "getPosts"]) {
      const rows = await api[method]();
      assert.equal(rows.length, 1);
      assert.equal(rows[0].slug, "published");
    }
    assert.equal(await api.getProgram("draft"), null);
    assert.equal(await api.getPost("draft"), null);
  }
});

test("authorized admin reads can include drafts", async () => {
  const app = content({ authorized: true });
  assert.equal((await app.api.getPrograms({ includeUnpublished: true })).length, 2);
  assert.equal((await app.api.getPosts({ includeUnpublished: true })).length, 2);
  assert.equal((await app.api.getProgram("draft", { includeUnpublished: true })).slug, "draft");
  assert.equal((await app.api.getPost("draft", { includeUnpublished: true })).slug, "draft");
  assert.equal(app.authorizationChecks, 4);
});
