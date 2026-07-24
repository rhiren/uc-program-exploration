import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const contentRoot = join(root, "content");
const manifest = JSON.parse(
  await readFile(join(contentRoot, "manifest.json"), "utf8"),
);
const discovered = [];

async function walk(directory) {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    const details = await stat(path);
    if (details.isDirectory()) await walk(path);
    if (details.isFile() && path.endsWith(".json")) discovered.push(path);
  }
}

await walk(contentRoot);
for (const path of discovered) {
  JSON.parse(await readFile(path, "utf8"));
}

const manifestPaths = new Set(manifest.files.map((file) => file.path));
const discoveredPaths = new Set(
  discovered.map((path) => relative(contentRoot, path)),
);

const failures = [];
if (manifest.fileCount !== manifest.files.length) {
  failures.push("manifest fileCount does not match its file list");
}
if (manifestPaths.size !== manifest.files.length) {
  failures.push("manifest contains duplicate paths");
}
for (const path of manifestPaths) {
  if (!discoveredPaths.has(path)) failures.push(`missing file: ${path}`);
}
for (const path of discoveredPaths) {
  if (!manifestPaths.has(path)) failures.push(`unlisted file: ${path}`);
}

if (failures.length) {
  throw new Error(`Content validation failed:\n- ${failures.join("\n- ")}`);
}

console.log(
  `Validated content ${manifest.meta.contentVersion}: ${manifest.fileCount} JSON files.`,
);

