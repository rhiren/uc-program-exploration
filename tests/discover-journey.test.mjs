import assert from "node:assert/strict";
import test from "node:test";
import {
  createDiscoverProgress,
  parseDiscoverProgress,
  serializeDiscoverProgress,
} from "../lib/discover/progress-store.mjs";
import { buildProgramRecommendations } from "../lib/discover/recommendations.mjs";

const programs = [
  "biology",
  "biochemistry",
  "data-science",
  "statistics",
  "cognitive-science",
  "public-health",
  "bioengineering",
  "operations-research",
].map((id) => ({
  id,
  name: id,
  summary: `${id} summary`,
  codingUse: 2,
}));

test("round-trips a versioned Discover progress record", () => {
  const progress = createDiscoverProgress();
  progress.answers["problem-style"] = "Find a pattern in evidence";
  progress.savedProgramIds = ["statistics"];

  const restored = parseDiscoverProgress(
    JSON.parse(serializeDiscoverProgress(progress)),
  );

  assert.equal(restored.version, 1);
  assert.equal(
    restored.answers["problem-style"],
    "Find a pattern in evidence",
  );
  assert.deepEqual(restored.savedProgramIds, ["statistics"]);
});

test("rejects unknown progress versions instead of guessing a migration", () => {
  assert.equal(parseDiscoverProgress({ version: 99 }), null);
});

test("returns three diverse paths with transparent slots", () => {
  const recommendations = buildProgramRecommendations(
    {
      "problem-style": "Find a pattern in evidence",
      "activity-style": "A data question",
      "people-systems": "A dataset",
    },
    { more: "More data or quantitative problems" },
    programs,
  );

  assert.equal(recommendations.length, 3);
  assert.deepEqual(
    recommendations.map((item) => item.slot),
    ["evidence_supported", "adjacent", "discovery"],
  );
  assert.equal(new Set(recommendations.map((item) => item.program.id)).size, 3);
  assert.equal(recommendations[0].program.id, "statistics");
});

test("all-skip onboarding still produces three non-predictive starting points", () => {
  const recommendations = buildProgramRecommendations({}, {}, programs);

  assert.equal(recommendations.length, 3);
  assert.match(recommendations[0].reason, /not much evidence/i);
  assert.equal(new Set(recommendations.map((item) => item.program.id)).size, 3);
});

test("makes the student's reaction visible without treating one sampler as a verdict", () => {
  const recommendations = buildProgramRecommendations(
    {
      "problem-style": "Explain how a living system works",
      "activity-style": "A biology mechanism",
    },
    {
      experience: "Draining or too detailed",
      more: "More patient-centered cases",
    },
    programs,
  );

  assert.equal(recommendations[0].program.id, "biology");
  assert.match(recommendations[0].reason, /patient-centered cases/i);
  assert.match(recommendations[0].reason, /molecular activity draining/i);
  assert.match(recommendations[0].reason, /not a verdict/i);
});
