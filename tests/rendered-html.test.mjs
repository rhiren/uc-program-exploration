import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the product home from validated content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>UC Pathways Explorer<\/title>/i);
  assert.match(html, /Find paths worth exploring/);
  assert.match(html, /Start with Discover/);
  assert.match(html, /Start with Prepare/);
  assert.match(html, /Exploration, not prediction/);
  assert.match(html, /53(?:<!-- -->)? sources/);
  assert.match(html, /9(?:<!-- -->)? UC campuses/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders the three foundational routes", async () => {
  const expectations = [
    ["/discover", /Twelve program families/],
    ["/discover/start", /Restoring your private progress/],
    ["/prepare", /A–G at a glance/],
    ["/medical", /Premed is generally a preparation pathway/],
  ];

  for (const [pathname, expected] of expectations) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }
});

test("describes the study experience before explaining coding", async () => {
  const response = await render("/discover");
  const html = await response.text();

  assert.match(html, /What studying (?:<!-- -->)?Biology(?:<!-- -->)? is really like/);
  assert.match(html, /Typical work/);
  assert.match(html, /Plan and interpret experiments/);
  assert.match(html, /How coding fits/);
  assert.doesNotMatch(html, /What coding is really like/);
});

test("keeps editorial content behind the centralized loader", async () => {
  const [home, discover, prepare, medical, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/discover/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/prepare/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/medical/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const page of [home, discover, prepare, medical]) {
    assert.match(page, /loadContent/);
    assert.doesNotMatch(page, /from ["']@\/content\//);
  }

  assert.match(packageJson, /"validate:content"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
