import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const outputRoot = join(root, "out");
const basePath = process.env.PAGES_BASE_PATH ?? "";
const programs = JSON.parse(
  await readFile(join(root, "content", "programs.json"), "utf8"),
).records;
const careers = JSON.parse(
  await readFile(join(root, "content", "careers.json"), "utf8"),
).records;
const routes = [
  "",
  "discover",
  "discover/start",
  "prepare",
  "medical",
  "explore",
  "compare",
  ...programs.map((program) => `programs/${program.slug}`),
  ...careers.map((career) => `careers/${career.slug}`),
];
const failures = [];

for (const route of routes) {
  const htmlPath = join(outputRoot, route, "index.html");
  try {
    await access(htmlPath);
    const html = await readFile(htmlPath, "utf8");

    if (!html.includes("UC Pathways Explorer")) {
      failures.push(`${route || "home"} is missing the product title`);
    }
    if (basePath && !html.includes(`${basePath}/_next/`)) {
      failures.push(`${route || "home"} is missing the Pages asset prefix`);
    }
    if (basePath && !html.includes(`href="${basePath}/favicon.svg"`)) {
      failures.push(`${route || "home"} is missing the Pages favicon prefix`);
    }
  } catch {
    failures.push(`missing static route: ${route || "home"}/index.html`);
  }
}

try {
  await access(join(outputRoot, "404.html"));
} catch {
  failures.push("missing 404.html");
}

if (failures.length) {
  throw new Error(`GitHub Pages validation failed:\n- ${failures.join("\n- ")}`);
}

console.log(
  `Validated GitHub Pages export: ${routes.length} routes at ${
    basePath || "/"
  }.`,
);
