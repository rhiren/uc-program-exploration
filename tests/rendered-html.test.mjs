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
  assert.match(html, /Early preview/);
  assert.match(html, /Progress on this device/);
  assert.match(html, /53(?:<!-- -->)? sources/);
  assert.match(html, /9(?:<!-- -->)? UC campuses/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("renders the foundational and exploration routes", async () => {
  const expectations = [
    ["/discover", /interest gateways/],
    ["/majors", /Every current UC option/],
    ["/campuses", /Compare the nine undergraduate UCs/],
    ["/fit", /Build a path fit snapshot/],
    ["/activities", /Turn everyday commitments into a clear activities inventory/],
    ["/discover/start", /Restoring your private progress/],
    ["/prepare", /A–G at a glance/],
    ["/medical", /Premed is generally a preparation pathway/],
    ["/programs/biology", /Where this appears across the UC system/],
    ["/careers/data-scientist", /Look at tasks, not “job replaced” headlines/],
    ["/explore", /Opening paths saved on this device/],
    ["/compare", /Put the real tradeoffs side by side/],
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

test("makes exhaustive catalog coverage and deep-guide coverage distinct", async () => {
  const response = await render("/majors");
  const html = await response.text();

  assert.match(html, /634/);
  assert.match(html, /campus-major entries/);
  assert.match(html, /Complete for the snapshot/);
  assert.match(html, /Computer Science/);
  assert.match(html, /Full guide available/);
  assert.match(html, /future application cycle/);
});

test("keeps editorial content behind the centralized loader", async () => {
  const [home, discover, prepare, medical, program, career, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/discover/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/prepare/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/medical/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/programs/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/careers/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const page of [home, discover, prepare, medical, program, career]) {
    assert.match(page, /loadContent/);
    assert.doesNotMatch(page, /from ["']@\/content\//);
  }

  assert.match(packageJson, /"validate:content"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
