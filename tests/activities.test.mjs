import assert from "node:assert/strict";
import test from "node:test";
import {
  createActivityProgress,
  parseActivityProgress,
} from "../lib/activities/progress-store.mjs";
import {
  buildActivityNextSteps,
  buildActivitySummary,
  buildPiqStorySeeds,
} from "../lib/activities/summary.mjs";

const entries = [
  {
    id: "tutor",
    title: "Math tutoring",
    category: "volunteering",
    organization: "Library",
    role: "Tutor",
    gradeLevels: [10, 11],
    hoursPerWeek: 2,
    weeksPerYear: 30,
    impact: "Tutored middle-school students weekly and helped create practice sheets for algebra review.",
    reflection: "Learned how to explain the same idea in different ways when students were stuck.",
    signals: ["service", "leadership", "academic_interest"],
  },
  {
    id: "family",
    title: "Family translation",
    category: "volunteering",
    organization: "Home",
    role: "Translator",
    gradeLevels: [9, 10, 11],
    hoursPerWeek: 3,
    weeksPerYear: 40,
    impact: "Helped family members understand school and medical paperwork and schedule appointments.",
    reflection: "Saw how language access changes whether people feel confident asking for help.",
    signals: ["family_responsibility", "service"],
  },
];

test("activity progress parser sanitizes and limits entries", () => {
  const parsed = parseActivityProgress({
    version: 1,
    entries: [
      ...entries,
      { title: "", category: "work" },
      { title: "Bad category", category: "surprise", gradeLevels: [8, 9, 12] },
    ],
  });

  assert.equal(parsed.entries.length, 3);
  assert.equal(parsed.entries[2].category, "extracurricular");
  assert.deepEqual(parsed.entries[2].gradeLevels, [9, 12]);
  assert.equal(parseActivityProgress({ version: 99 }), null);
  assert.equal(createActivityProgress().entries.length, 0);
});

test("activity summary surfaces depth and story signals", () => {
  const summary = buildActivitySummary(entries);
  const seeds = buildPiqStorySeeds(entries);
  const steps = buildActivityNextSteps(entries);

  assert.equal(summary.totalEntries, 2);
  assert.equal(summary.sustainedCount, 2);
  assert.ok(summary.signals.some((signal) => signal.id === "service"));
  assert.equal(seeds[0].title, "Math tutoring");
  assert.ok(steps.some((step) => /Path Fit/.test(step.title)));
});
