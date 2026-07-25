import assert from "node:assert/strict";
import test from "node:test";
import {
  comparisonLimit,
  createExplorerLibrary,
  parseExplorerLibrary,
  recordRecentItem,
  toggleComparedItem,
  toggleSavedItem,
} from "../lib/explorer/library-store.mjs";

test("saves programs and careers in separate shelves", () => {
  let library = createExplorerLibrary();
  library = toggleSavedItem(library, "program", "biology");
  library = toggleSavedItem(library, "career", "physician");

  assert.deepEqual(library.savedProgramIds, ["biology"]);
  assert.deepEqual(library.savedCareerIds, ["physician"]);
});

test("limits each comparison to three unique items", () => {
  let library = createExplorerLibrary();
  for (const id of ["biology", "statistics", "data-science"]) {
    library = toggleComparedItem(library, "program", id).library;
  }
  const fourth = toggleComparedItem(library, "program", "public-health");

  assert.equal(library.comparedProgramIds.length, comparisonLimit);
  assert.equal(fourth.limitReached, true);
  assert.deepEqual(fourth.library.comparedProgramIds, library.comparedProgramIds);
});

test("keeps the latest recently viewed item first without duplicates", () => {
  let library = createExplorerLibrary();
  library = recordRecentItem(library, "program", "biology");
  library = recordRecentItem(library, "career", "physician");
  library = recordRecentItem(library, "program", "biology");

  assert.deepEqual(library.recentItems, [
    { type: "program", id: "biology" },
    { type: "career", id: "physician" },
  ]);
});

test("sanitizes stored comparison and recent data", () => {
  const parsed = parseExplorerLibrary({
    version: 1,
    comparedProgramIds: ["a", "a", "b", "c", "d"],
    recentItems: [
      { type: "program", id: "biology" },
      { type: "program", id: "biology" },
      { type: "invalid", id: "x" },
    ],
  });

  assert.deepEqual(parsed.comparedProgramIds, ["a", "b", "c"]);
  assert.deepEqual(parsed.recentItems, [{ type: "program", id: "biology" }]);
});
